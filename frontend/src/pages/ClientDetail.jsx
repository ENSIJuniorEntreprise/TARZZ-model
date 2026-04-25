import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, User, Phone, MapPin, Plus, Pencil, Trash2,
  X, Search, Check, ShoppingCart, Folder, ChevronRight,
} from 'lucide-react';
import { clients as clientsApi, clientOrders as ordersApi } from '../api';

// ── Catalogue (build-time) ────────────────────────────────────────────────────
const RAW_MODULES = import.meta.glob(
  '../../assets/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG}',
  { eager: true }
);

const KY_CATS = new Set(['KY1', 'KY2']);

function buildTree(modules) {
  const root = { images: [], children: {} };
  for (const [path, mod] of Object.entries(modules)) {
    const cleaned = path.replace('../../assets/', '');
    const parts = cleaned.split('/');
    const filename = parts[parts.length - 1];
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!node.children[parts[i]]) node.children[parts[i]] = { images: [], children: {} };
      node = node.children[parts[i]];
    }
    node.images.push({ id: path, filename: filename.replace(/\.[^.]+$/, ''), url: mod.default });
  }
  return root;
}

const CATALOG_TREE = buildTree(RAW_MODULES);

// Flat list used only for search
const ALL_FLAT = Object.entries(RAW_MODULES).map(([path, mod]) => {
  const cleaned = path.replace('../../assets/', '');
  const parts = cleaned.split('/');
  const topCat = parts[0];
  const name = KY_CATS.has(topCat) && parts.length >= 3
    ? parts[parts.length - 2]
    : parts[parts.length - 1].replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
  return { id: path, name, category: parts.slice(0, -1).join(' / '), url: mod.default };
});

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
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yy = dt.getFullYear();
  const hh = String(dt.getHours()).padStart(2, '0');
  const mi = String(dt.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yy} - ${hh}:${mi}`;
}

function todayLocal() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

// ── ProductCard ───────────────────────────────────────────────────────────────
function ProductCard({ product, inCart, onToggle }) {
  return (
    <button
      onClick={() => onToggle(product)}
      className="flex flex-col items-center gap-1.5 rounded-xl border-2 p-2 transition-all text-center cursor-pointer"
      style={{
        borderColor: inCart ? '#9b6b7a' : '#f0ede8',
        backgroundColor: inCart ? '#fdf5f7' : '#fff',
      }}
    >
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
        <img src={product.url} alt={product.name} className="w-full h-full object-cover" />
        {inCart && (
          <div
            className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: '#9b6b7a' }}
          >
            <Check size={10} color="white" />
          </div>
        )}
      </div>
      <p className="text-[10px] font-semibold leading-tight line-clamp-2 w-full" style={{ color: '#1a1212' }}>
        {product.name}
      </p>
    </button>
  );
}

// ── Modal Panier ──────────────────────────────────────────────────────────────
function CartOrderModal({ onClose, onSave }) {
  const [search, setSearch]       = useState('');
  const TOP_CATS = Object.keys(CATALOG_TREE).sort();
  const defaultCat = TOP_CATS.length ? TOP_CATS[0] : null;
  const [selectedCategory, setSelectedCategory] = useState(defaultCat);
  const [currentPath, setCurrentPath] = useState(defaultCat ? [defaultCat] : []);
  const [cart, setCart]           = useState([]);
  const [form, setForm]           = useState({ status: 'en_commande', date: todayLocal(), remarque: '' });
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  // Node at current path
  const currentNode = useMemo(() => {
    let node = CATALOG_TREE;
    for (const part of currentPath) {
      node = node.children?.[part];
      if (!node) return { images: [], children: {} };
    }
    return node;
  }, [currentPath]);

  // Subcategory names sorted
  const subCats = useMemo(() => Object.keys(currentNode.children).sort(), [currentNode]);

  // Products at current level with display names
  const currentProducts = useMemo(() => {
    const topCat = currentPath[0];
    return currentNode.images.map(img => {
      const name = KY_CATS.has(topCat) && currentPath.length >= 1
        ? currentPath[currentPath.length - 1]
        : img.filename.replace(/[_-]/g, ' ');
      return { id: img.id, name, category: currentPath.join(' / '), url: img.url };
    });
  }, [currentNode, currentPath]);

  // Flat search results
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return ALL_FLAT.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [search]);

  const isInCart = id => cart.some(p => p.id === id);

  const toggleProduct = product => {
    setCart(prev =>
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
    setError('');
  };

  const navigate = path => {
    setCurrentPath(path);
    setSearch('');
  };

  const submit = async () => {
    if (cart.length === 0) { setError('Sélectionnez au moins un produit'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave(cart, { status: form.status, date: form.date, remarque: form.remarque.trim() });
      onClose();
    } catch (e) {
      setError(e.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const isSearching = search.trim().length > 0;

  useEffect(() => {
    if (selectedCategory) {
      setCurrentPath([selectedCategory]);
      setSearch('');
    }
  }, [selectedCategory]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden"
        style={{ height: '88vh', fontFamily: "'DM Sans', sans-serif" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#f0e8f4,#e8dff0)', color: '#9b6b7a' }}>
              <ShoppingCart size={16} />
            </div>
            <h2 className="font-bold text-base" style={{ color: '#1a1212' }}>Nouvelle commande</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">

          {/* ── Left: catalogue ────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col border-r border-gray-100 min-w-0">

            {/* Search bar + category selector */}
            <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <select
                  value={selectedCategory || ''}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none bg-white"
                >
                  {TOP_CATS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#c4b0aa' }} />
                  <input
                    autoFocus
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher un produit…"
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]"
                  />
                </div>
              </div>
            </div>

            {/* Breadcrumb (only when browsing categories) */}
            {!isSearching && (
              <div className="px-4 py-2 border-b border-gray-50 flex items-center gap-1 flex-wrap flex-shrink-0 min-h-[36px]">
                <button
                  onClick={() => navigate([])}
                  className="text-xs font-semibold transition hover:underline"
                  style={{ color: currentPath.length === 0 ? '#1a1212' : '#9b6b7a' }}
                >
                  Catalogue
                </button>
                {currentPath.map((part, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <ChevronRight size={10} style={{ color: '#c4b0aa' }} />
                    <button
                      onClick={() => navigate(currentPath.slice(0, i + 1))}
                      className="text-xs font-semibold transition hover:underline"
                      style={{ color: i === currentPath.length - 1 ? '#1a1212' : '#9b6b7a' }}
                    >
                      {part}
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isSearching ? (
                /* ── Search results ── */
                searchResults.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm" style={{ color: '#c4b0aa' }}>
                    Aucun produit trouvé
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    {searchResults.map(p => (
                      <ProductCard key={p.id} product={p} inCart={isInCart(p.id)} onToggle={toggleProduct} />
                    ))}
                  </div>
                )
              ) : (
                /* ── Category navigation ── */
                <div className="flex flex-col gap-5">

                  {/* Subcategory folders */}
                  {subCats.length > 0 && (
                    <div>
                      {currentProducts.length > 0 && (
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9b8095' }}>
                          Sous-catégories
                        </p>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {subCats.map(cat => {
                          const child = currentNode.children[cat];
                          const subCount = Object.keys(child.children).length;
                          const imgCount = child.images.length;
                          const desc = subCount > 0
                            ? `${subCount} dossier${subCount > 1 ? 's' : ''}`
                            : imgCount > 0
                            ? `${imgCount} produit${imgCount > 1 ? 's' : ''}`
                            : '';
                          return (
                            <button
                              key={cat}
                              onClick={() => navigate([...currentPath, cat])}
                              className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 hover:border-[#c49aaa] hover:bg-[#fdf5f7] transition text-left group"
                            >
                              <Folder
                                size={22}
                                className="flex-shrink-0"
                                style={{ color: '#c49aaa' }}
                              />
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

                  {/* Products at this level */}
                  {currentProducts.length > 0 && (
                    <div>
                      {subCats.length > 0 && (
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9b8095' }}>
                          Produits
                        </p>
                      )}
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                        {currentProducts.map(p => (
                          <ProductCard key={p.id} product={p} inCart={isInCart(p.id)} onToggle={toggleProduct} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Root empty / folder empty */}
                  {subCats.length === 0 && currentProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 gap-2" style={{ color: '#c4b0aa' }}>
                      <Folder size={36} strokeWidth={1} />
                      <p className="text-sm">Dossier vide</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: panier + formulaire ────────────────────────────── */}
          <div className="w-72 flex flex-col flex-shrink-0">

            {/* Cart list */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 min-h-0">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9b8095' }}>
                Panier ({cart.length})
              </p>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 mt-8">
                  <ShoppingCart size={32} strokeWidth={1} style={{ color: '#e0d4d4' }} />
                  <p className="text-xs text-center" style={{ color: '#c4b0aa' }}>
                    Cliquez sur un produit pour l'ajouter
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {cart.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 rounded-xl p-2"
                      style={{ backgroundColor: '#fdf5f7' }}
                    >
                      <img src={p.url} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: '#1a1212' }}>{p.name}</p>
                        <p className="text-[10px] truncate" style={{ color: '#9a8585' }}>{p.category}</p>
                      </div>
                      <button onClick={() => toggleProduct(p)} className="text-gray-300 hover:text-red-400 transition flex-shrink-0">
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formulaire */}
            <div className="px-4 py-4 border-t border-gray-100 flex flex-col gap-3 flex-shrink-0">
              {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

              <div>
                <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>État</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white focus:ring-1 focus:ring-[#9E8A9C]"
                >
                  {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Date</label>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Remarque</label>
                <textarea
                  value={form.remarque}
                  onChange={e => setForm(f => ({ ...f, remarque: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none resize-none focus:ring-1 focus:ring-[#9E8A9C]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold transition hover:bg-gray-50"
                  style={{ color: '#5e4d4d' }}
                >
                  Annuler
                </button>
                <button
                  onClick={submit}
                  disabled={saving || cart.length === 0}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition"
                  style={{
                    background: 'linear-gradient(135deg,#9b6b7a,#b07585)',
                    opacity: saving || cart.length === 0 ? 0.5 : 1,
                  }}
                >
                  {saving ? 'Ajout…' : `Enregistrer (${cart.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal Modifier commande ───────────────────────────────────────────────────
function EditOrderModal({ order, onClose, onSave }) {
  const [form, setForm] = useState({ status: order.status, remarque: order.remarque || '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setSaving(true);
    try {
      await onSave(order._id || order.id, { status: form.status, remarque: form.remarque });
      onClose();
    } catch (e) {
      setError(e.message || 'Erreur lors de la modification');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-base" style={{ color: '#1a1212' }}>Modifier la commande</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><X size={20} /></button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-xs" style={{ color: '#9a8585' }}>Produit</p>
            <p className="text-sm font-semibold" style={{ color: '#1a1212' }}>{order.productName}</p>
            {order.productCategory && (
              <p className="text-xs mt-0.5" style={{ color: '#9a8585' }}>{order.productCategory}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>État</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-1 focus:ring-[#9E8A9C]"
            >
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Remarque</label>
            <textarea
              value={form.remarque}
              onChange={e => setForm(f => ({ ...f, remarque: e.target.value }))}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none resize-none focus:ring-1 focus:ring-[#9E8A9C]"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold transition hover:bg-gray-50"
            style={{ color: '#5e4d4d' }}
          >
            Annuler
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-bold transition"
            style={{ background: 'linear-gradient(135deg,#9b6b7a,#b07585)', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Sauvegarde…' : 'Modifier'}
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [c, o] = await Promise.all([clientsApi.get(id), ordersApi.list(id)]);
        setClient(c);
        setOrders(o);
      } catch (e) {
        setError(e.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddOrders = async (cartItems, settings) => {
    const created = await Promise.all(
      cartItems.map(p =>
        ordersApi.create(id, {
          productName: p.name,
          productCategory: p.category,
          status: settings.status,
          date: new Date(settings.date).toISOString(),
          remarque: settings.remarque,
        })
      )
    );
    setOrders(prev => [...created.reverse(), ...prev]);
  };

  const handleUpdateOrder = async (orderId, data) => {
    const updated = await ordersApi.update(orderId, data);
    setOrders(prev => prev.map(o => (o._id === orderId || o.id === orderId) ? updated : o));
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Supprimer cette commande ?')) return;
    await ordersApi.remove(orderId);
    setOrders(prev => prev.filter(o => o._id !== orderId && o.id !== orderId));
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-white">
      <p className="text-sm" style={{ color: '#9a8585' }}>Chargement…</p>
    </div>
  );

  if (error || !client) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-white">
      <p className="text-sm text-red-500">{error || 'Client introuvable'}</p>
      <button onClick={() => navigate('/clients')} className="text-sm underline" style={{ color: '#9b6b7a' }}>
        Retour à la liste
      </button>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('/clients')}
        className="flex items-center gap-2 text-sm font-semibold mb-7 transition hover:opacity-70"
        style={{ color: '#9a8585' }}
      >
        <ArrowLeft size={16} />
        Clients
      </button>

      {/* En-tête client */}
      <div className="flex items-center gap-6 mb-8 flex-wrap">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#f0e8f4,#e8dff0)', color: '#9b6b7a' }}
        >
          <User size={36} />
        </div>
        <div>
          <h1
            className="font-bold mb-3"
            style={{ fontSize: 24, color: '#1a1212', fontFamily: "'DM Serif Display', serif" }}
          >
            {client.prenom} {client.nom}
          </h1>
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center gap-2">
              <Phone size={14} style={{ color: '#3D7A47' }} />
              <span className="text-sm" style={{ color: '#5e4d4d' }}>{client.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: '#9B6B9A' }} />
              <span className="text-sm" style={{ color: '#5e4d4d' }}>{client.adresse}</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-100 mb-8" />

      {/* Section commandes */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="font-bold text-lg" style={{ color: '#1a1212' }}>Les commandes :</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#9b6b7a,#b07585)', boxShadow: '0 4px 12px rgba(155,107,122,.28)' }}
        >
          <Plus size={15} />
          Ajouter une commande
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-36 gap-2 border border-dashed border-gray-200 rounded-2xl">
          <p className="text-sm font-semibold" style={{ color: '#9a8585' }}>Aucune commande pour ce client</p>
          <button onClick={() => setShowAddModal(true)} className="text-xs underline" style={{ color: '#9b6b7a' }}>
            Ajouter la première commande
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #f0ebe8' }}>
                {['Commande', 'Date de commande', 'État', 'Remarque', ''].map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap"
                    style={{ color: '#9a8585' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => {
                const st = getStatus(order.status);
                const orderId = order._id || order.id;
                return (
                  <tr
                    key={orderId}
                    style={{ borderBottom: '1px solid #f5f0ee', backgroundColor: i % 2 === 0 ? '#fff' : '#fdfcfc' }}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold truncate max-w-[160px]" style={{ color: '#1a1212' }}>{order.productName}</p>
                      {order.productCategory && (
                        <p className="text-xs mt-0.5" style={{ color: '#9a8585' }}>{order.productCategory}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#5e4d4d' }}>{formatDate(order.date)}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                        style={{ backgroundColor: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <span
                        className="block truncate text-sm"
                        style={{ color: order.remarque ? '#5e4d4d' : '#c4b0aa' }}
                        title={order.remarque || ''}
                      >
                        {order.remarque || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => setEditingOrder(order)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg transition hover:bg-gray-100"
                        >
                          <Pencil size={13} style={{ color: '#9b6b7a' }} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(orderId)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg transition hover:bg-red-50"
                        >
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

      {showAddModal && (
        <CartOrderModal onClose={() => setShowAddModal(false)} onSave={handleAddOrders} />
      )}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleUpdateOrder}
        />
      )}
    </div>
  );
}
