import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Truck, Phone, MapPin, Plus, Pencil, Trash2,
  X, Mail, Building2, Minus, PackageCheck,
} from 'lucide-react';
import { fournisseurs as fApi, fournisseurOrders as ordersApi } from '../api';
import { restoreStocks, decrementStocks, idToKey } from '../utils/stock';

const font = { fontFamily: "'DM Sans', sans-serif" };
const accent = '#5a7a9b';

// ── Stock key lookup from filesystem catalog ───────────────────────────────────
const RAW_MODULES = import.meta.glob(
  '../../assets/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG}',
  { eager: true }
);
const KY_CATS = new Set(['KY1', 'KY2']);
const CATALOG_FLAT = Object.keys(RAW_MODULES).map(path => {
  const parts = path.replace('../../assets/', '').split('/');
  const topCat = parts[0];
  const name = KY_CATS.has(topCat) && parts.length >= 3
    ? parts[parts.length - 2]
    : parts[parts.length - 1].replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
  return { name, category: parts.slice(0, -1).join(' / '), stockId: idToKey(path) };
});

function findStockKey(productName, productCategory) {
  return CATALOG_FLAT.find(p => p.name === productName && p.category === productCategory)?.stockId || null;
}

// ── Statuts ───────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'en_attente', label: 'En attente', bg: '#F5F3FF', color: '#7C3AED' },
  { value: 'confirme',   label: 'Confirmé',   bg: '#FFF7ED', color: '#C2410C' },
  { value: 'recu',       label: 'Reçu',       bg: '#EAF5EC', color: '#3D7A47' },
];
const getStatus = val => STATUS_OPTIONS.find(o => o.value === val) || STATUS_OPTIONS[0];

function formatDate(d) {
  const dt = new Date(d);
  const p = n => String(n).padStart(2, '0');
  return `${p(dt.getDate())}/${p(dt.getMonth()+1)}/${dt.getFullYear()} ${p(dt.getHours())}:${p(dt.getMinutes())}`;
}
function todayLocal() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

