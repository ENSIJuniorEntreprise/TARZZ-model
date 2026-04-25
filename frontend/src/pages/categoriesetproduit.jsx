import { useState, useMemo, useEffect } from "react";
import { Package, Folder, ChevronRight, ChevronDown } from "lucide-react";

// ── Construction de l'arbre depuis assets/ ────────────────────────────────────
const rawModules = import.meta.glob(
  "../../assets/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP,gif,GIF}",
  { eager: true }
);

const SKIP = new Set(["desktop.ini", "thumbs.db", ".ds_store"]);
const KY_CATS = new Set(["KY1", "KY2"]);

function buildTree(modules) {
  const tree = {};
  Object.entries(modules).forEach(([path, mod]) => {
    const rel = path.replace(/^.*\/assets\//, "");
    const parts = rel.split("/");
    if (parts.length < 2) return;
    const filename = parts[parts.length - 1];
    if (SKIP.has(filename.toLowerCase())) return;
    const name = filename.replace(/\.[^.]+$/, "");
    const folders = parts.slice(0, -1);
    const cat = folders[0];
    if (!tree[cat]) tree[cat] = { images: [], children: {} };
    let node = tree[cat];
    for (let i = 1; i < folders.length; i++) {
      const sub = folders[i];
      if (!node.children[sub]) node.children[sub] = { images: [], children: {} };
      node = node.children[sub];
    }
    node.images.push({ name, url: mod.default, displayName: name });
  });

  // Pour KY1/KY2 : le nom affiché = chemin des sous-dossiers (pas le nom de fichier)
  function applyKyNames(node, pathParts) {
    const subPath = pathParts.slice(1); // exclure la catégorie top
    const base = subPath.length > 0 ? subPath.join(" · ") : pathParts[0];
    node.images.forEach((img, i) => {
      img.displayName = node.images.length > 1 ? `${base} (${i + 1})` : base;
    });
    Object.entries(node.children).forEach(([child, childNode]) =>
      applyKyNames(childNode, [...pathParts, child])
    );
  }

  function sortNode(n) {
    n.images.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    Object.values(n.children).forEach(sortNode);
  }
  Object.values(tree).forEach(sortNode);

  // Appliquer après le tri pour que les indices (1), (2)... soient stables
  KY_CATS.forEach(cat => {
    if (tree[cat]) applyKyNames(tree[cat], [cat]);
  });

  return tree;
}

const TREE = buildTree(rawModules);
const CATEGORIES = Object.keys(TREE).sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: "base" })
);

function getNode(path) {
  if (!path?.length) return null;
  let node = TREE[path[0]];
  for (let i = 1; i < path.length; i++) {
    if (!node) return null;
    node = node.children[path[i]];
  }
  return node;
}

function sortedChildren(node) {
  return Object.keys(node.children).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
}

// ── Stock ─────────────────────────────────────────────────────────────────────
const STOCK_KEY = "tarzz_stocks_v1";
const loadStocks = () => { try { return JSON.parse(localStorage.getItem(STOCK_KEY) || "{}"); } catch { return {}; } };
const saveStocks = s => localStorage.setItem(STOCK_KEY, JSON.stringify(s));
const sKey = (path, img) => `${path.join("/")}||${img}`;

function statusProps(s) {
  if (s === 0) return { bg: "#FAE8E8", color: "#B04040", label: "Rupture" };
  if (s <= 3)  return { bg: "#FFF7ED", color: "#C2410C", label: "Faible" };
  return            { bg: "#EAF5EC", color: "#3D7A47",  label: "En stock" };
}

const STOCK_FILTERS = [
  { key: "all", label: "Tous" },
  { key: "in",  label: "En stock" },
  { key: "low", label: "Stock faible" },
  { key: "out", label: "Rupture" },
];

