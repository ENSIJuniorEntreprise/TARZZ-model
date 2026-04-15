import { useState, useCallback, useMemo } from "react";


const INITIAL_CATEGORIES = ["Chaînes", "Ensembles", "Bagues", "Bracelets", "Collections"];
const INITIAL_SUBCATEGORIES = {
  Chaînes: ["Gourmette", "Chaînes classiques"],
  Ensembles: [],
  Bagues: [],
  Bracelets: [],
  Collections: [],
};
const INITIAL_PRODUCTS = [
  { id: 1, ref: "SZM-002", name: "Bracelet Médaillon", stock: 5, category: "Bracelets", subCategory: "Gourmette", image: null },
  { id: 2, ref: "SZM-002", name: "Chaîne Fine Or", stock: 0, category: "Chaînes", subCategory: "Chaînes classiques", image: null },
  { id: 3, ref: "SZM-002", name: "Chaîne Plate", stock: 0, category: "Chaînes", subCategory: "Chaînes classiques", image: null },
  { id: 4, ref: "SZM-002", name: "Chaîne Figaro", stock: 1, category: "Chaînes", subCategory: "Gourmette", image: null },
  { id: 5, ref: "SZM-002", name: "Chaîne Cordée", stock: 3, category: "Chaînes", subCategory: "Gourmette", image: null },
  { id: 6, ref: "SZM-002", name: "Chaîne Maille", stock: 0, category: "Chaînes", subCategory: "Chaînes classiques", image: null },
];


