import { useState, useMemo, useEffect, useRef } from "react";
import {
  Package, Folder, ChevronRight, ChevronDown, ChevronLeft, Plus, FolderPlus, X, Upload, Trash2,
  ShoppingCart, Search, RefreshCw,
} from "lucide-react";
import {
  loadStocks, updateStock as persistStock,
  idToKey, initStocks, getByKey, decrementStocks,
  DEFAULT_STOCK, LOW_STOCK_THRESHOLD,
} from "../utils/stock";
import {
  STATIC_TREE, STATIC_IDS, getNode, sortedChildren, mergeCatalog, flattenTree,
  loadVirtualCategories as loadVCats, saveVirtualCategories as saveVCats,
  loadVirtualProducts as loadVProds, saveVirtualProducts as saveVProds,
} from "../utils/catalog";
import { clients as clientsApi, clientOrders as ordersApi } from "../api";

async function compressImage(file, maxDim = 900, quality = 0.8) {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = url;
  });
}

// ── Stock ─────────────────────────────────────────────────────────────────────
function statusProps(s) {
  if (s === 0)                   return { bg: "#FAE8E8", color: "#B04040", label: "Rupture" };
  if (s <= LOW_STOCK_THRESHOLD)  return { bg: "#FFF7ED", color: "#C2410C", label: "Faible"  };
  return                                { bg: "#EAF5EC", color: "#3D7A47",  label: "En stock" };
}

const STOCK_FILTERS = [
  { key: "all", label: "Tous" },
  { key: "in",  label: "En stock" },
  { key: "low", label: "Stock faible" },
  { key: "out", label: "Rupture" },
];

