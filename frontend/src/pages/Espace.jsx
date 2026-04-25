import { useState, useMemo } from "react";
import { Images } from "lucide-react";

const espaceModules = import.meta.glob(
  "../../espace/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP,gif,GIF}",
  { eager: true }
);

const PHOTOS = Object.entries(espaceModules)
  .map(([path, mod]) => ({
    name: path.split("/").pop().replace(/\.[^.]+$/, ""),
    url: mod.default,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

export default function Espace() {
  const [search, setSearch] = useState("");

  const photos = useMemo(() => {
    if (!search.trim()) return PHOTOS;
    const q = search.toLowerCase();
    return PHOTOS.filter(p => p.name.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ fontFamily: "'DM Sans',sans-serif" }}>
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Images size={22} style={{ color: "#9B6B9A" }} />
          <h1 className="font-bold text-xl text-[#5A3F6B]">Espace</h1>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une photo…"
          className="ml-auto w-52 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-[#C9B8D8]"
        />
        <span className="text-sm font-semibold text-[#5e4d4d] whitespace-nowrap">
          <span className="font-bold text-[#1a1212]">{photos.length}</span> photo(s)
        </span>
      </div>

      {/* Grille */}
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Images size={48} strokeWidth={1} style={{ color: "#d4c5be" }} />
          <p className="text-sm font-semibold text-[#9a8585]">Aucune photo trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {photos.map(p => (
            <div
              key={p.name}
              className="bg-white rounded-xl border-2 border-[#E8DCF0] overflow-hidden hover:shadow-md hover:border-[#C9B8D8] transition-all"
            >
              <div className="bg-[#FAF7FD] flex items-center justify-center h-36">
                <img
                  src={p.url}
                  alt={p.name}
                  className="w-4/5 h-4/5 object-contain"
                  loading="lazy"
                />
              </div>
              <div className="px-3 py-2">
                <p className="text-xs font-semibold truncate text-[#5A3F6B]" title={p.name}>
                  {p.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
