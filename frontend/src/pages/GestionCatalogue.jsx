import { useState, useEffect, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, X, ChevronRight, Folder,
  Package, ImageOff, Search, Check,
} from 'lucide-react';
import { catalog as api } from '../api';

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildTree(cats) {
  const map = {};
  cats.forEach(c => { map[c._id] = { ...c, children: [] }; });
  const roots = [];
  cats.forEach(c => {
    const parentId = c.parent?._id || c.parent;
    if (parentId && map[parentId]) map[parentId].children.push(map[c._id]);
    else roots.push(map[c._id]);
  });
  const sort = nodes => { nodes.sort((a, b) => a.name.localeCompare(b.name)); nodes.forEach(n => sort(n.children)); return nodes; };
  return sort(roots);
}

const font = { fontFamily: "'DM Sans', sans-serif" };
const accent = '#9b6b7a';

// ── Petit input réutilisable ──────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', required, accept }) {
  return (
    <div>
      <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>{label}{required && ' *'}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} accept={accept}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]" />
    </div>
  );
}

// ── Modal Catégorie ───────────────────────────────────────────────────────────
function CategoryModal({ initial, categories, onClose, onSave }) {
  const [name,   setName]   = useState(initial?.name   || '');
  const [parent, setParent] = useState(initial?.parent?._id || initial?.parent || '');
  const [err,    setErr]    = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) { setErr('Le nom est requis'); return; }
    setSaving(true); setErr('');
    try {
      await onSave({ name: name.trim(), parent: parent || null });
      onClose();
    } catch (e) { setErr(e.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" style={font} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f0e8f4,#e8dff0)', color: accent }}>
              <Folder size={17} />
            </div>
            <h2 className="font-bold text-base" style={{ color: '#1a1212' }}>{initial ? 'Modifier' : 'Nouvelle'} catégorie</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          {err && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
          <Field label="Nom" value={name} onChange={setName} required />
          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Catégorie parente</label>
            <select value={parent} onChange={e => setParent(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-1 focus:ring-[#9E8A9C]">
              <option value="">— Aucune (top-niveau) —</option>
              {categories.filter(c => c._id !== initial?._id).map(c => (
                <option key={c._id} value={c._id}>{c.parent?.name ? `${c.parent.name} / ` : ''}{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50" style={{ color: '#5e4d4d' }}>Annuler</button>
          <button onClick={submit} disabled={saving} className="px-5 py-2.5 rounded-xl text-white text-sm font-bold"
            style={{ background: `linear-gradient(135deg,${accent},#b07585)`, opacity: saving ? 0.7 : 1 }}>
            {saving ? '…' : initial ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Produit ─────────────────────────────────────────────────────────────
function ProductModal({ initial, categories, selectedCategoryId, onClose, onSave }) {
  const [name,     setName]     = useState(initial?.name     || '');
  const [category, setCategory] = useState(initial?.category?._id || initial?.category || selectedCategoryId || '');
  const [stock,    setStock]    = useState(String(initial?.stock ?? 20));
  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState(initial?.imageUrl ? `/api${initial.imageUrl}` : null);
  const [err,      setErr]      = useState('');
  const [saving,   setSaving]   = useState(false);

  const pickFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (!name.trim()) { setErr('Le nom est requis'); return; }
    if (!category)    { setErr('La catégorie est requise'); return; }
    setSaving(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('name', name.trim());
      fd.append('category', category);
      fd.append('stock', stock);
      if (file) fd.append('image', file);
      await onSave(fd);
      onClose();
    } catch (e) { setErr(e.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={font} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f0e8f4,#e8dff0)', color: accent }}>
              <Package size={17} />
            </div>
            <h2 className="font-bold text-base" style={{ color: '#1a1212' }}>{initial ? 'Modifier' : 'Nouveau'} produit</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {err && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{err}</p>}

          {/* Image upload */}
          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Photo</label>
            <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-3 hover:border-[#c49aaa] transition">
              {preview
                ? <img src={preview} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                : <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><ImageOff size={20} style={{ color: '#d4c5be' }} /></div>
              }
              <span className="text-sm" style={{ color: '#9a8585' }}>{file ? file.name : 'Cliquer pour choisir une image'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={pickFile} />
            </label>
          </div>

          <Field label="Nom du produit" value={name} onChange={setName} required />

          <div>
            <label className="block text-xs font-semibold italic mb-1" style={{ color: '#5e4d4d' }}>Catégorie *</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-1 focus:ring-[#9E8A9C]">
              <option value="">— Choisir —</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.parent?.name ? `${c.parent.name} / ` : ''}{c.name}</option>
              ))}
            </select>
          </div>

          <Field label="Stock initial" value={stock} onChange={setStock} type="number" />
        </div>

        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50" style={{ color: '#5e4d4d' }}>Annuler</button>
          <button onClick={submit} disabled={saving} className="px-5 py-2.5 rounded-xl text-white text-sm font-bold"
            style={{ background: `linear-gradient(135deg,${accent},#b07585)`, opacity: saving ? 0.7 : 1 }}>
            {saving ? '…' : initial ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Nœud d'arbre catégorie ────────────────────────────────────────────────────
function CatNode({ node, depth, selected, onSelect, onEdit, onDelete }) {
  const [open, setOpen] = useState(depth === 0);
  const isSelected = selected === node._id;
  const hasSubs = node.children.length > 0;

  return (
    <div>
      <div className="flex items-center gap-1" style={{ paddingLeft: `${8 + depth * 14}px` }}>
        {hasSubs
          ? <button onClick={() => setOpen(o => !o)} className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100">
              <ChevronRight size={11} className={`transition-transform ${open ? 'rotate-90' : ''}`} style={{ color: '#9a8585' }} />
            </button>
          : <span className="w-5 flex-shrink-0" />
        }
        <button
          onClick={() => onSelect(node._id)}
          className={`flex-1 min-w-0 text-left py-1.5 px-2 rounded-lg text-xs font-semibold transition truncate ${isSelected ? 'text-white' : 'text-[#1a1212] hover:bg-gray-50'}`}
          style={isSelected ? { background: `linear-gradient(135deg,${accent},#b07585)` } : {}}
        >
          {node.name}
        </button>
        <button onClick={() => onEdit(node)} className="opacity-0 group-hover:opacity-100 hover:opacity-100 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100" title="Modifier">
          <Pencil size={11} style={{ color: '#9a8585' }} />
        </button>
        <button onClick={() => onDelete(node._id)} className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-red-50" title="Supprimer">
          <Trash2 size={11} style={{ color: '#c49aaa' }} />
        </button>
      </div>
      {open && hasSubs && (
        <div>
          {node.children.map(child => (
            <CatNode key={child._id} node={child} depth={depth + 1} selected={selected} onSelect={onSelect} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function GestionCatalogue() {
  const [categories,    setCategories]    = useState([]);
  const [products,      setProducts]      = useState([]);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [search,        setSearch]        = useState('');
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');

  const [catModal,     setCatModal]     = useState(null);   // null | 'new' | {category obj}
  const [productModal, setProductModal] = useState(null);   // null | 'new' | {product obj}

  const tree = useMemo(() => buildTree(categories), [categories]);

  const loadCategories = async () => {
    try { setCategories(await api.listCategories()); }
    catch (e) { setError(e.message); }
  };

  const loadProducts = async (catId) => {
    setLoading(true);
    try { setProducts(await api.listProducts(catId || undefined)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    loadCategories();
    loadProducts(null);
  }, []);

  const handleSelectCat = catId => {
    setSelectedCatId(catId === selectedCatId ? null : catId);
    setSearch('');
    loadProducts(catId === selectedCatId ? null : catId);
  };

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q));
  }, [products, search]);

  // ── Category CRUD ──
  const saveCat = async data => {
    if (catModal === 'new') {
      const cat = await api.createCategory(data);
      setCategories(prev => [...prev, cat]);
    } else {
      const cat = await api.updateCategory(catModal._id, data);
      setCategories(prev => prev.map(c => c._id === cat._id ? cat : c));
    }
  };

  const deleteCat = async id => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    await api.deleteCategory(id);
    setCategories(prev => prev.filter(c => c._id !== id));
    if (selectedCatId === id) { setSelectedCatId(null); loadProducts(null); }
  };

  // ── Product CRUD ──
  const saveProduct = async fd => {
    if (productModal === 'new') {
      const p = await api.createProduct(fd);
      setProducts(prev => [...prev, p]);
    } else {
      const p = await api.updateProduct(productModal._id, fd);
      setProducts(prev => prev.map(x => x._id === p._id ? p : x));
    }
  };

  const deleteProduct = async id => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    await api.deleteProduct(id);
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  const selectedCatName = categories.find(c => c._id === selectedCatId)?.name;

  return (
    <div className="flex flex-1 min-h-0" style={font}>

      {/* ── Left: category tree ── */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="flex items-center justify-between px-4 pt-5 pb-2">
          <p className="font-bold text-[10px] tracking-[0.18em] uppercase text-[#1a1212]">Catégories</p>
          <button onClick={() => setCatModal('new')} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition" title="Nouvelle catégorie">
            <Plus size={14} style={{ color: accent }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-4">
          {/* "All" button */}
          <div className="px-2 mb-1">
            <button
              onClick={() => handleSelectCat(null)}
              className={`w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold transition ${!selectedCatId ? 'text-white' : 'text-[#1a1212] hover:bg-gray-50'}`}
              style={!selectedCatId ? { background: `linear-gradient(135deg,${accent},#b07585)` } : {}}
            >
              Tous les produits
            </button>
          </div>

          {tree.length === 0
            ? <p className="text-xs text-center py-4" style={{ color: '#c4b0aa' }}>Aucune catégorie</p>
            : tree.map(node => (
                <CatNode key={node._id} node={node} depth={0} selected={selectedCatId}
                  onSelect={handleSelectCat} onEdit={n => setCatModal(n)} onDelete={deleteCat} />
              ))
          }
        </div>
      </div>

      {/* ── Right: products ── */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h1 className="font-bold text-lg" style={{ color: '#1a1212' }}>
              {selectedCatName ? selectedCatName : 'Tous les produits'}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#9a8585' }}>{filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#c4b0aa' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
                className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C] w-44" />
            </div>
            <button
              onClick={() => setProductModal('new')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold hover:opacity-90 transition"
              style={{ background: `linear-gradient(135deg,${accent},#b07585)`, boxShadow: '0 4px 12px rgba(155,107,122,.25)' }}
            >
              <Plus size={14} /> Nouveau produit
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {loading ? (
          <div className="flex items-center justify-center h-64"><p className="text-sm" style={{ color: '#9a8585' }}>Chargement…</p></div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 border-2 border-dashed border-gray-200 rounded-2xl">
            <Package size={40} strokeWidth={1} style={{ color: '#d4c5be' }} />
            <p className="text-sm font-semibold" style={{ color: '#9a8585' }}>Aucun produit</p>
            <button onClick={() => setProductModal('new')} className="text-xs underline" style={{ color: accent }}>Ajouter le premier produit</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map(p => {
              const stockColor = p.stock === 0 ? '#ef4444' : p.stock <= 5 ? '#f59e0b' : '#22c55e';
              return (
                <div key={p._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                  {/* Image */}
                  <div className="bg-[#f4f4f5] h-36 flex items-center justify-center overflow-hidden">
                    {p.imageUrl
                      ? <img src={`/api${p.imageUrl}`} alt={p.name} className="w-full h-full object-cover" />
                      : <ImageOff size={28} style={{ color: '#d4c5be' }} />
                    }
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <p className="text-sm font-bold truncate mb-1" style={{ color: '#1a1212' }}>{p.name}</p>
                    <p className="text-[10px] truncate mb-2" style={{ color: '#9a8585' }}>
                      {p.category?.parent?.name ? `${p.category.parent.name} / ` : ''}{p.category?.name || '—'}
                    </p>
                    {/* Stock badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: stockColor }}>
                        {p.stock === 0 ? 'Rupture' : `Stock : ${p.stock}`}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => setProductModal(p)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100">
                          <Pencil size={12} style={{ color: '#9a8585' }} />
                        </button>
                        <button onClick={() => deleteProduct(p._id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50">
                          <Trash2 size={12} style={{ color: '#c49aaa' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      {catModal && (
        <CategoryModal
          initial={catModal === 'new' ? null : catModal}
          categories={categories}
          onClose={() => setCatModal(null)}
          onSave={saveCat}
        />
      )}
      {productModal && (
        <ProductModal
          initial={productModal === 'new' ? null : productModal}
          categories={categories}
          selectedCategoryId={selectedCatId}
          onClose={() => setProductModal(null)}
          onSave={saveProduct}
        />
      )}
    </div>
  );
}