function AddProductModal({ categories, subCategories, onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", ref: "", stock: "", category: "", subCategory: "", image: null, preview: null });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, image: file, preview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Requis";
    if (!form.stock && form.stock !== 0) e.stock = "Requis";
    if (isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = "Nombre ≥ 0";
    if (!form.category) e.category = "Requis";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      id: Date.now(),
      name: form.name.trim(),
      ref: form.ref.trim() || "SZM-XXX",
      stock: Number(form.stock),
      category: form.category,
      subCategory: form.subCategory,
      image: form.preview,
    });
    onClose();
  };

  const subs = form.category ? (subCategories[form.category] || []) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-80 p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        <h2 className="text-center text-lg font-medium text-[#7A6B89] mb-5">Ajouter un produit</h2>

        <label className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg py-3 px-4 cursor-pointer hover:bg-gray-50 transition mb-4 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4 4 4" /></svg>
          {form.image ? form.image.name : "Télécharger une photo de la pièce"}
          <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </label>
        {form.preview && <img src={form.preview} alt="preview" className="w-full h-32 object-contain rounded-lg border mb-4" />}

       
        <div className="mb-3">
          <input
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C] ${errors.name ? "border-red-400" : "border-gray-300"}`}
            placeholder="Nom du produit"
            value={form.name}
            onChange={e => { set("name", e.target.value); setErrors(er => ({ ...er, name: undefined })); }}
          />
          {errors.name && <p className="text-red-400 text-xs mt-0.5">{errors.name}</p>}
        </div>

        
        <div className="mb-3">
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]"
            placeholder="Référence (ex: SZM-001)"
            value={form.ref}
            onChange={e => set("ref", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm text-gray-600 flex-1">Nombre de pièces en stock :</label>
          <input
            type="number"
            min="0"
            className={`w-20 border rounded-lg px-2 py-2 text-sm text-center outline-none focus:ring-1 focus:ring-[#9E8A9C] ${errors.stock ? "border-red-400" : "border-gray-300"}`}
            value={form.stock}
            onChange={e => { set("stock", e.target.value); setErrors(er => ({ ...er, stock: undefined })); }}
          />
          {errors.stock && <p className="text-red-400 text-xs">{errors.stock}</p>}
        </div>

        
        <div className="mb-3">
          <select
            className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-[#9E8A9C] bg-white ${errors.category ? "border-red-400" : "border-gray-300"}`}
            value={form.category}
            onChange={e => { set("category", e.target.value); set("subCategory", ""); setErrors(er => ({ ...er, category: undefined })); }}
          >
            <option value="">Choisir la catégorie</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-red-400 text-xs mt-0.5">{errors.category}</p>}
        </div>

        <div className="mb-5">
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-[#9E8A9C] bg-white"
            value={form.subCategory}
            onChange={e => set("subCategory", e.target.value)}
            disabled={!form.category || subs.length === 0}
          >
            <option value="">Choisir la sous-catégorie</option>
            {subs.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#9E8A9C] hover:bg-[#8B7589] text-white rounded-lg py-2.5 text-sm font-medium transition"
        >
          Ajouter le produit
        </button>
      </div>
    </div>
  );
}

function AddTextModal({ title, placeholder, onClose, onAdd }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const submit = () => {
    if (!value.trim()) { setError("Ce champ est requis"); return; }
    onAdd(value.trim());
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-72 p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl">×</button>
        <h2 className="text-center text-base font-medium text-[#7A6B89] mb-4">{title}</h2>
        <input
          autoFocus
          className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C] mb-1 ${error ? "border-red-400" : "border-gray-300"}`}
          placeholder={placeholder}
          value={value}
          onChange={e => { setValue(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && submit()}
        />
        {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
        <button onClick={submit} className="w-full mt-3 bg-[#9E8A9C] hover:bg-[#8B7589] text-white rounded-lg py-2 text-sm font-medium transition">
          Ajouter
        </button>
      </div>
    </div>
  );
}

const ProductCard = ({ product, index }) => {
  const inStock = product.stock > 0;
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      <div className="bg-[#F8F5F0] flex items-center justify-center h-40 relative overflow-hidden">
        {product.image && <img src={product.image} alt={product.name} className="w-4/5 h-4/5 object-contain" />}
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-500 font-medium">{product.ref}</p>
        {product.name !== product.ref && <p className="text-xs text-gray-700 mt-0.5 truncate">{product.name}</p>}
        <p className="text-xs text-gray-400 mt-0.5">Stock : {product.stock}</p>
        <div className={`mt-2 text-center py-1.5 rounded-lg text-xs font-medium ${inStock ? "bg-[#EAF5EC] text-[#3D7A47]" : "bg-[#FAE8E8] text-[#B04040]"}`}>
          {inStock ? "En stock" : "Rupture de stock"}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState("stock");
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [subCategories, setSubCategories] = useState(INITIAL_SUBCATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [stockFilter, setStockFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState(null); 


  const availableSubs = useMemo(() => {
    if (!activeCategory) return [];
    return subCategories[activeCategory] || [];
  }, [activeCategory, subCategories]);

 
  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search || p.ref.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = !activeCategory || p.category === activeCategory;
      const matchSub = !activeSubCategory || p.subCategory === activeSubCategory;
      const matchStock = stockFilter === "all" || (stockFilter === "in" && p.stock > 0) || (stockFilter === "out" && p.stock === 0);
      return matchSearch && matchCat && matchSub && matchStock;
    });
  }, [products, search, activeCategory, activeSubCategory, stockFilter]);

  const addProduct = useCallback((p) => setProducts(ps => [...ps, p]), []);

  const addCategory = useCallback((name) => {
    if (categories.includes(name)) return;
    setCategories(cs => [...cs, name]);
    setSubCategories(sc => ({ ...sc, [name]: [] }));
  }, [categories]);

  const addSubCategory = useCallback((name) => {
    if (!activeCategory) return;
    setSubCategories(sc => ({
      ...sc,
      [activeCategory]: [...(sc[activeCategory] || []), name],
    }));
  }, [activeCategory]);

  const handleCategoryClick = (cat) => {
    if (activeCategory === cat) { setActiveCategory(null); setActiveSubCategory(null); }
    else { setActiveCategory(cat); setActiveSubCategory(null); }
  };

  const handleSubClick = (sub) => {
    setActiveSubCategory(s => s === sub ? null : sub);
  };

  return (
    <div className="flex h-screen bg-[#F4F2F5] overflow-hidden" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      
      <aside className="w-52 bg-white border-r border-gray-200 flex flex-col shrink-0">
       
        <div className="px-4 pt-5 pb-4 border-b border-gray-100">
          <p className="text-base font-semibold tracking-widest text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>HAJTAIEB</p>
          <p className="text-xs italic text-gray-400">Model</p>
        </div>

    
        <nav className="flex-1 py-4">
          <p className="px-4 text-[9px] font-semibold tracking-widest text-gray-400 uppercase mb-2">Gestion interne</p>
          {[
            { id: "dashboard", label: "Dashboard", icon: <img src="c:\Users\LENOVO\Downloads\4254577.png" alt="Dashboard" className="w-5 h-5" /> },
            { id: "stock", label: "Catégories et Stock", icon: "⊞" },
            { id: "clients", label: "Clients", icon: "👤" },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition border-l-2 ${
                page === item.id
                  ? "border-[#9E8A9C] bg-[#F4EFF5] text-[#7A5E8A] font-medium"
                  : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="px-4 py-4 text-sm text-gray-400 hover:text-gray-600 text-left border-t border-gray-100 transition">
          ← Déconnexion
        </button>
      </aside>

      
      <div className="flex-1 flex flex-col min-w-0">

        
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
          <h1 className="text-xl italic font-medium text-gray-800 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Gestion des Stocks</h1>
          <div className="flex items-center gap-3">
            {["🔔","⚙️","👤"].map((ic, i) => (
              <button key={i} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-base hover:bg-gray-50 transition">
                {ic}
              </button>
            ))}
          </div>
        </header>

      
        <div className="flex flex-1 min-h-0">

          
          <div className="w-56 bg-white border-r border-gray-200 overflow-y-auto shrink-0 p-4">

            
            <section className="mb-5">
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-700 mb-2">Recherche</p>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</span>
                <input
                  type="text"
                  placeholder="nom/référence..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-1 focus:ring-[#9E8A9C]"
                />
              </div>
            </section>

          
            <section className="mb-5">
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-700 mb-2">Catégories</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-2.5 py-1 rounded-full text-xs border transition ${
                      activeCategory === cat
                        ? "bg-[#7A6B89] border-[#7A6B89] text-white"
                        : "bg-white border-gray-300 text-gray-600 hover:border-[#9E8A9C]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  onClick={() => setModal("category")}
                  className="px-2.5 py-1 rounded-full text-xs border border-dashed border-gray-300 text-gray-400 hover:border-[#9E8A9C] hover:text-[#9E8A9C] transition"
                >
                  + Ajouter une catégorie
                </button>
              </div>
            </section>

            <section className="mb-5">
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-700 mb-2">Sous-Catégories</p>
              {!activeCategory ? (
                <p className="text-xs text-gray-400 italic">Sélectionnez une catégorie</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {availableSubs.map(sub => (
                    <button
                      key={sub}
                      onClick={() => handleSubClick(sub)}
                      className={`px-2.5 py-1 rounded-full text-xs border transition ${
                        activeSubCategory === sub
                          ? "bg-[#7A6B89] border-[#7A6B89] text-white"
                          : "bg-white border-gray-300 text-gray-600 hover:border-[#9E8A9C]"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                  <button
                    onClick={() => setModal("subcategory")}
                    className="px-2.5 py-1 rounded-full text-xs border border-dashed border-gray-300 text-gray-400 hover:border-[#9E8A9C] hover:text-[#9E8A9C] transition"
                  >
                    + Ajouter une sous-catégorie
                  </button>
                </div>
              )}
            </section>

          
            <section>
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-700 mb-2">Stock</p>
              <div className="space-y-0.5">
                {[
                  { key: "all", label: "Tous" },
                  { key: "in", label: "En stock" },
                  { key: "out", label: "Rupture" },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setStockFilter(opt.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      stockFilter === opt.key
                        ? "bg-[#EDE8F0] text-[#7A5E8A] font-medium"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>
          </div>


          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">{filtered.length} produit(s)</p>
              <button
                onClick={() => setModal("product")}
                className="bg-[#9E8A9C] hover:bg-[#8B7589] text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
              >
                + Ajouter un produit
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-300">
                <p className="text-5xl mb-3">◇</p>
                <p className="text-sm">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {modal === "product" && (
        <AddProductModal
          categories={categories}
          subCategories={subCategories}
          onClose={() => setModal(null)}
          onAdd={addProduct}
        />
      )}
      {modal === "category" && (
        <AddTextModal
          title="Ajouter une catégorie"
          placeholder="Nom de la catégorie"
          onClose={() => setModal(null)}
          onAdd={addCategory}
        />
      )}
      {modal === "subcategory" && (
        <AddTextModal
          title={`Ajouter une sous-catégorie${activeCategory ? ` — ${activeCategory}` : ""}`}
          placeholder="Nom de la sous-catégorie"
          onClose={() => setModal(null)}
          onAdd={addSubCategory}
        />
      )}
    </div>
  );
}