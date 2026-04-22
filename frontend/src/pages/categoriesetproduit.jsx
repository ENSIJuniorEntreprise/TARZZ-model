import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Pencil, Trash2, Package, X, Check, Upload } from "lucide-react";
import { products as prodApi, categories as catApi } from "../api";

const STOCK_FILTERS = [
  { key:"all", label:"Tous" },
  { key:"in",  label:"En stock" },
  { key:"out", label:"Rupture" },
  { key:"low", label:"Stock faible" },
];

const STATUS_COLOR = (stock) =>
  stock === 0 ? { bg:"#FAE8E8", color:"#B04040", label:"Rupture" }
  : stock <= 3 ? { bg:"#FFF7ED", color:"#C2410C", label:"Stock faible" }
  :              { bg:"#EAF5EC", color:"#3D7A47", label:"En stock" };

/* ── Modals ─────────────────────────────────────────────────────────────────── */
function TextModal({ title, placeholder, initial = '', onClose, onSave }) {
  const [val, setVal] = useState(initial);
  const [err, setErr] = useState('');
  const submit = () => {
    if (!val.trim()) { setErr('Ce champ est requis'); return; }
    onSave(val.trim()); onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-80 p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl">×</button>
        <h2 className="font-sans-custom font-bold mb-4" style={{ fontSize:16, color:"#1a1212" }}>{title}</h2>
        <input autoFocus value={val} onChange={e => { setVal(e.target.value); setErr(''); }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-sans-custom outline-none focus:ring-1 focus:ring-[#9E8A9C] mb-1" />
        {err && <p className="text-red-400 text-xs mb-2">{err}</p>}
        <button onClick={submit} className="w-full mt-3 text-white rounded-xl py-2.5 text-sm font-bold font-sans-custom transition"
          style={{ background:"linear-gradient(135deg,#9b6b7a,#b07585)" }}>
          {initial ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </div>
  );
}

function ProductModal({ categories, subCategories, initial, onClose, onSave }) {
  const [form, setForm] = useState({
    name: initial?.name || '', ref: initial?.ref || '',
    description: initial?.description || '',
    purchase_price: initial?.purchase_price ?? '', sale_price: initial?.sale_price ?? '',
    stock: initial?.stock ?? '', category_id: initial?.category_id || '',
    sub_category_id: initial?.sub_category_id || '', image: null, preview: initial?.image || null,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, image: file, preview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Requis';
    if (form.stock === '' || isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Nombre ≥ 0';
    if (!form.category_id) e.category_id = 'Requis';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('ref', form.ref);
      fd.append('description', form.description);
      fd.append('purchase_price', form.purchase_price || 0);
      fd.append('sale_price', form.sale_price || 0);
      fd.append('stock', form.stock);
      fd.append('category_id', form.category_id);
      if (form.sub_category_id) fd.append('sub_category_id', form.sub_category_id);
      if (form.image) fd.append('image', form.image);
      await onSave(fd);
      onClose();
    } catch (err) { setErrors({ _: err.message }); }
    finally { setSaving(false); }
  };

  const subs = subCategories.filter(s => s.category_id === Number(form.category_id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-sans-custom font-bold" style={{ fontSize:18, color:"#1a1212" }}>
            {initial ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <button onClick={onClose}><X size={20} style={{ color:"#9a8585" }} /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          {errors._ && <p className="text-red-500 text-sm font-sans-custom">{errors._}</p>}

          {/* Image */}
          <label className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl py-3 cursor-pointer hover:bg-gray-50 transition text-sm text-gray-500 font-sans-custom">
            <Upload size={16} />
            {form.image ? form.image.name : form.preview ? 'Photo existante (changer)' : 'Télécharger une photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
          {form.preview && <img src={form.preview} alt="" className="w-full h-36 object-contain rounded-xl border" />}

          {/* Nom */}
          <div>
            <label className="font-sans-custom font-bold text-[11px] uppercase tracking-[0.14em] text-[#5e4d4d] block mb-1.5">Nom du produit *</label>
            <input value={form.name} onChange={e => { set('name', e.target.value); setErrors(er => ({...er, name:undefined})); }}
              placeholder="Ex: Bracelet Or" className={`w-full border rounded-xl px-3 py-2.5 text-sm font-sans-custom outline-none ${errors.name ? 'border-red-400':'border-gray-300'}`} />
            {errors.name && <p className="text-red-400 text-xs mt-0.5">{errors.name}</p>}
          </div>

          {/* Référence */}
          <div>
            <label className="font-sans-custom font-bold text-[11px] uppercase tracking-[0.14em] text-[#5e4d4d] block mb-1.5">Référence</label>
            <input value={form.ref} onChange={e => set('ref', e.target.value)} placeholder="Ex: SZM-001"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-sans-custom outline-none" />
          </div>

          {/* Description */}
          <div>
            <label className="font-sans-custom font-bold text-[11px] uppercase tracking-[0.14em] text-[#5e4d4d] block mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2}
              placeholder="Description du produit…"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-sans-custom outline-none resize-none" />
          </div>

          {/* Prix */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-sans-custom font-bold text-[11px] uppercase tracking-[0.14em] text-[#5e4d4d] block mb-1.5">Prix d'achat (DT)</label>
              <input type="number" min="0" step="0.01" value={form.purchase_price} onChange={e => set('purchase_price', e.target.value)}
                placeholder="0.00" className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-sans-custom outline-none" />
            </div>
            <div>
              <label className="font-sans-custom font-bold text-[11px] uppercase tracking-[0.14em] text-[#5e4d4d] block mb-1.5">Prix de vente (DT)</label>
              <input type="number" min="0" step="0.01" value={form.sale_price} onChange={e => set('sale_price', e.target.value)}
                placeholder="0.00" className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-sans-custom outline-none" />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="font-sans-custom font-bold text-[11px] uppercase tracking-[0.14em] text-[#5e4d4d] block mb-1.5">Quantité en stock *</label>
            <input type="number" min="0" value={form.stock} onChange={e => { set('stock', e.target.value); setErrors(er => ({...er, stock:undefined})); }}
              placeholder="0" className={`w-full border rounded-xl px-3 py-2.5 text-sm font-sans-custom outline-none ${errors.stock ? 'border-red-400':'border-gray-300'}`} />
            {errors.stock && <p className="text-red-400 text-xs mt-0.5">{errors.stock}</p>}
          </div>

          {/* Catégorie */}
          <div>
            <label className="font-sans-custom font-bold text-[11px] uppercase tracking-[0.14em] text-[#5e4d4d] block mb-1.5">Catégorie *</label>
            <select value={form.category_id} onChange={e => { set('category_id', e.target.value); set('sub_category_id',''); setErrors(er => ({...er, category_id:undefined})); }}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm font-sans-custom outline-none bg-white ${errors.category_id ? 'border-red-400':'border-gray-300'}`}>
              <option value="">Choisir une catégorie</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.category_id && <p className="text-red-400 text-xs mt-0.5">{errors.category_id}</p>}
          </div>

          {/* Sous-catégorie */}
          {subs.length > 0 && (
            <div>
              <label className="font-sans-custom font-bold text-[11px] uppercase tracking-[0.14em] text-[#5e4d4d] block mb-1.5">Sous-catégorie</label>
              <select value={form.sub_category_id} onChange={e => set('sub_category_id', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-sans-custom outline-none bg-white">
                <option value="">Aucune</option>
                {subs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-sans-custom font-semibold" style={{ color:"#5e4d4d" }}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={saving} className="px-5 py-2.5 rounded-xl text-white text-sm font-bold font-sans-custom transition"
            style={{ background:"linear-gradient(135deg,#9b6b7a,#b07585)", opacity: saving ? .7 : 1 }}>
            {saving ? 'Enregistrement…' : initial ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Product Card ─────────────────────────────────────────────────────────────── */
function ProductCard({ product, onEdit, onDelete }) {
  const st = STATUS_COLOR(product.stock);
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative">
      <div className="bg-[#f4f4f5] flex items-center justify-center h-36 relative overflow-hidden">
        {product.image
          ? <img src={product.image} alt={product.name} className="w-4/5 h-4/5 object-contain" />
          : <Package size={32} style={{ color:"#c4b0aa" }} />
        }
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(product)} className="w-7 h-7 rounded-lg bg-white shadow flex items-center justify-center hover:bg-gray-50">
            <Pencil size={13} style={{ color:"#9b6b7a" }} />
          </button>
          <button onClick={() => onDelete(product)} className="w-7 h-7 rounded-lg bg-white shadow flex items-center justify-center hover:bg-red-50">
            <Trash2 size={13} style={{ color:"#ef4444" }} />
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="font-sans-custom text-[11px] font-semibold" style={{ color:"#9a8585" }}>{product.ref || '—'}</p>
        <p className="font-sans-custom text-sm font-bold mt-0.5 truncate" style={{ color:"#1a1212" }}>{product.name}</p>
        {product.sale_price > 0 && (
          <p className="num text-sm font-bold mt-0.5" style={{ color:"#9b6b7a" }}>{product.sale_price.toFixed(2)} DT</p>
        )}
        <p className="font-sans-custom text-[11px] mt-0.5" style={{ color:"#7a6060" }}>
          {product.category_name} {product.sub_category_name ? `· ${product.sub_category_name}` : ''}
        </p>
        <div className="mt-2 text-center py-1.5 rounded-lg font-sans-custom text-xs font-bold" style={{ backgroundColor: st.bg, color: st.color }}>
          <span className="num">{product.stock}</span> — {st.label}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────────── */
export default function ProduitsCategories() {
  const [categories,   setCategories]   = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [prods,        setProds]        = useState([]);
  const [loading,      setLoading]      = useState(true);

  const [activeCategory,    setActiveCategory]    = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [stockFilter,       setStockFilter]       = useState('all');
  const [search,            setSearch]            = useState('');

  const [modal,   setModal]   = useState(null); // 'product' | 'category' | 'subcategory' | 'editProduct' | 'editCategory'
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null); // { type, item }

  /* Load categories */
  const loadCategories = useCallback(async () => {
    const data = await catApi.list();
    setCategories(data.categories);
    setSubCategories(data.subCategories);
  }, []);

  /* Load products */
  const loadProducts = useCallback(async () => {
    setLoading(true);
    const filters = {};
    if (activeCategory)    filters.category_id    = activeCategory;
    if (activeSubCategory) filters.sub_category_id = activeSubCategory;
    if (search)            filters.search          = search;
    if (stockFilter !== 'all') filters.stock       = stockFilter;
    const data = await prodApi.list(filters);
    setProds(data);
    setLoading(false);
  }, [activeCategory, activeSubCategory, search, stockFilter]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  /* Category handlers */
  const handleCatClick = id => {
    setActiveCategory(c => c === id ? null : id);
    setActiveSubCategory(null);
  };
  const handleSubClick = id => setActiveSubCategory(s => s === id ? null : id);

  /* Product CRUD */
  const handleAddProduct = async (fd) => {
    await prodApi.create(fd); await loadProducts();
  };
  const handleEditProduct = async (fd) => {
    await prodApi.update(editing.id, fd); await loadProducts();
  };
  const handleDeleteProduct = async () => {
    await prodApi.remove(confirm.item.id); setConfirm(null); await loadProducts();
  };

  /* Category CRUD */
  const handleAddCategory = async (name) => {
    await catApi.create(name); await loadCategories();
  };
  const handleEditCategory = async (name) => {
    await catApi.update(editing.id, name); await loadCategories();
  };
  const handleDeleteCategory = async () => {
    await catApi.remove(confirm.item.id); setConfirm(null);
    if (activeCategory === confirm.item.id) setActiveCategory(null);
    await loadCategories(); await loadProducts();
  };

  const availableSubs = subCategories.filter(s => s.category_id === activeCategory);

  return (
    <div className="flex flex-1 min-h-0" style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Filter sidebar ─────────────────────────────────── */}
      <div className="w-60 bg-white border-r border-gray-200 overflow-y-auto shrink-0 p-4">

        {/* Recherche */}
        <section className="mb-5">
          <p className="font-sans-custom font-bold text-[10px] tracking-[0.18em] uppercase text-[#1a1212] mb-2">Recherche</p>
          <input type="text" placeholder="nom / référence…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-1 focus:ring-[#9E8A9C] font-sans-custom" />
        </section>

        {/* Catégories */}
        <section className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="font-sans-custom font-bold text-[10px] tracking-[0.18em] uppercase text-[#1a1212]">Catégories</p>
            <button onClick={() => setModal('category')} className="text-[#9b6b7a] hover:text-[#7a4d5d] transition" title="Ajouter">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-0.5 group">
                <button onClick={() => handleCatClick(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition font-sans-custom ${activeCategory === cat.id ? 'bg-[#7A6B89] border-[#7A6B89] text-white' : 'bg-white border-gray-300 text-[#1a1212] hover:border-[#9E8A9C]'}`}>
                  {cat.name}
                </button>
                <div className="hidden group-hover:flex gap-0.5">
                  <button onClick={() => { setEditing(cat); setModal('editCategory'); }} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100"><Pencil size={10} style={{ color:"#9b6b7a" }} /></button>
                  <button onClick={() => setConfirm({ type:'category', item: cat })} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50"><Trash2 size={10} style={{ color:"#ef4444" }} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sous-catégories */}
        {activeCategory && (
          <section className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-sans-custom font-bold text-[10px] tracking-[0.18em] uppercase text-[#1a1212]">Sous-catégories</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableSubs.map(sub => (
                <div key={sub.id} className="flex items-center gap-0.5 group">
                  <button onClick={() => handleSubClick(sub.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition font-sans-custom ${activeSubCategory === sub.id ? 'bg-[#7A6B89] border-[#7A6B89] text-white' : 'bg-white border-gray-300 text-[#1a1212] hover:border-[#9E8A9C]'}`}>
                    {sub.name}
                  </button>
                  <button onClick={() => setConfirm({ type:'sub', item: sub })} className="hidden group-hover:flex w-5 h-5 items-center justify-center rounded-full hover:bg-red-50">
                    <Trash2 size={10} style={{ color:"#ef4444" }} />
                  </button>
                </div>
              ))}
              {availableSubs.length === 0 && <p className="text-xs font-sans-custom" style={{ color:"#9a8585" }}>Non disponible sur cette version</p>}
            </div>
          </section>
        )}

        {/* Stock filter */}
        <section>
          <p className="font-sans-custom font-bold text-[10px] tracking-[0.18em] uppercase text-[#1a1212] mb-2">État du stock</p>
          <div className="space-y-0.5">
            {STOCK_FILTERS.map(opt => (
              <button key={opt.key} onClick={() => setStockFilter(opt.key)}
                className={`w-full text-left px-3 py-2 rounded-xl font-sans-custom font-semibold text-sm transition ${stockFilter === opt.key ? 'bg-[#EDE8F0] text-[#7A5E8A]' : 'text-[#1a1212] hover:bg-gray-50'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* ── Product grid ───────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="font-sans-custom font-semibold text-sm" style={{ color:"#5e4d4d" }}>
            <span className="num font-bold text-[#1a1212]">{prods.length}</span> produit(s)
          </p>
          <button onClick={() => { setEditing(null); setModal('product'); }}
            className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl font-sans-custom font-bold text-sm transition"
            style={{ background:"linear-gradient(135deg,#9b6b7a,#b07585)", boxShadow:"0 4px 12px rgba(155,107,122,.28)" }}>
            <Plus size={16} /> Ajouter un produit
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="font-sans-custom text-sm" style={{ color:"#9a8585" }}>Chargement…</p>
          </div>
        ) : prods.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Package size={48} strokeWidth={1} style={{ color:"#d4c5be" }} />
            <p className="font-sans-custom font-semibold text-sm" style={{ color:"#9a8585" }}>Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {prods.map(p => (
              <ProductCard key={p.id} product={p}
                onEdit={p => { setEditing(p); setModal('editProduct'); }}
                onDelete={p => setConfirm({ type:'product', item: p })} />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ─────────────────────────────────────────── */}
      {modal === 'product' && (
        <ProductModal categories={categories} subCategories={subCategories}
          initial={null} onClose={() => setModal(null)} onSave={handleAddProduct} />
      )}
      {modal === 'editProduct' && (
        <ProductModal categories={categories} subCategories={subCategories}
          initial={editing} onClose={() => { setModal(null); setEditing(null); }} onSave={handleEditProduct} />
      )}
      {modal === 'category' && (
        <TextModal title="Ajouter une catégorie" placeholder="Nom de la catégorie"
          onClose={() => setModal(null)} onSave={handleAddCategory} />
      )}
      {modal === 'editCategory' && (
        <TextModal title="Modifier la catégorie" placeholder="Nom" initial={editing?.name}
          onClose={() => { setModal(null); setEditing(null); }} onSave={handleEditCategory} />
      )}
      {/* Confirm delete */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-80 p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-sans-custom font-bold mb-2" style={{ fontSize:16, color:"#1a1212" }}>Confirmer la suppression</h2>
            <p className="font-sans-custom text-sm mb-6" style={{ color:"#5e4d4d" }}>
              Supprimer <strong>{confirm.item.name || confirm.item.name}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)} className="px-4 py-2 rounded-xl border border-gray-200 font-sans-custom font-semibold text-sm" style={{ color:"#5e4d4d" }}>
                Annuler
              </button>
              <button onClick={confirm.type === 'product' ? handleDeleteProduct : handleDeleteCategory}
                className="px-4 py-2 rounded-xl text-white font-sans-custom font-bold text-sm" style={{ backgroundColor:"#ef4444" }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