// ── Composant arbre sidebar ───────────────────────────────────────────────────
function TreeNode({ name, node, depth, path, activePath, expanded, onToggle, onSelect }) {
  const pathStr = path.join("/");
  const isActive = activePath?.join("/") === pathStr;
  const hasChildren = Object.keys(node.children).length > 0;
  const isOpen = expanded.has(pathStr);

  return (
    <div>
      <div
        className="flex items-center gap-0.5"
        style={{ paddingLeft: `${6 + depth * 14}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => onToggle(pathStr)}
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100"
          >
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
            isActive
              ? "bg-[#7A6B89] text-white"
              : "text-[#1a1212] hover:bg-gray-50"
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
              key={child}
              name={child}
              node={node.children[child]}
              depth={depth + 1}
              path={[...path, child]}
              activePath={activePath}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function ProduitsCategories() {
  const first = CATEGORIES[0] || null;
  const [activePath, setActivePath] = useState(first ? [first] : null);
  const [expanded, setExpanded]     = useState(() => new Set(first ? [first] : []));
  const [stocks, setStocks]         = useState(loadStocks);
  const [editingKey, setEditingKey] = useState(null);
  const [search, setSearch]         = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const getStock = (path, name) => stocks[sKey(path, name)] ?? 0;

  const updateStock = (path, name, val) => {
    const n = Math.max(0, parseInt(val, 10) || 0);
    const next = { ...stocks, [sKey(path, name)]: n };
    setStocks(next);
    saveStocks(next);
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
    // Auto-expand tous les ancêtres
    setExpanded(prev => {
      const next = new Set(prev);
      for (let i = 1; i <= path.length; i++) next.add(path.slice(0, i).join("/"));
      return next;
    });
  };

  const currentNode = useMemo(() => getNode(activePath), [activePath]);

  const images = useMemo(() => {
    if (!currentNode) return [];
    let list = currentNode.images;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    if (stockFilter !== "all") {
      list = list.filter(p => {
        const s = getStock(activePath, p.name);
        if (stockFilter === "out") return s === 0;
        if (stockFilter === "low") return s > 0 && s <= 3;
        if (stockFilter === "in")  return s > 3;
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

      {/* ── Sidebar arborescente ─────────────────────────────────────────────── */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="flex-1 overflow-y-auto p-3">
          <p className="font-bold text-[10px] tracking-[0.18em] uppercase text-[#1a1212] mb-2 px-1">
            Catégories
          </p>

          {CATEGORIES.map(cat => {
            const catNode = TREE[cat];
            const isCatActive = activePath?.[0] === cat;
            const isTopSelected = activePath?.length === 1 && activePath[0] === cat;
            const hasChildren = Object.keys(catNode.children).length > 0;
            const isOpen = expanded.has(cat);

            return (
              <div key={cat} className="mb-0.5">
                {/* Bouton catégorie top-level */}
                <div className="flex items-center gap-0.5">
                  {hasChildren ? (
                    <button
                      onClick={() => toggleExpanded(cat)}
                      className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100"
                    >
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
                    <span className="block text-sm font-semibold truncate">{cat}</span>
                    <span className="text-xs font-normal" style={{
                      color: isTopSelected ? "rgba(255,255,255,.7)" : "#9a8585"
                    }}>
                      {catNode.images.length + Object.keys(catNode.children).length} éléments
                    </span>
                  </button>
                </div>

                {/* Sous-arbre */}
                {isOpen && hasChildren && (
                  <div className="mt-0.5 mb-1">
                    {sortedChildren(catNode).map(child => (
                      <TreeNode
                        key={child}
                        name={child}
                        node={catNode.children[child]}
                        depth={0}
                        path={[cat, child]}
                        activePath={activePath}
                        expanded={expanded}
                        onToggle={toggleExpanded}
                        onSelect={selectPath}
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

        {/* Fil d'Ariane + recherche */}
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
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="ml-auto w-48 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#9E8A9C]"
          />
          <span className="text-sm font-semibold text-[#5e4d4d] whitespace-nowrap">
            <span className="font-bold text-[#1a1212]">{images.length}</span> image(s)
          </span>
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
                    <p className="text-xs font-bold text-[#1a1212] truncate" title={folderName}>
                      {folderName}
                    </p>
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
                const stock = getStock(activePath, p.name);
                const st = statusProps(stock);
                const key = sKey(activePath, p.name);
                return (
                  <div
                    key={key}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="bg-[#f4f4f5] flex items-center justify-center h-36">
                      <img
                        src={p.url}
                        alt={p.name}
                        className="w-4/5 h-4/5 object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold truncate text-[#1a1212]" title={p.displayName}>
                        {p.displayName}
                      </p>
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
                            onBlur={e => { updateStock(activePath, p.name, e.target.value); setEditingKey(null); }}
                            onKeyDown={e => {
                              if (e.key === "Enter") { updateStock(activePath, p.name, e.target.value); setEditingKey(null); }
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
    </div>
  );
}
