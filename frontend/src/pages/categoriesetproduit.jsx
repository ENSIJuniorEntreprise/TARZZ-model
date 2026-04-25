import { useState, useMemo } from "react";
import { Package } from "lucide-react";

// ── Catalogue depuis le filesystem (Vite import.meta.glob) ────────────────────
const rawModules = import.meta.glob(
  "../../assets/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP,gif,GIF}",
  { eager: true }
);

function buildCatalog(modules) {
  const catalog = {};
  Object.entries(modules).forEach(([path, mod]) => {
    const rel = path.replace(/^.*\/assets\//, "");
    const parts = rel.split("/");
    if (parts.length < 2) return;
    const category = parts[0];
    const filename = parts[parts.length - 1];
    const name = filename.replace(/\.[^.]+$/, "");
    if (!catalog[category]) catalog[category] = [];
    catalog[category].push({ name, url: mod.default });
  });
  Object.keys(catalog).forEach(cat => {
    catalog[cat].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
    );
  });
  return catalog;
}

const CATALOG = buildCatalog(rawModules);
const CATEGORIES = Object.keys(CATALOG).sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: "base" })
);

// ── Stock (localStorage) ──────────────────────────────────────────────────────
const STOCK_LS_KEY = "tarzz_stocks_v1";

function loadStocks() {
  try { return JSON.parse(localStorage.getItem(STOCK_LS_KEY) || "{}"); }
  catch { return {}; }
}

function persistStocks(s) {
  localStorage.setItem(STOCK_LS_KEY, JSON.stringify(s));
}

function sKey(cat, name) {
  return `${cat}||${name}`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusProps(stock) {
  if (stock === 0) return { bg: "#FAE8E8", color: "#B04040", label: "Rupture" };
  if (stock <= 3)  return { bg: "#FFF7ED", color: "#C2410C", label: "Faible" };
  return              { bg: "#EAF5EC", color: "#3D7A47",  label: "En stock" };
}

const STOCK_FILTERS = [
  { key: "all", label: "Tous" },
  { key: "in",  label: "En stock" },
  { key: "low", label: "Stock faible" },
  { key: "out", label: "Rupture" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProduitsCategories() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0] || null);
  const [stocks, setStocks] = useState(loadStocks);
  const [editingKey, setEditingKey] = useState(null);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const getStock = (cat, name) => stocks[sKey(cat, name)] ?? 0;

  const updateStock = (cat, name, val) => {
    const n = Math.max(0, parseInt(val, 10) || 0);
    const next = { ...stocks, [sKey(cat, name)]: n };
    setStocks(next);
    persistStocks(next);
  };

  const products = useMemo(() => {
    if (!activeCategory) return [];
    let list = CATALOG[activeCategory] || [];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    if (stockFilter !== "all") {
      list = list.filter(p => {
        const s = getStock(activeCategory, p.name);
        if (stockFilter === "out") return s === 0;
        if (stockFilter === "low") return s > 0 && s <= 3;
        if (stockFilter === "in")  return s > 3;
        return true;
      });
    }
    return list;
  }, [activeCategory, search, stockFilter, stocks]);

  const selectCategory = cat => {
    setActiveCategory(cat);
    setSearch("");
    setStockFilter("all");
    setEditingKey(null);
  };

  return (
    <div className="flex flex-1 min-h-0" style={{ fontFamily: "'DM Sans',sans-serif" }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">

        {/* Catégories */}
        <div className="p-4">
          <p className="font-bold text-[10px] tracking-[0.18em] uppercase text-[#1a1212] mb-3">
            Catégories
          </p>
          <div className="space-y-1">
            {CATEGORIES.length === 0 && (
              <p className="text-xs text-[#9a8585]">Aucun dossier trouvé dans assets/</p>
            )}
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition ${
                  activeCategory === cat
                    ? "bg-[#7A6B89] text-white"
                    : "text-[#1a1212] hover:bg-gray-50"
                }`}
              >
                <span className="block text-sm font-semibold truncate">{cat}</span>
                <span
                  className="text-xs font-normal"
                  style={{ color: activeCategory === cat ? "rgba(255,255,255,.7)" : "#9a8585" }}
                >
                  {CATALOG[cat].length} produit(s)
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filtre stock */}
        <div className="p-4 border-t border-gray-100 mt-auto">
          <p className="font-bold text-[10px] tracking-[0.18em] uppercase text-[#1a1212] mb-2">
            État du stock
          </p>
          <div className="space-y-0.5">
            {STOCK_FILTERS.map(opt => (
              <button
                key={opt.key}
                onClick={() => setStockFilter(opt.key)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  stockFilter === opt.key
                    ? "bg-[#EDE8F0] text-[#7A5E8A]"
                    : "text-[#1a1212] hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grille produits ──────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-6">

        {/* En-tête */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <h2 className="font-bold text-lg text-[#1a1212] truncate max-w-xs">
            {activeCategory || "—"}
          </h2>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit…"
            className="ml-auto w-52 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#9E8A9C]"
          />
          <span className="text-sm font-semibold text-[#5e4d4d] whitespace-nowrap">
            <span className="font-bold text-[#1a1212]">{products.length}</span> produit(s)
          </span>
        </div>

        {/* Contenu */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Package size={48} strokeWidth={1} style={{ color: "#d4c5be" }} />
            <p className="text-sm font-semibold text-[#9a8585]">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map(p => {
              const stock = getStock(activeCategory, p.name);
              const st = statusProps(stock);
              const key = sKey(activeCategory, p.name);
              return (
                <div
                  key={key}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="bg-[#f4f4f5] flex items-center justify-center h-36">
                    <img
                      src={p.url}
                      alt={p.name}
                      className="w-4/5 h-4/5 object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Infos */}
                  <div className="p-3">
                    <p
                      className="text-sm font-bold truncate text-[#1a1212]"
                      title={p.name}
                    >
                      {p.name}
                    </p>

                    {/* Badge stock — clic pour modifier */}
                    <div
                      className="mt-2 py-1.5 rounded-lg text-xs font-bold text-center cursor-pointer select-none"
                      style={{ backgroundColor: st.bg, color: st.color }}
                      onClick={() => setEditingKey(key)}
                      title="Cliquer pour modifier le stock"
                    >
                      {editingKey === key ? (
                        <input
                          autoFocus
                          type="number"
                          min="0"
                          defaultValue={stock}
                          className="w-full text-center bg-transparent outline-none font-bold"
                          style={{ color: st.color }}
                          onClick={e => e.stopPropagation()}
                          onBlur={e => {
                            updateStock(activeCategory, p.name, e.target.value);
                            setEditingKey(null);
                          }}
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              updateStock(activeCategory, p.name, e.target.value);
                              setEditingKey(null);
                            }
                            if (e.key === "Escape") setEditingKey(null);
                          }}
                        />
                      ) : (
                        <span>{stock} — {st.label}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
