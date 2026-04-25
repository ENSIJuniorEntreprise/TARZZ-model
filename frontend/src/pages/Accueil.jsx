import { useState, useEffect } from "react";
import {
  ShoppingCart, XCircle, Clock, BarChart2, AlertTriangle,
  ArrowLeft, TrendingUp, Calendar, Award, Users, Package,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { dashboard as dashApi } from "../api";
import { getStockStats } from "../utils/stock";

// ── Constantes ────────────────────────────────────────────────────────────────
const STATUS_MAP = {
  livre:       { bg: "#EAF5EC", color: "#3D7A47", dot: "#22c55e", label: "Livré" },
  en_cours:    { bg: "#FFF7ED", color: "#C2410C", dot: "#f59e0b", label: "En cours" },
  en_commande: { bg: "#FAE8E8", color: "#B04040", dot: "#ef4444", label: "En commande" },
};

function fmtDate(d) {
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2,"0")}/${String(dt.getMonth()+1).padStart(2,"0")}/${dt.getFullYear()}`;
}

// ── Composant ─────────────────────────────────────────────────────────────────
export default function Accueil() {
  const [page,       setPage]       = useState("dashboard");
  const [data,       setData]       = useState(null);
  const [error,      setError]      = useState("");
  const [stockStats, setStockStats] = useState(getStockStats);

  useEffect(() => {
    dashApi.get().then(setData).catch(e => setError(e.message));
  }, []);

  useEffect(() => {
    const handler = () => setStockStats(getStockStats());
    window.addEventListener('tarzz-stock-changed', handler);
    return () => window.removeEventListener('tarzz-stock-changed', handler);
  }, []);

  const chartData = data?.monthlyStats?.length ? data.monthlyStats : [];
  const totalCmd  = chartData.reduce((s, d) => s + d.commandes, 0);
  const maxCmd    = Math.max(...chartData.map(d => d.commandes), 0);
  const maxMonth  = chartData.find(d => d.commandes === maxCmd)?.mois || "—";
  const avgCmd    = chartData.length ? Math.round(totalCmd / chartData.length) : 0;

  const kpiConfig = [
    { label: "Clients enregistrés", value: data?.totalClients ?? "—", icon: Users,        accent: "#5a9b7a" },
    { label: "Commandes livrées",   value: data?.delivered    ?? "—", icon: ShoppingCart,  accent: "#3b82f6" },
    { label: "En commande",         value: data?.enCommande   ?? "—", icon: Clock,         accent: "#9b6b7a" },
    { label: "Ruptures de stock",   value: stockStats.outOfStock,     icon: XCircle,       accent: "#c06060" },
  ];

  const font = { fontFamily: "'DM Sans', sans-serif" };

  return (
    <>
      {/* ══ DASHBOARD ══ */}
      {page === "dashboard" && (
        <main className="flex-1 p-8 bg-white" style={font}>

          <div className="mb-8">
            <p className="font-bold uppercase mb-2" style={{ fontSize: "11px", color: "#9b7a8a", letterSpacing: "0.20em" }}>
              Aperçu de la boutique
            </p>
            <div className="flex items-center justify-between">
              <h1 className="font-bold" style={{ fontSize: "42px", color: "#1a1212", letterSpacing: "0.01em", lineHeight: 1.1, fontFamily: "'DM Serif Display', serif" }}>
                Hajtajeb Modèles
              </h1>
              <button
                onClick={() => setPage("stats")}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-white text-sm font-bold hover:opacity-90 transition"
                style={{ background: "linear-gradient(135deg,#9b6b7a,#b07585)", boxShadow: "0 4px 12px rgba(155,107,122,.28)" }}
              >
                <BarChart2 size={17} /> Statistiques
              </button>
            </div>
          </div>

          {error && <p className="text-sm mb-4" style={{ color: "#b91c1c" }}>{error}</p>}

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {kpiConfig.map(({ label, value, icon: Icon, accent }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border overflow-hidden relative" style={{ borderColor: "#ede5df" }}>
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-[0.07]" style={{ backgroundColor: accent }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${accent}18`, color: accent }}>
                  <Icon size={19} />
                </div>
                <span style={{ fontSize: "38px", fontWeight: 700, color: "#1a1212", lineHeight: 1, display: "block", marginBottom: 6 }}>{value}</span>
                <p className="font-semibold" style={{ fontSize: "13px", color: "#5e4d4d" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Stock alert banner */}
          {(stockStats.outOfStock > 0 || stockStats.lowStock > 0) && (
            <div className="rounded-2xl p-4 mb-6 flex items-center gap-4 border" style={{ borderColor: "#f0ebe8", background: "#FFFBF7" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#fff7ed", color: "#c2410c" }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "#1a1212" }}>Alertes de stock</p>
                <p className="text-xs mt-0.5" style={{ color: "#7a6060" }}>
                  {stockStats.outOfStock} rupture{stockStats.outOfStock !== 1 ? "s" : ""} · {stockStats.lowStock} stock{stockStats.lowStock !== 1 ? "s" : ""} faible{stockStats.lowStock !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="ml-auto flex gap-8">
                {[
                  { label: "Ruptures",    value: stockStats.outOfStock, color: "#ef4444" },
                  { label: "Stock faible", value: stockStats.lowStock,   color: "#f59e0b" },
                  { label: "En cours",    value: data?.inProgress ?? "—", color: "#3b82f6" },
                ].map(b => (
                  <div key={b.label} className="text-center">
                    <span style={{ fontSize: "24px", fontWeight: 700, color: b.color, display: "block" }}>{b.value}</span>
                    <p style={{ fontSize: "12px", color: "#7a6060", marginTop: 2 }}>{b.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom grid */}
          <div className="grid grid-cols-2 gap-5">

            {/* Dernières commandes */}
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#ede5df" }}>
              <p className="font-bold mb-5" style={{ fontSize: "16px", color: "#1a1212" }}>Dernières commandes</p>
              {!data?.recentPurchases?.length ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <ShoppingCart size={36} strokeWidth={1} style={{ color: "#d4c5be" }} />
                  <p className="font-medium text-sm" style={{ color: "#9a8585" }}>Aucune commande pour l'instant</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {data.recentPurchases.map(p => {
                    const st = STATUS_MAP[p.status] || STATUS_MAP.en_commande;
                    return (
                      <div key={String(p.id)} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "#ede5df" }}>
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: st.dot }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate text-sm" style={{ color: "#1a1212" }}>
                            {p.firstName} {p.lastName}
                          </p>
                          <p className="text-xs" style={{ color: "#7a6060" }}>
                            {p.itemCount} produit{p.itemCount !== 1 ? "s" : ""} · {fmtDate(p.date)}
                          </p>
                        </div>
                        <span className="font-semibold px-2.5 py-1 rounded-full text-xs" style={{ backgroundColor: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Alertes stock */}
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#ede5df" }}>
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold" style={{ fontSize: "16px", color: "#1a1212" }}>Alertes stock</p>
                <span className="flex items-center gap-1.5 font-bold px-3 py-1 rounded-full text-xs" style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}>
                  <AlertTriangle size={11} /> Attention
                </span>
              </div>
              {!stockStats.lowStockItems.length ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Package size={36} strokeWidth={1} style={{ color: "#d4c5be" }} />
                  <p className="font-medium text-sm" style={{ color: "#9a8585" }}>Aucune alerte</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {stockStats.lowStockItems.map(item => (
                    <div key={item.key} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "#ede5df" }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.stock === 0 ? "#fef2f2" : "#fff7ed" }}>
                        <Package size={16} style={{ color: item.stock === 0 ? "#b91c1c" : "#c2410c" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-sm" style={{ color: "#1a1212" }}>{item.name}</p>
                        <p className="text-xs truncate" style={{ color: "#7a6060" }}>{item.category}</p>
                      </div>
                      <span className="font-bold px-2.5 py-1 rounded-full text-sm" style={{ backgroundColor: item.stock === 0 ? "#fef2f2" : "#fff7ed", color: item.stock === 0 ? "#b91c1c" : "#c2410c" }}>
                        {item.stock}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ══ STATS ══ */}
      {page === "stats" && (
        <main className="flex-1 p-8 bg-white" style={font}>
          <div className="flex items-center gap-2 mb-7 font-semibold text-sm" style={{ color: "#7a6060" }}>
            <button
              onClick={() => setPage("dashboard")}
              className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer font-semibold text-sm"
              style={{ color: "#9b6b7a" }}
            >
              <ArrowLeft size={14} /> Dashboard
            </button>
            <span style={{ color: "#c4b0aa" }}>/</span>
            <span>Statistiques</span>
          </div>

          <div className="mb-8">
            <h1 className="font-bold mb-2" style={{ fontSize: "42px", color: "#1a1212", letterSpacing: "0.01em", lineHeight: 1.1, fontFamily: "'DM Serif Display', serif" }}>
              Statistiques des commandes
            </h1>
            <p className="font-medium" style={{ fontSize: "15px", color: "#7a6060" }}>
              Historique réel des commandes clients
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total commandes", value: totalCmd,  sub: "toutes périodes", icon: TrendingUp, accent: "#9b6b7a" },
              { label: "Mois le plus actif", value: maxMonth, sub: `${maxCmd} commandes`, icon: Award, accent: "#5a9b7a" },
              { label: "Moyenne mensuelle", value: avgCmd,   sub: "commandes / mois",  icon: Calendar, accent: "#c08a3a" },
            ].map(({ label, value, sub, icon: Icon, accent }) => (
              <div key={label} className="bg-white rounded-2xl p-6 border flex items-start gap-4 overflow-hidden relative" style={{ borderColor: "#ede5df" }}>
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-[0.07]" style={{ backgroundColor: accent }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}18`, color: accent }}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-semibold mb-1" style={{ fontSize: "13px", color: "#7a6060" }}>{label}</p>
                  <span style={{ fontSize: "38px", fontWeight: 700, color: "#1a1212", lineHeight: 1, display: "block" }}>{value}</span>
                  <p className="font-medium mt-1.5" style={{ fontSize: "13px", color: "#9b7a8a" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 bg-white rounded-2xl border" style={{ borderColor: "#ede5df" }}>
              <BarChart2 size={36} strokeWidth={1} style={{ color: "#d4c5be" }} />
              <p className="font-medium text-sm" style={{ color: "#9a8585" }}>Aucune donnée disponible pour l'instant</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl p-6 border mb-4" style={{ borderColor: "#ede5df" }}>
                <p className="font-bold mb-5" style={{ fontSize: "16px", color: "#1a1212" }}>Évolution mensuelle des commandes</p>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#9b6b7a" />
                        <stop offset="100%" stopColor="#c49aaa" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e2" />
                    <XAxis dataKey="mois" tick={{ fontSize: 13, fill: "#5e4d4d", fontFamily: "DM Sans", fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 13, fill: "#5e4d4d", fontFamily: "DM Sans", fontWeight: 500 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ border: "1px solid #ede5df", borderRadius: 12, fontSize: 14, fontFamily: "DM Sans", backgroundColor: "#fff" }} labelStyle={{ color: "#1a1212", fontWeight: 700 }} itemStyle={{ color: "#9b6b7a", fontWeight: 600 }} />
                    <Line type="monotone" dataKey="commandes" stroke="url(#lg1)" strokeWidth={3} dot={{ fill: "#9b6b7a", r: 5, strokeWidth: 0 }} activeDot={{ r: 7, fill: "#7a4d5d", strokeWidth: 0 }} name="Commandes" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#ede5df" }}>
                <p className="font-bold mb-5" style={{ fontSize: "16px", color: "#1a1212" }}>Histogramme des commandes</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c49aaa" />
                        <stop offset="100%" stopColor="#e8cfd8" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e2" vertical={false} />
                    <XAxis dataKey="mois" tick={{ fontSize: 13, fill: "#5e4d4d", fontFamily: "DM Sans", fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 13, fill: "#5e4d4d", fontFamily: "DM Sans", fontWeight: 500 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ border: "1px solid #ede5df", borderRadius: 12, fontSize: 14, fontFamily: "DM Sans", backgroundColor: "#fff" }} labelStyle={{ color: "#1a1212", fontWeight: 700 }} itemStyle={{ color: "#9b6b7a", fontWeight: 600 }} />
                    <Bar dataKey="commandes" fill="url(#lg2)" radius={[6, 6, 0, 0]} name="Commandes" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </main>
      )}
    </>
  );
}