// ── Ligne produit dans la modal de commande ───────────────────────────────────
function ItemRow({ item, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5">
      <div className="flex-1 min-w-0">
        <select 
          value={`${item.productCategory}|${item.productName}`}
          onChange={e => {
            const [cat, name] = e.target.value.split('|');
            onChange({ ...item, productName: name, productCategory: cat });
          }}
          className="w-full text-sm font-medium outline-none bg-transparent" style={{ color: '#1a1212' }}
        >
          <option value="|" disabled>Sélectionner un produit…</option>
          {CATALOG_FLAT.map(p => (
            <option key={p.stockId} value={`${p.category}|${p.name}`}>
              {p.category ? `${p.category} / ` : ''}{p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button onClick={() => onChange({ ...item, quantity: Math.max(1, item.quantity - 1) })}
          className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
          <Minus size={10} style={{ color: accent }} />
        </button>
        <span className="text-sm font-bold w-6 text-center" style={{ color: '#1a1212' }}>{item.quantity}</span>
        <button onClick={() => onChange({ ...item, quantity: item.quantity + 1 })}
          className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
          <Plus size={10} style={{ color: accent }} />
        </button>
      </div>
      <button onClick={onRemove} className="text-gray-300 hover:text-red-400 flex-shrink-0"><X size={14} /></button>
    </div>
  );
}

// ── Modal Nouvelle commande ────────────────────────────────────────────────────
function OrderModal({ onClose, onSave }) {
  const [items,  setItems]  = useState([{ productName: '', productCategory: '', quantity: 1 }]);
  const [form,   setForm]   = useState({ status: 'en_attente', date: todayLocal(), remarque: '' });
  const [err,    setErr]    = useState('');
  const [saving, setSaving] = useState(false);

  const addItem = () => setItems(p => [...p, { productName: '', productCategory: '', quantity: 1 }]);
  const removeItem = i => setItems(p => p.filter((_, idx) => idx !== i));
  const changeItem = (i, val) => setItems(p => p.map((x, idx) => idx === i ? val : x));

  const submit = async () => {
    const valid = items.filter(x => x.productName.trim());
    if (!valid.length) { setErr('Ajoutez au moins un produit'); return; }
    setSaving(true); setErr('');
    try {
      await onSave({
        items: valid.map(x => ({ productName: x.productName.trim(), productCategory: x.productCategory.trim(), quantity: x.quantity })),
        status: form.status,
        date: new Date(form.date).toISOString(),
        remarque: form.remarque.trim(),
      });
      onClose();
    } catch (e) { setErr(e.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight: '90vh', ...font }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#e8f0f8,#dce8f4)', color: accent }}>
              <PackageCheck size={16} />
            </div>
            <h2 className="font-bold text-base" style={{ color: '#1a1212' }}>Nouvelle commande fournisseur</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {err && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{err}</p>}

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#5a7a9b' }}>Produits à commander</p>
              <button onClick={addItem} className="flex items-center gap-1 text-xs font-semibold" style={{ color: accent }}>
                <Plus size={12} /> Ajouter une ligne
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((item, i) => (
                <ItemRow key={i} item={item} onChange={val => changeItem(i, val)} onRemove={() => removeItem(i)} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>État</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:ring-1 focus:ring-[#9E8A9C]">
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Date</label>
              <input type="datetime-local" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Remarque</label>
            <textarea value={form.remarque} onChange={e => setForm(f => ({ ...f, remarque: e.target.value }))} rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none resize-none focus:ring-1 focus:ring-[#9E8A9C]" />
          </div>
        </div>

        <div className="flex gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50" style={{ color: '#5e4d4d' }}>Annuler</button>
          <button onClick={submit} disabled={saving} className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg,#5a7a9b,#7a9ab5)', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Modifier commande ───────────────────────────────────────────────────
function EditOrderModal({ order, onClose, onSave }) {
  const [form, setForm] = useState({ status: order.status, remarque: order.remarque || '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    setSaving(true);
    try { await onSave(order._id, { status: form.status, remarque: form.remarque }); onClose(); }
    catch (e) { setErr(e.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" style={font} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-base" style={{ color: '#1a1212' }}>Modifier la commande</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          {err && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>État</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:ring-1 focus:ring-[#9E8A9C]">
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Remarque</label>
            <textarea value={form.remarque} onChange={e => setForm(f => ({ ...f, remarque: e.target.value }))} rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none resize-none focus:ring-1 focus:ring-[#9E8A9C]" />
          </div>
        </div>
        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50" style={{ color: '#5e4d4d' }}>Annuler</button>
          <button onClick={submit} disabled={saving} className="px-5 py-2.5 rounded-xl text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg,#5a7a9b,#7a9ab5)', opacity: saving ? 0.7 : 1 }}>
            {saving ? '…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers stock ─────────────────────────────────────────────────────────────
function toStockItems(order) {
  return (order.items || []).map(item => ({
    stockId: findStockKey(item.productName, item.productCategory),
    quantity: item.quantity || 1,
  }));
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function FournisseurDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fournisseur,   setFournisseur]   = useState(null);
  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [showAdd,       setShowAdd]       = useState(false);
  const [editingOrder,  setEditingOrder]  = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [f, o] = await Promise.all([fApi.get(id), ordersApi.list(id)]);
        setFournisseur(f); setOrders(o);
      } catch (e) { setError(e.message || 'Erreur de chargement'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleAddOrder = async data => {
    const order = await ordersApi.create(id, data);
    if (data.status === 'recu') restoreStocks(toStockItems(order));
    setOrders(prev => [order, ...prev]);
  };

  const handleUpdateOrder = async (orderId, data) => {
    const prev = orders.find(o => o._id === orderId);
    const updated = await ordersApi.update(orderId, data);
    if (data.status === 'recu' && prev?.status !== 'recu') restoreStocks(toStockItems(updated));
    if (prev?.status === 'recu' && data.status !== 'recu') decrementStocks(toStockItems(prev));
    setOrders(o => o.map(x => x._id === orderId ? updated : x));
  };

  const handleDeleteOrder = async orderId => {
    if (!window.confirm('Supprimer cette commande ?')) return;
    const order = orders.find(o => o._id === orderId);
    await ordersApi.remove(orderId);
    if (order?.status === 'recu') decrementStocks(toStockItems(order));
    setOrders(o => o.filter(x => x._id !== orderId));
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-white" style={font}>
      <p className="text-sm" style={{ color: '#9a8585' }}>Chargement…</p>
    </div>
  );
  if (error || !fournisseur) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-white" style={font}>
      <p className="text-sm text-red-500">{error || 'Fournisseur introuvable'}</p>
      <button onClick={() => navigate('/fournisseurs')} className="text-sm underline" style={{ color: accent }}>Retour</button>
    </div>
  );

  const totalUnites = orders.reduce((s, o) => s + (o.items || []).reduce((ss, i) => ss + (i.quantity || 1), 0), 0);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-white" style={font}>
      {/* Container d'entête */}
      <div className="flex items-center justify-between mb-8 flex-wrap">
        <div>
          <h1 className="font-bold text-2xl" style={{ color: '#1a1212', fontFamily: "'DM Serif Display', serif" }}>
            Commandes Fournisseur
          </h1>
          <p className="text-sm font-medium mt-1" style={{ color: '#9a8585' }}>
            Gestion centralisée de vos commandes avec votre fournisseur de produits
          </p>
        </div>
      </div>

      <hr className="border-gray-100 mb-8" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Commandes totales', value: orders.length },
          { label: 'Unités commandées',  value: totalUnites },
          { label: 'Commandes reçues',   value: orders.filter(o => o.status === 'recu').length },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border p-5 text-center" style={{ borderColor: '#dce8f4', background: '#f8fbff' }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: accent, display: 'block' }}>{s.value}</span>
            <p className="text-sm font-medium mt-1" style={{ color: '#5e6d7a' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table des commandes */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-lg" style={{ color: '#1a1212' }}>Historique des commandes</h2>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition"
          style={{ background: 'linear-gradient(135deg,#5a7a9b,#7a9ab5)', boxShadow: '0 4px 12px rgba(90,122,155,.28)' }}>
          <Plus size={15} /> Nouvelle commande
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-36 gap-2 border border-dashed border-gray-200 rounded-2xl">
          <p className="text-sm font-semibold" style={{ color: '#9a8585' }}>Aucune commande pour ce fournisseur</p>
          <button onClick={() => setShowAdd(true)} className="text-xs underline" style={{ color: accent }}>Créer la première commande</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate" style={{ borderSpacing: '0 6px' }}>
            <thead>
              <tr>
                {['Produits', 'Unités', 'Date', 'État', ''].map(h => (
                  <th key={h} className="pb-2 px-4 text-left text-[10px] font-bold uppercase tracking-wider" style={{ color: '#9b7a8a' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const st = getStatus(order.status);
                const items = order.items || [];
                const totalQty = items.reduce((s, i) => s + (i.quantity || 1), 0);
                const first = items[0]?.productName || '—';
                const rest = items.length - 1;
                return (
                  <tr key={order._id} className="bg-white">
                    <td className="px-4 py-3 rounded-l-2xl border-y border-l border-gray-100">
                      <p className="font-semibold" style={{ color: '#1a1212' }}>
                        {first}{rest > 0 && <span className="ml-1 text-xs font-normal" style={{ color: '#9a8585' }}>+{rest} autre{rest > 1 ? 's' : ''}</span>}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#9a8585' }}>{items.length} produit{items.length > 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-4 py-3 border-y border-gray-100 font-bold" style={{ color: accent }}>{totalQty}</td>
                    <td className="px-4 py-3 border-y border-gray-100 text-xs" style={{ color: '#7a6060' }}>{formatDate(order.date)}</td>
                    <td className="px-4 py-3 border-y border-gray-100">
                      <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3 rounded-r-2xl border-y border-r border-gray-100">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => setEditingOrder(order)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition">
                          <Pencil size={13} style={{ color: '#9a8585' }} />
                        </button>
                        <button onClick={() => handleDeleteOrder(order._id)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 transition">
                          <Trash2 size={13} style={{ color: '#c49aaa' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showAdd      && <OrderModal onClose={() => setShowAdd(false)} onSave={handleAddOrder} />}
      {editingOrder && <EditOrderModal order={editingOrder} onClose={() => setEditingOrder(null)} onSave={handleUpdateOrder} />}
    </div>
  );
}