// ── Modal : Ajouter une catégorie ─────────────────────────────────────────────
function AddCategoryModal({ onClose, onSave }) {
  const [name, setName]   = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const n = name.trim();
    if (!n) { setError("Le nom est requis"); return; }
    onSave(n);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden" style={{ fontFamily: "'DM Sans',sans-serif" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FolderPlus size={18} style={{ color: "#7A6B89" }} />
            <h2 className="font-bold text-sm text-[#1a1212]">Nouvelle catégorie</h2>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="px-5 py-4 flex flex-col gap-3">
          <div>
            <label htmlFor="new-category-name" className="block text-xs font-semibold italic mb-1 text-[#5e4d4d]">Nom *</label>
            <input
              id="new-category-name"
              autoFocus
              value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && submit()}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C] ${error ? "border-red-400" : "border-gray-200"}`}
              placeholder="ex: BIJOUX 2024"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        </div>
        <div className="flex gap-3 justify-end px-5 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-[#5e4d4d] hover:bg-gray-50">Annuler</button>
          <button onClick={submit} className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "linear-gradient(135deg,#7A6B89,#9B8AAA)" }}>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal : Ajouter un produit ────────────────────────────────────────────────
function AddProductModal({ tree, allCategories, onClose, onSave }) {
  const [cat1, setCat1]     = useState("");
  const [cat2, setCat2]     = useState("");
  const [cat3, setCat3]     = useState("");
  const [name, setName]     = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile]     = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const fileRef = useRef();

  const node1 = cat1 ? tree[cat1] : null;
  const subs2 = node1 ? sortedChildren(node1) : [];
  const node2 = (cat1 && cat2) ? node1?.children[cat2] : null;
  const subs3 = node2 ? sortedChildren(node2) : [];

  useEffect(() => { setCat2(""); setCat3(""); }, [cat1]);
  useEffect(() => { setCat3(""); }, [cat2]);

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (!cat1)        { setError("Choisissez une catégorie"); return; }
    if (!name.trim()) { setError("Le nom du produit est requis"); return; }
    if (!file)        { setError("Veuillez sélectionner une image"); return; }
    setSaving(true); setError("");
    try {
      const dataUrl = await compressImage(file);
      const path = [cat1, ...(cat2 ? [cat2] : []), ...(cat3 ? [cat3] : [])];
      onSave({ name: name.trim(), path, dataUrl });
      onClose();
    } catch {
      setError("Erreur lors du traitement de l'image");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ fontFamily: "'DM Sans',sans-serif" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Package size={18} style={{ color: "#7A6B89" }} />
            <h2 className="font-bold text-sm text-[#1a1212]">Ajouter un produit</h2>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div>
            <label htmlFor="new-product-cat1" className="block text-xs font-semibold italic mb-1 text-[#5e4d4d]">Catégorie *</label>
            <select id="new-product-cat1" value={cat1} onChange={e => setCat1(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-1 focus:ring-[#9E8A9C]">
              <option value="">— Choisir —</option>
              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {cat1 && subs2.length > 0 && (
            <div>
              <label htmlFor="new-product-cat2" className="block text-xs font-semibold italic mb-1 text-[#5e4d4d]">Sous-catégorie</label>
              <select id="new-product-cat2" value={cat2} onChange={e => setCat2(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-1 focus:ring-[#9E8A9C]">
                <option value="">— Directement dans {cat1} —</option>
                {subs2.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {cat2 && subs3.length > 0 && (
            <div>
              <label htmlFor="new-product-cat3" className="block text-xs font-semibold italic mb-1 text-[#5e4d4d]">Sous-sous-catégorie</label>
              <select id="new-product-cat3" value={cat3} onChange={e => setCat3(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-1 focus:ring-[#9E8A9C]">
                <option value="">— Directement dans {cat2} —</option>
                {subs3.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="new-product-name" className="block text-xs font-semibold italic mb-1 text-[#5e4d4d]">Nom du produit *</label>
            <input
              id="new-product-name"
              value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]"
              placeholder="ex: Bracelet Or 10g"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold italic mb-1 text-[#5e4d4d]">Image *</label>
            {preview ? (
              <div className="relative w-full h-40 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                <img src={preview} alt="" className="w-full h-full object-contain" />
                <button
                  onClick={() => { setPreview(null); setFile(null); fileRef.current.value = ""; }}
                  className="absolute top-2 right-2 bg-white rounded-lg p-1 shadow hover:bg-red-50"
                >
                  <X size={14} className="text-gray-500" />
                </button>
              </div>
            ) : (
              <button onClick={() => fileRef.current.click()}
                className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-[#9a8585] hover:border-[#9E8A9C] hover:text-[#7A6B89] transition">
                <Upload size={20} />
                <span className="text-xs font-semibold">Cliquer pour sélectionner</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
        </div>

        <div className="flex gap-3 justify-end px-5 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-[#5e4d4d] hover:bg-gray-50">Annuler</button>
          <button onClick={submit} disabled={saving} className="px-4 py-2 rounded-xl text-white text-sm font-bold"
            style={{ background: "linear-gradient(135deg,#7A6B89,#9B8AAA)", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Traitement…" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-2xl"
      style={{ background: "linear-gradient(135deg,#3D7A47,#4E9457)" }}>
      {message}
    </div>
  );
}

// ── Bandeau commande active ─────────────────────────────────────────────────────
function ActiveOrderBanner({ activeOrder, onChange }) {
  if (!activeOrder) return null;
  return (
    <div className="fixed top-4 right-4 z-[65] flex items-center gap-3 bg-white rounded-2xl shadow-xl border border-[#E8DCF0] pl-4 pr-2 py-2"
      style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <ShoppingCart size={15} style={{ color: "#7A6B89" }} />
      <div className="leading-tight">
        <p className="text-xs font-bold text-[#1a1212]">{activeOrder.clientLabel}</p>
        <p className="text-[10px] text-[#9a8585]">{activeOrder.count} article{activeOrder.count !== 1 ? "s" : ""} ajouté{activeOrder.count !== 1 ? "s" : ""}</p>
      </div>
      <button onClick={onChange} title="Changer de commande active"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold hover:bg-[#F0EAF7] transition"
        style={{ color: "#7A6B89" }}>
        <RefreshCw size={11} /> Changer
      </button>
    </div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ product, onPrev, onNext, onClose, stock, onAdd, addBusy, activeOrder, onChangeOrder }) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  if (!product) return null;
  const st = statusProps(stock);
  const outOfStock = stock === 0;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition" aria-label="Fermer">
        <X size={26} />
      </button>

      <button
        onClick={e => { e.stopPropagation(); onPrev(); }}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
        aria-label="Produit précédent"
      >
        <ChevronLeft size={26} />
      </button>
      <button
        onClick={e => { e.stopPropagation(); onNext(); }}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
        aria-label="Produit suivant"
      >
        <ChevronRight size={26} />
      </button>

      <div
        className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg flex flex-col"
        style={{ fontFamily: "'DM Sans',sans-serif", maxHeight: "88vh" }}
        onClick={e => e.stopPropagation()}
      >
        {activeOrder && (
          <div className="flex items-center justify-between px-4 py-2 bg-[#F8F5FB] border-b border-[#E8DCF0] flex-shrink-0">
            <p className="text-[11px] font-semibold truncate" style={{ color: "#5A3F6B" }}>
              Commande active : {activeOrder.clientLabel} · {activeOrder.count} article{activeOrder.count !== 1 ? "s" : ""}
            </p>
            <button onClick={onChangeOrder} className="text-[10px] font-bold underline flex-shrink-0 ml-2" style={{ color: "#7A6B89" }}>
              Changer
            </button>
          </div>
        )}
        <div className="bg-[#f4f4f5] flex items-center justify-center" style={{ height: "48vh" }}>
          <img src={product.url} alt={product.name} className="max-w-[85%] max-h-[85%] object-contain" />
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div>
            <p className="font-bold text-base text-[#1a1212]" title={product.name}>{product.name}</p>
            <p className="text-xs text-[#9a8585] mt-0.5">{product.category}</p>
          </div>
          <span className="inline-flex self-start px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: st.bg, color: st.color }}>
            {stock} en stock — {st.label}
          </span>
          <button
            onClick={() => onAdd(product)}
            disabled={outOfStock || addBusy}
            className="w-full py-3 rounded-xl text-white text-sm font-bold transition"
            style={{
              background: "linear-gradient(135deg,#7A6B89,#9B8AAA)",
              opacity: outOfStock || addBusy ? 0.5 : 1,
              cursor: outOfStock || addBusy ? "not-allowed" : "pointer",
            }}
          >
            {outOfStock ? "Rupture de stock" : addBusy ? "Ajout…" : "Ajouter au panier"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal : choix commande existante / nouvelle commande ──────────────────────
function OrderChoiceModal({ onClose, onChooseExisting, onChooseNew, allowNew }) {
  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" style={{ fontFamily: "'DM Sans',sans-serif" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-sm text-[#1a1212]">Ajouter à une commande</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <button onClick={onChooseExisting}
            className="w-full text-left px-4 py-3.5 rounded-xl border border-gray-200 hover:border-[#C9B8D8] hover:bg-[#F8F5FB] transition">
            <p className="text-sm font-bold text-[#1a1212]">Commande existante</p>
            <p className="text-xs text-[#9a8585] mt-0.5">Choisir parmi les commandes en cours</p>
          </button>
          <button onClick={onChooseNew} disabled={!allowNew}
            className="w-full text-left px-4 py-3.5 rounded-xl border border-gray-200 transition"
            style={{
              opacity: allowNew ? 1 : 0.5,
              cursor: allowNew ? "pointer" : "not-allowed",
              borderColor: allowNew ? undefined : "#eee",
            }}
          >
            <p className="text-sm font-bold text-[#1a1212]">Nouvelle commande</p>
            <p className="text-xs text-[#9a8585] mt-0.5">
              {allowNew ? "Choisir un client et démarrer une commande" : "Disponible lors de l'ajout d'un produit"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal : sélection commande existante (clients uniquement, statut en_commande) ──
function ExistingOrdersModal({ orders, loading, error, recentIds, onSelect, onClose, onGoNew, allowNew }) {
  const recent = orders.filter(o => recentIds.includes(o._id || o.id));
  const rest   = orders.filter(o => !recentIds.includes(o._id || o.id));

  const Row = order => {
    const id = order._id || order.id;
    const label = `${order.client?.firstName || ""} ${order.client?.lastName || ""}`.trim() || "Client";
    const items = order.items || [];
    return (
      <button key={id} onClick={() => onSelect(order)}
        className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-[#C9B8D8] hover:bg-[#F8F5FB] transition flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold truncate text-[#1a1212]">{label}</p>
          <p className="text-xs text-[#9a8585] mt-0.5">{items.length} produit{items.length !== 1 ? "s" : ""}</p>
        </div>
        <ChevronRight size={16} className="flex-shrink-0" style={{ color: "#d4c5be" }} />
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col" style={{ fontFamily: "'DM Sans',sans-serif", maxHeight: "80vh" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-sm text-[#1a1212]">Commande existante</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {loading && <p className="text-sm text-center py-6" style={{ color: "#9a8585" }}>Chargement…</p>}
          {!loading && error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          {!loading && !error && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <ShoppingCart size={32} strokeWidth={1} style={{ color: "#e0d4d4" }} />
              <p className="text-sm text-center" style={{ color: "#9a8585" }}>Aucune commande client en cours</p>
              <button onClick={onGoNew} disabled={!allowNew}
                className="text-xs font-bold underline" style={{ color: "#7A6B89", opacity: allowNew ? 1 : 0.5 }}>
                Créer une nouvelle commande
              </button>
            </div>
          )}
          {!loading && !error && recent.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#9b8095" }}>Récentes</p>
              <div className="flex flex-col gap-2">{recent.map(Row)}</div>
            </div>
          )}
          {!loading && !error && rest.length > 0 && (
            <div>
              {recent.length > 0 && <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#9b8095" }}>Toutes les commandes en cours</p>}
              <div className="flex flex-col gap-2">{rest.map(Row)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Modal : sélection client (nouvelle commande) ───────────────────────────────
function ClientPickerModal({ onClose, onSelect }) {
  const [search, setSearch]   = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true); setError("");
    const t = setTimeout(async () => {
      try {
        const list = await clientsApi.list(search.trim());
        if (alive) setResults(list);
      } catch (e) {
        if (alive) setError(e.message || "Erreur de chargement");
      } finally {
        if (alive) setLoading(false);
      }
    }, 250);
    return () => { alive = false; clearTimeout(t); };
  }, [search]);

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col" style={{ fontFamily: "'DM Sans',sans-serif", maxHeight: "80vh" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-bold text-sm text-[#1a1212]">Nouvelle commande — choisir un client</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="px-5 pt-4 flex-shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#c4b0aa" }} />
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un client…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#9E8A9C]" />
          </div>
        </div>
        <div className="p-5 flex flex-col gap-2 overflow-y-auto">
          {loading && <p className="text-sm text-center py-6" style={{ color: "#9a8585" }}>Chargement…</p>}
          {!loading && error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          {!loading && !error && results.length === 0 && (
            <p className="text-sm text-center py-6" style={{ color: "#9a8585" }}>Aucun client trouvé</p>
          )}
          {!loading && !error && results.map(c => (
            <button key={c.id} onClick={() => onSelect(c)}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-[#C9B8D8] hover:bg-[#F8F5FB] transition flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-[#1a1212]">{c.firstName} {c.lastName}</p>
                {c.phone && <p className="text-xs text-[#9a8585] mt-0.5">{c.phone}</p>}
              </div>
              <ChevronRight size={16} className="flex-shrink-0" style={{ color: "#d4c5be" }} />
            </button>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex-shrink-0">
          <p className="text-[11px] italic" style={{ color: "#9a8585" }}>
            Pour ajouter un client, rendez-vous dans la page Clients.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Composant arbre sidebar ───────────────────────────────────────────────────
function TreeNode({ name, node, depth, path, activePath, expanded, onToggle, onSelect }) {
  const pathStr = path.join("/");
  const isActive = activePath?.join("/") === pathStr;
  const hasChildren = Object.keys(node.children).length > 0;
  const isOpen = expanded.has(pathStr);

  return (
    <div>
      <div className="flex items-center gap-0.5" style={{ paddingLeft: `${6 + depth * 14}px` }}>
        {hasChildren ? (
          <button onClick={() => onToggle(pathStr)} className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100">
            {isOpen
              ? <ChevronDown size={11} style={{ color: "#9a8585" }} />
              : <ChevronRight size={11} style={{ color: "#9a8585" }} />
            }
          </button>
        ) : (
          <span className="w-5 flex-shrink-0" />
        )}
        <button
          onClick={() => onSelect(path)}
          className={`flex-1 min-w-0 text-left py-1.5 px-2 rounded-lg text-xs font-semibold transition truncate ${
            isActive ? "bg-[#7A6B89] text-white" : "text-[#1a1212] hover:bg-gray-50"
          }`}
          title={name}
        >
          {name}
        </button>
      </div>
      {isOpen && hasChildren && (
        <div>
          {sortedChildren(node).map(child => (
            <TreeNode
              key={child} name={child} node={node.children[child]}
              depth={depth + 1} path={[...path, child]}
              activePath={activePath} expanded={expanded}
              onToggle={onToggle} onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
const STATIC_FIRST = Object.keys(STATIC_TREE).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))[0] || null;

export default function ProduitsCategories() {
  const [vData, setVData] = useState(() => ({
    cats:  loadVCats(),
    prods: loadVProds(),
  }));

  const { mergedTree, allCategories } = useMemo(() => {
    const { tree, allCategories: cats } = mergeCatalog(vData.cats, vData.prods);
    return { mergedTree: tree, allCategories: cats };
  }, [vData]);

  const [activePath, setActivePath]   = useState(STATIC_FIRST ? [STATIC_FIRST] : null);
  const [expanded, setExpanded]       = useState(() => new Set(STATIC_FIRST ? [STATIC_FIRST] : []));
  const [stocks, setStocks]           = useState(() => {
    const virtualIds = loadVProds().map(p => p.id);
    return initStocks([...STATIC_IDS, ...virtualIds]);
  });
  const [editingKey, setEditingKey]   = useState(null);
  const [search, setSearch]           = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [showAddCat, setShowAddCat]   = useState(false);
  const [showAddProd, setShowAddProd] = useState(false);

  useEffect(() => {
    const handler = () => setStocks(loadStocks());
    window.addEventListener("tarzz-stock-changed", handler);
    return () => window.removeEventListener("tarzz-stock-changed", handler);
  }, []);

  const getStock    = imgId => getByKey(idToKey(imgId), stocks);
  const doUpdateStock = (imgId, val) => persistStock(idToKey(imgId), Math.max(0, parseInt(val, 10) || 0));

  // ── Lightbox / ajout au panier (commandes CLIENT uniquement) ─────────────────
  const flatAll = useMemo(() => flattenTree(mergedTree), [mergedTree]);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const lightboxProduct = lightboxIdx !== null ? flatAll[lightboxIdx] : null;

  const [activeOrder, setActiveOrder]     = useState(null); // { orderId, clientId, clientLabel, count }
  const [recentOrderIds, setRecentOrderIds] = useState([]);
  const [pendingAdd, setPendingAdd]       = useState(null);
  const [cartFlow, setCartFlow]           = useState(null); // null | 'choice' | 'existing' | 'newClient'
  const [existingOrders, setExistingOrders] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [errorExisting, setErrorExisting] = useState("");
  const [addBusy, setAddBusy]             = useState(false);
  const [toast, setToast]                 = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const openLightboxFor = product => {
    const idx = flatAll.findIndex(p => p.id === product.id);
    if (idx >= 0) setLightboxIdx(idx);
  };
  const closeLightbox = () => setLightboxIdx(null);
  const goPrevProduct  = () => setLightboxIdx(i => (i === null || flatAll.length === 0) ? i : (i - 1 + flatAll.length) % flatAll.length);
  const goNextProduct  = () => setLightboxIdx(i => (i === null || flatAll.length === 0) ? i : (i + 1) % flatAll.length);

  const rememberRecentOrder = orderId => {
    setRecentOrderIds(ids => [orderId, ...ids.filter(x => x !== orderId)].slice(0, 5));
  };

  const performAddToOrder = async (orderId, product) => {
    await ordersApi.addItem(orderId, { productName: product.name, productCategory: product.category, quantity: 1 });
    decrementStocks([{ stockId: product.stockId, quantity: 1 }]);
  };

  const handleAddToCart = async product => {
    if (activeOrder) {
      setAddBusy(true);
      try {
        await performAddToOrder(activeOrder.orderId, product);
        setActiveOrder(o => ({ ...o, count: o.count + 1 }));
        rememberRecentOrder(activeOrder.orderId);
        setToast(`${product.name} ajouté à la commande de ${activeOrder.clientLabel}`);
      } catch (e) {
        setToast(e.message || "Erreur lors de l'ajout");
      } finally {
        setAddBusy(false);
      }
      return;
    }
    setPendingAdd(product);
    setCartFlow("choice");
  };

  const openChangeOrder = () => {
    setPendingAdd(null);
    setCartFlow("choice");
  };

  const closeCartFlow = () => { setCartFlow(null); setPendingAdd(null); };

  const handleChooseExisting = async () => {
    setCartFlow("existing");
    setLoadingExisting(true); setErrorExisting("");
    try {
      const list = await ordersApi.listActive("en_commande");
      setExistingOrders(list);
    } catch (e) {
      setErrorExisting(e.message || "Erreur de chargement");
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleChooseNew = () => {
    if (!pendingAdd) return;
    setCartFlow("newClient");
  };

  const finishSelectExistingOrder = async order => {
    const orderId = order._id || order.id;
    const clientLabel = `${order.client?.firstName || ""} ${order.client?.lastName || ""}`.trim() || "Client";
    const clientId = order.client?._id || order.client;

    if (pendingAdd) {
      setAddBusy(true);
      try {
        await performAddToOrder(orderId, pendingAdd);
        setActiveOrder({ orderId, clientId, clientLabel, count: 1 });
        rememberRecentOrder(orderId);
        setToast(`${pendingAdd.name} ajouté à la commande de ${clientLabel}`);
      } catch (e) {
        setToast(e.message || "Erreur lors de l'ajout");
      } finally {
        setAddBusy(false);
      }
    } else {
      setActiveOrder({ orderId, clientId, clientLabel, count: 0 });
      rememberRecentOrder(orderId);
    }
    closeCartFlow();
  };

  const finishSelectClientForNewOrder = async client => {
    if (!pendingAdd) { closeCartFlow(); return; }
    const clientId = client.id || client._id;
    const clientLabel = `${client.firstName} ${client.lastName}`.trim() || "Client";
    setAddBusy(true);
    try {
      const order = await ordersApi.create(clientId, {
        items: [{ productName: pendingAdd.name, productCategory: pendingAdd.category, quantity: 1 }],
        status: "en_commande",
      });
      decrementStocks([{ stockId: pendingAdd.stockId, quantity: 1 }]);
      const orderId = order._id || order.id;
      setActiveOrder({ orderId, clientId, clientLabel, count: 1 });
      rememberRecentOrder(orderId);
      setToast(`${pendingAdd.name} ajouté à la nouvelle commande de ${clientLabel}`);
    } catch (e) {
      setToast(e.message || "Erreur lors de la création de la commande");
    } finally {
      setAddBusy(false);
      closeCartFlow();
    }
  };

  const toggleExpanded = pathStr => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(pathStr) ? next.delete(pathStr) : next.add(pathStr);
      return next;
    });
  };

  const selectPath = path => {
    setActivePath(path);
    setSearch("");
    setStockFilter("all");
    setEditingKey(null);
    setExpanded(prev => {
      const next = new Set(prev);
      for (let i = 1; i <= path.length; i++) next.add(path.slice(0, i).join("/"));
      return next;
    });
  };

  const handleAddCategory = name => {
    if (STATIC_TREE[name] || vData.cats.includes(name)) return;
    const newCats = [...vData.cats, name];
    saveVCats(newCats);
    setVData(d => ({ ...d, cats: newCats }));
  };

  const handleAddProduct = ({ name, path, dataUrl }) => {
    const id = `virtual/${name.replace(/\s+/g, "_")}_${Date.now()}`;
    const newProd = { id, name, path, dataUrl };
    const newProds = [newProd, ...vData.prods];
    saveVProds(newProds);
    setVData(d => ({ ...d, prods: newProds }));
    persistStock(idToKey(id), DEFAULT_STOCK);
  };

  const handleDeleteVProduct = id => {
    const newProds = vData.prods.filter(p => p.id !== id);
    saveVProds(newProds);
    setVData(d => ({ ...d, prods: newProds }));
  };

  const currentNode = useMemo(() => getNode(activePath, mergedTree), [activePath, mergedTree]);

  const images = useMemo(() => {
    if (!currentNode) return [];
    let list = currentNode.images;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    if (stockFilter !== "all") {
      list = list.filter(p => {
        const s = getStock(p.id);
        if (stockFilter === "out") return s === 0;
        if (stockFilter === "low") return s > 0 && s <= LOW_STOCK_THRESHOLD;
        if (stockFilter === "in")  return s > LOW_STOCK_THRESHOLD;
        return true;
      });
    }
    return list;
  }, [activePath, currentNode, search, stockFilter, stocks]);

  const children = useMemo(() =>
    currentNode ? sortedChildren(currentNode) : [],
    [currentNode]
  );

  return (
    <div className="flex flex-1 min-h-0" style={{ fontFamily: "'DM Sans',sans-serif" }}>

      {/* ── Sidebar ───────────────────────────────────────────────────────────── */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="font-bold text-[10px] tracking-[0.18em] uppercase text-[#1a1212]">Catégories</p>
            <button
              onClick={() => setShowAddCat(true)}
              title="Nouvelle catégorie"
              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[#F0EAF7] transition"
              style={{ color: "#7A6B89" }}
            >
              <FolderPlus size={13} />
            </button>
          </div>

          {allCategories.map(cat => {
            const catNode = mergedTree[cat];
            const isVirtual    = !STATIC_TREE[cat];
            const isCatActive  = activePath?.[0] === cat;
            const isTopSelected = activePath?.length === 1 && activePath[0] === cat;
            const hasChildren  = Object.keys(catNode.children).length > 0;
            const isOpen       = expanded.has(cat);

            return (
              <div key={cat} className="mb-0.5">
                <div className="flex items-center gap-0.5">
                  {hasChildren ? (
                    <button onClick={() => toggleExpanded(cat)}
                      className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100">
                      {isOpen
                        ? <ChevronDown size={12} style={{ color: "#9a8585" }} />
                        : <ChevronRight size={12} style={{ color: "#9a8585" }} />
                      }
                    </button>
                  ) : (
                    <span className="w-5 flex-shrink-0" />
                  )}
                  <button
                    onClick={() => selectPath([cat])}
                    className={`flex-1 min-w-0 text-left px-2.5 py-2 rounded-xl transition ${
                      isTopSelected
                        ? "bg-[#7A6B89] text-white"
                        : isCatActive
                          ? "bg-[#F0EAF7] text-[#5A3F6B]"
                          : "text-[#1a1212] hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="block text-sm font-semibold truncate">{cat}</span>
                      {isVirtual && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                          style={{ background: isTopSelected ? "rgba(255,255,255,.25)" : "#EDE8F0", color: isTopSelected ? "#fff" : "#7A6B89" }}>
                          +
                        </span>
                      )}
                    </span>
                    <span className="text-xs font-normal" style={{
                      color: isTopSelected ? "rgba(255,255,255,.7)" : "#9a8585"
                    }}>
                      {catNode.images.length + Object.keys(catNode.children).length} éléments
                    </span>
                  </button>
                </div>

                {isOpen && hasChildren && (
                  <div className="mt-0.5 mb-1">
                    {sortedChildren(catNode).map(child => (
                      <TreeNode
                        key={child} name={child}
                        node={catNode.children[child]}
                        depth={0} path={[cat, child]}
                        activePath={activePath} expanded={expanded}
                        onToggle={toggleExpanded} onSelect={selectPath}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Filtre stock */}
        <div className="p-3 border-t border-gray-100 shrink-0">
          <p className="font-bold text-[10px] tracking-[0.18em] uppercase text-[#1a1212] mb-1.5">
            État du stock
          </p>
          <div className="space-y-0.5">
            {STOCK_FILTERS.map(opt => (
              <button key={opt.key} onClick={() => setStockFilter(opt.key)}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  stockFilter === opt.key ? "bg-[#EDE8F0] text-[#7A5E8A]" : "text-[#1a1212] hover:bg-gray-50"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Zone principale ──────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-6">

        {/* Fil d'Ariane + boutons + recherche */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-1 text-sm flex-wrap">
            {(activePath || []).map((seg, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={13} style={{ color: "#c4b0aa" }} />}
                <button
                  onClick={() => selectPath((activePath || []).slice(0, i + 1))}
                  className={`transition hover:text-[#7A6B89] ${
                    i === (activePath?.length ?? 0) - 1
                      ? "font-bold text-[#1a1212]"
                      : "font-semibold text-[#9a8585]"
                  }`}
                >
                  {seg}
                </button>
              </span>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowAddProd(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg,#7A6B89,#9B8AAA)" }}
            >
              <Plus size={13} /> Ajouter un produit
            </button>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="w-40 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#9E8A9C]"
            />
            <span className="text-sm font-semibold text-[#5e4d4d] whitespace-nowrap">
              <span className="font-bold text-[#1a1212]">{images.length}</span> image(s)
            </span>
          </div>
        </div>

        {/* Sous-dossiers */}
        {!search && children.length > 0 && (
          <div className="mb-6">
            <p className="font-bold text-[10px] tracking-[0.18em] uppercase text-[#9a8585] mb-3">
              Sous-dossiers ({children.length})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {children.map(folderName => {
                const child = currentNode.children[folderName];
                const total = child.images.length + Object.keys(child.children).length;
                return (
                  <button
                    key={folderName}
                    onClick={() => selectPath([...(activePath || []), folderName])}
                    className="bg-[#F8F5FB] border border-[#E8DCF0] rounded-xl p-3 text-left hover:border-[#C9B8D8] hover:shadow-sm transition-all"
                  >
                    <Folder size={22} style={{ color: "#9B6B9A", marginBottom: 6 }} />
                    <p className="text-xs font-bold text-[#1a1212] truncate" title={folderName}>{folderName}</p>
                    <p className="text-xs text-[#9a8585]">{total} élément(s)</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Images */}
        {images.length === 0 && children.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Package size={48} strokeWidth={1} style={{ color: "#d4c5be" }} />
            <p className="text-sm font-semibold text-[#9a8585]">Aucun contenu trouvé</p>
          </div>
        ) : images.length > 0 ? (
          <>
            {children.length > 0 && !search && (
              <p className="font-bold text-[10px] tracking-[0.18em] uppercase text-[#9a8585] mb-3">
                Images ({images.length})
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map(p => {
                const stock = getStock(p.id);
                const st    = statusProps(stock);
                const eKey  = idToKey(p.id);
                return (
                  <div
                    key={eKey}
                    className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    style={p.virtual ? { borderColor: "#C9B8D8" } : {}}
                  >
                    {p.virtual && (
                      <div className="absolute top-2 left-2 z-10 bg-[#7A6B89] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        Ajouté
                      </div>
                    )}
                    {p.virtual && (
                      <button
                        onClick={() => handleDeleteVProduct(p.id)}
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 bg-white rounded-lg p-1 shadow hover:bg-red-50 transition"
                        title="Supprimer"
                      >
                        <Trash2 size={12} className="text-red-400" />
                      </button>
                    )}
                    <div
                      className="bg-[#f4f4f5] flex items-center justify-center h-36 cursor-zoom-in"
                      onClick={() => openLightboxFor(p)}
                      title="Cliquer pour agrandir"
                    >
                      <img src={p.url} alt={p.name} className="w-4/5 h-4/5 object-contain" loading="lazy" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold truncate text-[#1a1212]" title={p.displayName}>
                        {p.displayName}
                      </p>
                      <div
                        className="mt-2 py-1.5 rounded-lg text-xs font-bold text-center cursor-pointer select-none"
                        style={{ backgroundColor: st.bg, color: st.color }}
                        onClick={() => setEditingKey(eKey)}
                        title="Cliquer pour modifier le stock"
                        role="button"
                        tabIndex={0}
                        aria-label={`Stock de ${p.displayName} : ${stock}, ${st.label}. Appuyer pour modifier.`}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setEditingKey(eKey); }
                        }}
                      >
                        {editingKey === eKey ? (
                          <input
                            autoFocus type="number" min="0" defaultValue={stock}
                            className="w-full text-center bg-transparent outline-none font-bold"
                            style={{ color: st.color }}
                            onClick={e => e.stopPropagation()}
                            onBlur={e => { doUpdateStock(p.id, e.target.value); setEditingKey(null); }}
                            onKeyDown={e => {
                              if (e.key === "Enter")  { doUpdateStock(p.id, e.target.value); setEditingKey(null); }
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
          </>
        ) : null}
      </main>

      {showAddCat  && <AddCategoryModal onClose={() => setShowAddCat(false)}  onSave={handleAddCategory} />}
      {showAddProd && <AddProductModal  onClose={() => setShowAddProd(false)} onSave={handleAddProduct}
                        tree={mergedTree} allCategories={allCategories} />}

      {!lightboxProduct && <ActiveOrderBanner activeOrder={activeOrder} onChange={openChangeOrder} />}

      {lightboxProduct && (
        <Lightbox
          product={lightboxProduct}
          stock={getByKey(lightboxProduct.stockId, stocks)}
          onPrev={goPrevProduct}
          onNext={goNextProduct}
          onClose={closeLightbox}
          onAdd={handleAddToCart}
          addBusy={addBusy}
          activeOrder={activeOrder}
          onChangeOrder={openChangeOrder}
        />
      )}

      {cartFlow === "choice" && (
        <OrderChoiceModal
          onClose={closeCartFlow}
          onChooseExisting={handleChooseExisting}
          onChooseNew={handleChooseNew}
          allowNew={!!pendingAdd}
        />
      )}

      {cartFlow === "existing" && (
        <ExistingOrdersModal
          orders={existingOrders}
          loading={loadingExisting}
          error={errorExisting}
          recentIds={recentOrderIds}
          onSelect={finishSelectExistingOrder}
          onClose={closeCartFlow}
          onGoNew={handleChooseNew}
          allowNew={!!pendingAdd}
        />
      )}

      {cartFlow === "newClient" && (
        <ClientPickerModal onClose={closeCartFlow} onSelect={finishSelectClientForNewOrder} />
      )}

      <Toast message={toast} />
    </div>
  );
}
