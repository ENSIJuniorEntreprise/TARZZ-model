import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, User, Phone, MapPin, Plus, Pencil, Trash2,
  X, Search, Check, ShoppingCart, Folder, ChevronRight, Printer, Minus,
} from 'lucide-react';
import { clients as clientsApi, clientOrders as ordersApi } from '../api';
import {
  loadStocks, idToKey, getByKey,
  checkStocks, decrementStocks, restoreStocks,
  DEFAULT_STOCK, LOW_STOCK_THRESHOLD,
} from '../utils/stock';
import { mergeCatalog, sortedChildren, flattenTree } from '../utils/catalog';

function findImageUrl(flat, productName, productCategory) {
  return flat.find(p => p.name === productName && p.category === productCategory)?.url || null;
}

function findStockId(flat, productName, productCategory) {
  return flat.find(p => p.name === productName && p.category === productCategory)?.stockId || null;
}

// ── Constantes ────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'en_commande', label: 'En commande', bg: '#FAE8E8', color: '#B04040' },
  { value: 'en_cours',    label: 'En cours',    bg: '#FFF7ED', color: '#C2410C' },
  { value: 'livre',       label: 'Livré',       bg: '#EAF5EC', color: '#3D7A47' },
];

function getStatus(val) {
  return STATUS_OPTIONS.find(o => o.value === val) || STATUS_OPTIONS[0];
}

function formatDate(d) {
  const dt = new Date(d);
  const p = n => String(n).padStart(2, '0');
  return `${p(dt.getDate())}/${p(dt.getMonth()+1)}/${dt.getFullYear()} - ${p(dt.getHours())}:${p(dt.getMinutes())}`;
}

function todayLocal() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

// ── PDF ───────────────────────────────────────────────────────────────────────
function buildPrintHTML(order, client, flat) {
  const STATUS_LABELS = { en_commande: 'En commande', en_cours: 'En cours', livre: 'Livré' };
  const STATUS_BG     = { en_commande: '#FAE8E8', en_cours: '#FFF7ED', livre: '#EAF5EC' };
  const STATUS_COLOR  = { en_commande: '#B04040', en_cours: '#C2410C', livre: '#3D7A47' };
  const dt = new Date(order.date);
  const p  = n => String(n).padStart(2, '0');
  const dateStr = `${p(dt.getDate())}/${p(dt.getMonth()+1)}/${dt.getFullYear()}`;
  const origin = window.location.origin;
  const items = order.items || [];

  // Responsive columns: 2 if ≤4 items, 3 otherwise
  const cols = items.length <= 4 ? 2 : 3;
  const imgH = cols === 2 ? '220px' : '170px';

  const cards = items.map((item, i) => {
    const rel = findImageUrl(flat, item.productName, item.productCategory);
    const src = rel ? origin + rel : '';
    const imgBlock = src
      ? `<img src="${src}" style="width:100%;height:${imgH};object-fit:cover;display:block">`
      : `<div style="width:100%;height:${imgH};background:#f4f4f5;display:flex;align-items:center;justify-content:center;color:#c4b0aa;font-size:13px">—</div>`;
    const qtyBadge = (item.quantity || 1) > 1
      ? `<span style="display:inline-block;background:#f0e8f4;color:#9b6b7a;font-size:10px;font-weight:700;padding:2px 10px;border-radius:20px;margin-top:6px">× ${item.quantity}</span>`
      : '';
    return `
      <div style="border:1.5px solid #f0ebe8;border-radius:14px;overflow:hidden;break-inside:avoid">
        ${imgBlock}
        <div style="padding:12px 14px">
          <p style="font-weight:700;font-size:14px;color:#1a1212;margin:0 0 3px">${item.productName}</p>
          <p style="font-size:11px;color:#9a8585;margin:0">${item.productCategory || '—'}</p>
          ${qtyBadge}
        </div>
      </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Commande — ${client.prenom} ${client.nom}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1212;padding:40px;max-width:800px;margin:0 auto}
    .header{text-align:center;margin-bottom:28px}
    .brand{font-size:30px;font-weight:800;letter-spacing:.04em}
    .accent{color:#9b6b7a}
    .sub{font-size:11px;color:#7a6060;letter-spacing:.18em;margin-top:5px;text-transform:uppercase}
    .stripe{height:3px;width:48px;background:linear-gradient(90deg,#9b6b7a,#c49aaa);border-radius:4px;margin:14px auto 0}
    hr{border:none;border-top:1.5px solid #f0e8f4;margin:22px 0}
    .meta{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:4px}
    .lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:#9b8095;margin-bottom:4px}
    .val{font-size:14px;font-weight:600;color:#1a1212}
    .val-sm{font-size:12px;color:#5e4d4d;margin-top:3px}
    .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;margin-top:5px}
    .sec{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:#9b8095;margin-bottom:16px}
    .grid{display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px}
    .footer{margin-top:40px;text-align:center;font-size:10px;color:#c4b0aa}
    @media print{body{padding:20px}}
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">HAJTAJEB<span class="accent"> Model</span></div>
    <div class="sub">Tapis · Bijoux · Modèles</div>
    <div class="stripe"></div>
  </div>
  <hr>
  <div class="meta">
    <div>
      <div class="lbl">Client</div>
      <div class="val">${client.prenom} ${client.nom}</div>
      ${client.phone  ? `<div class="val-sm">${client.phone}</div>`  : ''}
      ${client.adresse ? `<div class="val-sm">${client.adresse}</div>` : ''}
    </div>
    <div>
      <div class="lbl">Date de commande</div>
      <div class="val">${dateStr}</div>
      <div style="margin-top:14px">
        <div class="lbl">État</div>
        <span class="badge" style="background:${STATUS_BG[order.status]};color:${STATUS_COLOR[order.status]}">${STATUS_LABELS[order.status] || order.status}</span>
      </div>
    </div>
  </div>
  ${order.remarque ? `<div style="margin:14px 0"><div class="lbl">Remarque</div><div class="val-sm" style="font-style:italic;margin-top:4px">${order.remarque}</div></div>` : ''}
  <hr>
  <div class="sec">Produits commandés (${items.length})</div>
  <div class="grid">${cards}</div>
  <div class="footer">Document généré le ${new Date().toLocaleDateString('fr-FR')}</div>
</body>
</html>`;
}

// ── ProductCard ───────────────────────────────────────────────────────────────
function ProductCard({ product, inCart, onToggle, stock }) {
  const outOfStock = stock === 0 && !inCart;
  const stockColor = stock === 0 ? '#ef4444' : stock <= LOW_STOCK_THRESHOLD ? '#f59e0b' : '#22c55e';
  return (
    <button
      onClick={() => !outOfStock && onToggle(product)}
      className="flex flex-col items-center gap-1.5 rounded-xl border-2 p-2 transition-all text-center"
      style={{
        borderColor: inCart ? '#9b6b7a' : outOfStock ? '#fde8e8' : '#f0ede8',
        backgroundColor: inCart ? '#fdf5f7' : outOfStock ? '#fff8f8' : '#fff',
        opacity: outOfStock ? 0.6 : 1,
        cursor: outOfStock ? 'not-allowed' : 'pointer',
      }}
    >
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
        <img src={product.url} alt={product.name} className="w-full h-full object-cover" />
        {inCart && (
          <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#9b6b7a' }}>
            <Check size={10} color="white" />
          </div>
        )}
      </div>
      <p className="text-[10px] font-semibold leading-tight line-clamp-2 w-full" style={{ color: '#1a1212' }}>{product.name}</p>
      <span className="text-[9px] font-bold" style={{ color: stockColor }}>
        {stock === 0 ? 'Rupture' : `Stock : ${stock}`}
      </span>
    </button>
  );
}

// ── Modal Panier ──────────────────────────────────────────────────────────────
function CartOrderModal({ tree, flat, onClose, onSave }) {
  const [search, setSearch]           = useState('');
  const [currentPath, setCurrentPath] = useState([]);
  // cart items: { id, name, category, url, quantity }
  const [cart, setCart]               = useState([]);
  const [form, setForm]               = useState({ status: 'en_commande', date: todayLocal(), remarque: '' });
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState('');

  const currentNode = useMemo(() => {
    let node = { images: [], children: tree };
    for (const part of currentPath) { node = node.children?.[part]; if (!node) return { images: [], children: {} }; }
    return node;
  }, [tree, currentPath]);

  const subCats = useMemo(() => sortedChildren(currentNode), [currentNode]);

  const stocks = useMemo(() => loadStocks(), []);

  const currentProducts = useMemo(() => {
    const catPath = currentPath.join(' / ');
    return currentNode.images.map(img => ({
      id: img.id,
      name: img.displayName || img.name,
      category: catPath,
      url: img.url,
      stockId: idToKey(img.id),
      virtual: !!img.virtual,
    }));
  }, [currentNode, currentPath]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return flat.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [flat, search]);

  const isInCart = id => cart.some(p => p.id === id);

  const toggleProduct = product => {
    setCart(prev =>
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, { ...product, quantity: 1 }]
    );
    setError('');
  };

  const changeQty = (id, delta) => {
    setCart(prev => prev.map(p =>
      p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
    ));
  };

  const setQty = (id, val) => {
    const n = parseInt(val);
    if (!isNaN(n) && n >= 1) setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: n } : p));
  };

  const navTo = path => { setCurrentPath(path); setSearch(''); };

  const submit = async () => {
    if (cart.length === 0) { setError('Sélectionnez au moins un produit'); return; }
    const stockErrors = checkStocks(cart);
    if (stockErrors.length > 0) { setError(stockErrors[0]); return; }
    setSaving(true); setError('');
    try {
      await onSave(cart, { status: form.status, date: form.date, remarque: form.remarque.trim() });
      onClose();
    } catch (e) {
      setError(e.message || 'Erreur lors de l\'enregistrement');
    } finally { setSaving(false); }
  };

  const isSearching = search.trim().length > 0;
  const totalItems  = cart.reduce((s, p) => s + p.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden"
        style={{ height: '88vh', fontFamily: "'DM Sans', sans-serif" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f0e8f4,#e8dff0)', color: '#9b6b7a' }}>
              <ShoppingCart size={16} />
            </div>
            <h2 className="font-bold text-base" style={{ color: '#1a1212' }}>Nouvelle commande</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><X size={20} /></button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* ── Left: products ── */}
          <div className="flex-1 flex flex-col border-r border-gray-100 min-w-0">
            <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#c4b0aa' }} />
                <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit…"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]" />
              </div>
            </div>

            {!isSearching && (
              <div className="px-4 py-2 border-b border-gray-50 flex items-center gap-1 flex-wrap flex-shrink-0 min-h-[36px]">
                <button onClick={() => navTo([])} className="text-xs font-semibold hover:underline" style={{ color: currentPath.length === 0 ? '#1a1212' : '#9b6b7a' }}>Catalogue</button>
                {currentPath.map((part, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <ChevronRight size={10} style={{ color: '#c4b0aa' }} />
                    <button onClick={() => navTo(currentPath.slice(0, i+1))} className="text-xs font-semibold hover:underline" style={{ color: i === currentPath.length-1 ? '#1a1212' : '#9b6b7a' }}>{part}</button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4">
              {isSearching ? (
                searchResults.length === 0
                  ? <div className="flex items-center justify-center h-full text-sm" style={{ color: '#c4b0aa' }}>Aucun produit trouvé</div>
                  : <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                      {searchResults.map(p => <ProductCard key={p.id} product={p} inCart={isInCart(p.id)} onToggle={toggleProduct} stock={getByKey(p.stockId, stocks)} />)}
                    </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {subCats.length > 0 && (
                    <div>
                      {currentProducts.length > 0 && <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9b8095' }}>Sous-catégories</p>}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {subCats.map(cat => {
                          const child = currentNode.children[cat];
                          const sub = Object.keys(child.children).length;
                          const img = child.images.length;
                          const desc = sub > 0 ? `${sub} dossier${sub>1?'s':''}` : img > 0 ? `${img} produit${img>1?'s':''}` : '';
                          return (
                            <button key={cat} onClick={() => navTo([...currentPath, cat])} className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 hover:border-[#c49aaa] hover:bg-[#fdf5f7] transition text-left">
                              <Folder size={20} className="flex-shrink-0" style={{ color: '#c49aaa' }} />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold truncate" style={{ color: '#1a1212' }}>{cat}</p>
                                {desc && <p className="text-[10px]" style={{ color: '#9a8585' }}>{desc}</p>}
                              </div>
                              <ChevronRight size={14} className="ml-auto flex-shrink-0" style={{ color: '#d4c5be' }} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {currentProducts.length > 0 && (
                    <div>
                      {subCats.length > 0 && <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9b8095' }}>Produits</p>}
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                        {currentProducts.map(p => <ProductCard key={p.id} product={p} inCart={isInCart(p.id)} onToggle={toggleProduct} stock={getByKey(p.stockId, stocks)} />)}
                      </div>
                    </div>
                  )}
                  {subCats.length === 0 && currentProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 gap-2" style={{ color: '#c4b0aa' }}>
                      <Folder size={36} strokeWidth={1} /><p className="text-sm">Dossier vide</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: panier + formulaire ── */}
          <div className="w-80 flex flex-col flex-shrink-0">
            <div className="flex-1 overflow-y-auto px-4 pt-4 min-h-0">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9b8095' }}>
                Panier · {cart.length} article{cart.length !== 1 ? 's' : ''} ({totalItems} unité{totalItems !== 1 ? 's' : ''})
              </p>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 mt-8">
                  <ShoppingCart size={32} strokeWidth={1} style={{ color: '#e0d4d4' }} />
                  <p className="text-xs text-center" style={{ color: '#c4b0aa' }}>Cliquez sur un produit pour l'ajouter</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {cart.map(p => (
                    <div key={p.id} className="rounded-xl p-2" style={{ backgroundColor: '#fdf5f7' }}>
                      <div className="flex items-center gap-2">
                        <img src={p.url} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: '#1a1212' }}>{p.name}</p>
                          <p className="text-[10px] truncate" style={{ color: '#9a8585' }}>{p.category}</p>
                        </div>
                        <button onClick={() => toggleProduct(p)} className="text-gray-300 hover:text-red-400 transition flex-shrink-0 ml-1"><X size={12} /></button>
                      </div>
                      {/* Quantity control */}
                      <div className="flex items-center gap-2 mt-2 pl-12">
                        <button
                          onClick={() => changeQty(p.id, -1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center border transition hover:bg-gray-100"
                          style={{ borderColor: '#e0d8d8' }}
                        >
                          <Minus size={10} style={{ color: '#9b6b7a' }} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={p.quantity}
                          onChange={e => setQty(p.id, e.target.value)}
                          className="w-10 text-center text-xs font-bold border rounded-lg py-0.5 outline-none focus:ring-1 focus:ring-[#9E8A9C]"
                          style={{ borderColor: '#e0d8d8', color: '#1a1212' }}
                        />
                        <button
                          onClick={() => changeQty(p.id, 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center border transition hover:bg-[#f0e8f4]"
                          style={{ borderColor: '#e0d8d8' }}
                        >
                          <Plus size={10} style={{ color: '#9b6b7a' }} />
                        </button>
                        <span className="text-[10px]" style={{ color: '#9a8585' }}>unité{p.quantity !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-4 border-t border-gray-100 flex flex-col gap-3 flex-shrink-0">
              {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              <div>
                <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>État</label>
                <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:ring-1 focus:ring-[#9E8A9C]">
                  {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Date</label>
                <input type="datetime-local" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]" />
              </div>
              <div>
                <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Remarque</label>
                <textarea value={form.remarque} onChange={e => setForm(f => ({...f, remarque: e.target.value}))} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none resize-none focus:ring-1 focus:ring-[#9E8A9C]" />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition" style={{ color: '#5e4d4d' }}>Annuler</button>
                <button
                  onClick={submit}
                  disabled={saving || cart.length === 0}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition"
                  style={{ background: 'linear-gradient(135deg,#9b6b7a,#b07585)', opacity: saving || cart.length === 0 ? 0.5 : 1 }}
                >
                  {saving ? 'Ajout…' : `Enregistrer (${totalItems})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal Modifier ────────────────────────────────────────────────────────────
function EditOrderModal({ order, onClose, onSave }) {
  const [form, setForm] = useState({ status: order.status, remarque: order.remarque || '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const items = order.items || [];

  const submit = async () => {
    setSaving(true);
    try { await onSave(order._id || order.id, { status: form.status, remarque: form.remarque }); onClose(); }
    catch (e) { setError(e.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()} style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-base" style={{ color: '#1a1212' }}>Modifier la commande</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-xs mb-1" style={{ color: '#9a8585' }}>{items.length} produit{items.length > 1 ? 's' : ''}</p>
            {items.slice(0, 3).map((it, i) => (
              <p key={i} className="text-xs font-semibold truncate" style={{ color: '#1a1212' }}>
                {it.productName}{(it.quantity||1) > 1 ? ` × ${it.quantity}` : ''}
              </p>
            ))}
            {items.length > 3 && <p className="text-xs" style={{ color: '#9a8585' }}>+{items.length-3} autres</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>État</label>
            <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-1 focus:ring-[#9E8A9C]">
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Remarque</label>
            <textarea value={form.remarque} onChange={e => setForm(f => ({...f, remarque: e.target.value}))} rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none resize-none focus:ring-1 focus:ring-[#9E8A9C]" />
          </div>
        </div>
        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition" style={{ color: '#5e4d4d' }}>Annuler</button>
          <button onClick={submit} disabled={saving} className="px-5 py-2.5 rounded-xl text-white text-sm font-bold transition" style={{ background: 'linear-gradient(135deg,#9b6b7a,#b07585)', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Sauvegarde…' : 'Modifier'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Impression ──────────────────────────────────────────────────────────
function PrintOrderModal({ order, client, flat, onClose }) {
  const st    = getStatus(order.status);
  const items = order.items || [];

  const handlePrint = () => {
    const html = buildPrintHTML(order, client, flat);
    const win  = window.open('', '_blank', 'width=860,height=700');
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()} style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f0e8f4,#e8dff0)', color: '#9b6b7a' }}>
              <Printer size={16} />
            </div>
            <h2 className="font-bold text-base" style={{ color: '#1a1212' }}>Aperçu de la commande</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-4">
            <div>
              <p className="font-bold text-sm" style={{ color: '#1a1212' }}>{client.prenom} {client.nom}</p>
              <p className="text-xs mt-0.5" style={{ color: '#9a8585' }}>{formatDate(order.date)}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
          </div>
          {order.remarque && <p className="text-xs italic mb-4 px-1" style={{ color: '#9a8585' }}>{order.remarque}</p>}

          <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9b8095' }}>
            Produits ({items.length})
          </p>
          <div className="flex flex-col gap-2">
            {items.map((item, i) => {
              const imgUrl = findImageUrl(flat, item.productName, item.productCategory);
              return (
                <div key={i} className="flex items-center gap-3 rounded-xl p-2" style={{ backgroundColor: '#fdf5f7' }}>
                  {imgUrl
                    ? <img src={imgUrl} alt={item.productName} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    : <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: '#1a1212' }}>{item.productName}</p>
                    <p className="text-[10px] truncate" style={{ color: '#9a8585' }}>{item.productCategory || '—'}</p>
                  </div>
                  {(item.quantity || 1) > 1 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#f0e8f4', color: '#9b6b7a' }}>
                      × {item.quantity}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition" style={{ color: '#5e4d4d' }}>Fermer</button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition" style={{ background: 'linear-gradient(135deg,#9b6b7a,#b07585)' }}>
            <Printer size={14} /> Imprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient]             = useState(null);
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [printingOrder, setPrintingOrder] = useState(null);

  const catalog = useMemo(() => mergeCatalog(), []);
  const catalogFlat = useMemo(() => flattenTree(catalog.tree), [catalog]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [c, o] = await Promise.all([clientsApi.get(id), ordersApi.list(id)]);
        setClient(c); setOrders(o);
      } catch (e) { setError(e.message || 'Erreur de chargement'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleAddOrder = async (cartItems, settings) => {
    const order = await ordersApi.create(id, {
      items: cartItems.map(p => ({ productName: p.name, productCategory: p.category, quantity: p.quantity || 1 })),
      status: settings.status,
      date: new Date(settings.date).toISOString(),
      remarque: settings.remarque,
    });
    decrementStocks(cartItems.map(p => ({ stockId: p.stockId, quantity: p.quantity || 1 })));
    setOrders(prev => [order, ...prev]);
  };

  const handleUpdateOrder = async (orderId, data) => {
    const updated = await ordersApi.update(orderId, data);
    setOrders(prev => prev.map(o => (o._id === orderId || o.id === orderId) ? updated : o));
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Supprimer cette commande ?')) return;
    const order = orders.find(o => o._id === orderId || o.id === orderId);
    await ordersApi.remove(orderId);
    if (order?.items) {
      restoreStocks(order.items.map(item => ({
        stockId: findStockId(catalogFlat, item.productName, item.productCategory),
        quantity: item.quantity || 1,
      })));
    }
    setOrders(prev => prev.filter(o => o._id !== orderId && o.id !== orderId));
  };

  if (loading) return <div className="flex-1 flex items-center justify-center bg-white"><p className="text-sm" style={{ color: '#9a8585' }}>Chargement…</p></div>;
  if (error || !client) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-white">
      <p className="text-sm text-red-500">{error || 'Client introuvable'}</p>
      <button onClick={() => navigate('/clients')} className="text-sm underline" style={{ color: '#9b6b7a' }}>Retour à la liste</button>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <button onClick={() => navigate('/clients')} className="flex items-center gap-2 text-sm font-semibold mb-7 hover:opacity-70 transition" style={{ color: '#9a8585' }}>
        <ArrowLeft size={16} /> Clients
      </button>

      <div className="flex items-center gap-6 mb-8 flex-wrap">
        <div className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f0e8f4,#e8dff0)', color: '#9b6b7a' }}>
          <User size={36} />
        </div>
        <div>
          <h1 className="font-bold mb-3" style={{ fontSize: 24, color: '#1a1212', fontFamily: "'DM Serif Display', serif" }}>
            {client.prenom} {client.nom}
          </h1>
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center gap-2"><Phone size={14} style={{ color: '#3D7A47' }} /><span className="text-sm" style={{ color: '#5e4d4d' }}>{client.phone}</span></div>
            <div className="flex items-center gap-2"><MapPin size={14} style={{ color: '#9B6B9A' }} /><span className="text-sm" style={{ color: '#5e4d4d' }}>{client.adresse}</span></div>
          </div>
        </div>
      </div>

      <hr className="border-gray-100 mb-8" />

      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bold text-lg" style={{ color: '#1a1212' }}>Les commandes :</h2>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition" style={{ background: 'linear-gradient(135deg,#9b6b7a,#b07585)', boxShadow: '0 4px 12px rgba(155,107,122,.28)' }}>
          <Plus size={15} /> Ajouter une commande
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-36 gap-2 border border-dashed border-gray-200 rounded-2xl">
          <p className="text-sm font-semibold" style={{ color: '#9a8585' }}>Aucune commande pour ce client</p>
          <button onClick={() => setShowAddModal(true)} className="text-xs underline" style={{ color: '#9b6b7a' }}>Ajouter la première commande</button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #f0ebe8' }}>
                {['Commande', 'Date', 'État', 'Remarque', ''].map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap" style={{ color: '#9a8585' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => {
                const st = getStatus(order.status);
                const orderId = order._id || order.id;
                const items = order.items || [];
                const totalQty = items.reduce((s, it) => s + (it.quantity || 1), 0);
                const firstName = items[0]?.productName || '—';
                const rest = items.length > 1 ? ` +${items.length - 1}` : '';
                return (
                  <tr key={orderId} style={{ borderBottom: '1px solid #f5f0ee', backgroundColor: i % 2 === 0 ? '#fff' : '#fdfcfc' }}>
                    <td className="px-4 py-3">
                      <p className="font-semibold truncate max-w-[200px]" style={{ color: '#1a1212' }}>
                        {firstName}<span style={{ color: '#9b6b7a', fontWeight: 700 }}>{rest}</span>
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#9a8585' }}>
                        {items.length} produit{items.length > 1 ? 's' : ''} · {totalQty} unité{totalQty > 1 ? 's' : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#5e4d4d' }}>{formatDate(order.date)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <span className="block truncate text-sm" style={{ color: order.remarque ? '#5e4d4d' : '#c4b0aa' }} title={order.remarque || ''}>{order.remarque || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 justify-end">
                        <button onClick={() => setPrintingOrder(order)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f0e8f4] transition" title="Imprimer">
                          <Printer size={13} style={{ color: '#9b6b7a' }} />
                        </button>
                        <button onClick={() => setEditingOrder(order)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition" title="Modifier">
                          <Pencil size={13} style={{ color: '#9b6b7a' }} />
                        </button>
                        <button onClick={() => handleDeleteOrder(orderId)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition" title="Supprimer">
                          <Trash2 size={13} style={{ color: '#ef4444' }} />
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

      {showAddModal   && <CartOrderModal  tree={catalog.tree} flat={catalogFlat} onClose={() => setShowAddModal(false)}   onSave={handleAddOrder} />}
      {editingOrder   && <EditOrderModal  order={editingOrder}  onClose={() => setEditingOrder(null)}   onSave={handleUpdateOrder} />}
      {printingOrder  && <PrintOrderModal order={printingOrder} client={client} flat={catalogFlat}   onClose={() => setPrintingOrder(null)} />}
    </div>
  );
}
