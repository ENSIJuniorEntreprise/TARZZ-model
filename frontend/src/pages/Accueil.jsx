import { useState, useEffect } from "react";
import { ShoppingCart, XCircle, Clock, BarChart2, AlertTriangle, ArrowLeft, TrendingUp, Calendar, Award, Users, Package } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { dashboard as dashApi } from "../api";

const STATUS_STYLE = {
  "Livré":          { bg: "#f0fdf4", color: "#15803d" },
  "Livre":          { bg: "#f0fdf4", color: "#15803d" },
  "En cours":       { bg: "#fff7ed", color: "#c2410c" },
  "Non commencé":   { bg: "#fef2f2", color: "#b91c1c" },
  "Non commence":   { bg: "#fef2f2", color: "#b91c1c" },
};
const STATUS_DOT = {
  "Livré":        "#22c55e",
  "Livre":        "#22c55e",
  "En cours":     "#f59e0b",
  "Non commencé": "#ef4444",
  "Non commence": "#ef4444",
};

const salesData = [
  { mois:"Jan",ventes:18},{ mois:"Fév",ventes:25},{ mois:"Mar",ventes:32},
  { mois:"Avr",ventes:28},{ mois:"Mai",ventes:41},{ mois:"Juin",ventes:37},
  { mois:"Juil",ventes:50},{ mois:"Août",ventes:45},{ mois:"Sep",ventes:38},
  { mois:"Oct",ventes:55},{ mois:"Nov",ventes:62},{ mois:"Déc",ventes:70},
];

function Num({ value, style }) {
  return <span className="num" style={style}>{value}</span>;
}

export default function Accueil() {
  const [page,  setPage]  = useState("dashboard");
  const [data,  setData]  = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashApi.get()
      .then(setData)
      .catch(e => setError(e.message));
  }, []);

  const total    = salesData.reduce((s,d) => s + d.ventes, 0);
  const max      = Math.max(...salesData.map(d => d.ventes));
  const maxMonth = salesData.find(d => d.ventes === max)?.mois;
  const avg      = Math.round(total / salesData.length);

  const kpiConfig = [
    { label:"Produits en stock",      value: data?.totalProducts  ?? '—', icon: Package,       accent:"#9b6b7a" },
    { label:"Clients enregistrés",    value: data?.totalClients   ?? '—', icon: Users,         accent:"#5a9b7a" },
    { label:"Commandes livrées",      value: data?.delivered      ?? '—', icon: ShoppingCart,  accent:"#3b82f6" },
    { label:"Ruptures de stock",      value: data?.outOfStock     ?? '—', icon: XCircle,       accent:"#c06060" },
  ];

  return (
    <>
      {/* ══ DASHBOARD ══ */}
      {page === "dashboard" && (
        <main className="flex-1 p-8 bg-white">

          <div className="mb-8">
            <p className="font-sans-custom font-bold uppercase mb-2" style={{ fontSize:"11px", color:"#9b7a8a", letterSpacing:"0.20em" }}>
              Aperçu de la boutique
            </p>
            <div className="flex items-center justify-between">
              <h1 className="font-serif-custom font-bold" style={{ fontSize:"42px", color:"#1a1212", letterSpacing:"0.01em", lineHeight:1.1 }}>
                Hajtajeb Modèles
              </h1>
              <button onClick={() => setPage("stats")} className="btn-rose flex items-center gap-2.5 px-6 py-3 rounded-xl border-none font-sans-custom">
                <BarChart2 size={17} /> Statistiques des commandes
              </button>
            </div>
          </div>

          {error && <p className="font-sans-custom text-sm mb-4" style={{ color:'#b91c1c' }}>{error}</p>}

          {/* KPI */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {kpiConfig.map(({ label, value, icon: Icon, accent }) => (
              <div key={label} className="card-hover bg-white rounded-2xl p-5 border overflow-hidden relative" style={{ borderColor:"#ede5df" }}>
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-[0.07]" style={{ backgroundColor: accent }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor:`${accent}18`, color: accent }}>
                  <Icon size={19} />
                </div>
                <Num value={value} style={{ fontSize:"38px", fontWeight:700, color:"#1a1212", lineHeight:1, display:"block", marginBottom:6 }} />
                <p className="font-sans-custom font-semibold" style={{ fontSize:"13px", color:"#5e4d4d" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Stock value banner */}
          {data && (
            <div className="rounded-2xl p-5 mb-6 flex items-center gap-4 border" style={{ borderColor:"#ede5df", background:"linear-gradient(135deg,#fff,#fdf8fc)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor:"#9b6b7a18", color:"#9b6b7a" }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="font-sans-custom font-semibold" style={{ fontSize:"13px", color:"#7a6060" }}>Valeur totale du stock</p>
                <Num value={`${data.totalStockValue.toLocaleString('fr-TN', { minimumFractionDigits:0 })} DT`}
                     style={{ fontSize:"28px", fontWeight:700, color:"#1a1212" }} />
              </div>
              <div className="ml-auto flex gap-6">
                {[
                  { label:"Stock faible (≤3)", value: data.lowStock,    color:"#f59e0b" },
                  { label:"En cours",           value: data.inProgress,  color:"#3b82f6" },
                  { label:"Non commencées",     value: data.notStarted,  color:"#ef4444" },
                ].map(b => (
                  <div key={b.label} className="text-center">
                    <Num value={b.value} style={{ fontSize:"24px", fontWeight:700, color: b.color, display:"block" }} />
                    <p className="font-sans-custom" style={{ fontSize:"12px", color:"#7a6060", marginTop:2 }}>{b.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent purchases + Low stock */}
          <div className="grid grid-cols-2 gap-5">
            {/* Recent purchases */}
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor:"#ede5df" }}>
              <p className="font-sans-custom font-bold mb-5" style={{ fontSize:"16px", color:"#1a1212" }}>Derniers achats</p>
              {!data?.recentPurchases?.length ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <ShoppingCart size={36} strokeWidth={1} style={{ color:"#d4c5be" }} />
                  <p className="font-sans-custom font-medium" style={{ fontSize:"14px", color:"#9a8585" }}>Aucun achat pour l'instant</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {data.recentPurchases.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor:"#ede5df" }}>
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_DOT[p.status] || '#9a8585' }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans-custom font-semibold truncate" style={{ fontSize:"14px", color:"#1a1212" }}>
                          {p.first_name} {p.last_name}
                        </p>
                        <p className="font-sans-custom" style={{ fontSize:"12px", color:"#7a6060" }}>{p.date}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Num value={`${(p.amount||0).toFixed(2)} DT`} style={{ fontSize:"14px", fontWeight:700, color:"#1a1212" }} />
                        <span className="font-sans-custom font-semibold px-2 py-0.5 rounded-full" style={{ fontSize:"11px", backgroundColor: STATUS_STYLE[p.status]?.bg, color: STATUS_STYLE[p.status]?.color }}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Low stock */}
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor:"#ede5df" }}>
              <div className="flex items-center justify-between mb-5">
                <p className="font-sans-custom font-bold" style={{ fontSize:"16px", color:"#1a1212" }}>Alertes stock</p>
                <span className="flex items-center gap-1.5 font-sans-custom font-bold px-3 py-1 rounded-full" style={{ fontSize:"12px", backgroundColor:"#fef2f2", color:"#b91c1c" }}>
                  <AlertTriangle size={11} /> Attention
                </span>
              </div>
              {!data?.lowStockProducts?.length ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Package size={36} strokeWidth={1} style={{ color:"#d4c5be" }} />
                  <p className="font-sans-custom font-medium" style={{ fontSize:"14px", color:"#9a8585" }}>Aucune alerte</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {data.lowStockProducts.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor:"#ede5df" }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ backgroundColor:"#f4f4f5" }}>
                        {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <Package size={16} style={{ color:"#9b6b7a" }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans-custom font-semibold truncate" style={{ fontSize:"14px", color:"#1a1212" }}>{p.name}</p>
                        <p className="font-sans-custom" style={{ fontSize:"12px", color:"#7a6060" }}>{p.category_name}</p>
                      </div>
                      <span className="font-sans-custom font-bold px-2.5 py-1 rounded-full" style={{ fontSize:"13px", backgroundColor: p.stock === 0 ? "#fef2f2" : "#fff7ed", color: p.stock === 0 ? "#b91c1c" : "#c2410c" }}>
                        <Num value={p.stock} style={{ fontWeight:700 }} /> restants
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
        <main className="flex-1 p-8 bg-white">
          <div className="flex items-center gap-2 mb-7 font-sans-custom font-semibold" style={{ fontSize:"14px", color:"#7a6060" }}>
            <button onClick={() => setPage("dashboard")} className="flex items-center gap-1.5 border-none bg-transparent cursor-pointer font-sans-custom font-semibold" style={{ fontSize:"14px", color:"#9b6b7a" }}>
              <ArrowLeft size={14} /> Dashboard
            </button>
            <span style={{ color:"#c4b0aa" }}>/</span>
            <span>Statistiques</span>
          </div>

          <div className="mb-8">
            <h1 className="font-serif-custom font-bold mb-2" style={{ fontSize:"42px", color:"#1a1212", letterSpacing:"0.01em", lineHeight:1.1 }}>
              Statistiques des commandes
            </h1>
            <p className="font-sans-custom font-medium" style={{ fontSize:"15px", color:"#7a6060" }}>Évolution des ventes par mois — 2026</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label:"Total annuel",      value:total,    sub:"commandes",     icon:TrendingUp, accent:"#9b6b7a" },
              { label:"Meilleur mois",     value:maxMonth, sub:`${max} ventes`, icon:Award,      accent:"#5a9b7a" },
              { label:"Moyenne mensuelle", value:avg,      sub:"ventes / mois", icon:Calendar,   accent:"#c08a3a" },
            ].map(({ label, value, sub, icon: Icon, accent }) => (
              <div key={label} className="card-hover bg-white rounded-2xl p-6 border flex items-start gap-4 overflow-hidden relative" style={{ borderColor:"#ede5df" }}>
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-[0.07]" style={{ backgroundColor: accent }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor:`${accent}18`, color: accent }}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-sans-custom font-semibold mb-1" style={{ fontSize:"13px", color:"#7a6060" }}>{label}</p>
                  <Num value={value} style={{ fontSize:"38px", fontWeight:700, color:"#1a1212", lineHeight:1, display:"block" }} />
                  <p className="font-sans-custom font-medium mt-1.5" style={{ fontSize:"13px", color:"#9b7a8a" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 border mb-4" style={{ borderColor:"#ede5df" }}>
            <p className="font-sans-custom font-bold mb-5" style={{ fontSize:"16px", color:"#1a1212" }}>Courbe des ventes mensuelles</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={salesData} margin={{ top:5, right:20, left:0, bottom:5 }}>
                <defs><linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#9b6b7a"/><stop offset="100%" stopColor="#c49aaa"/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e2" />
                <XAxis dataKey="mois" tick={{ fontSize:13, fill:"#5e4d4d", fontFamily:"DM Sans", fontWeight:500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:13, fill:"#5e4d4d", fontFamily:"DM Sans", fontWeight:500 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border:"1px solid #ede5df", borderRadius:12, fontSize:14, fontFamily:"DM Sans", backgroundColor:"#fff", boxShadow:"0 4px 16px rgba(46,38,38,.10)" }} labelStyle={{ color:"#1a1212", fontWeight:700 }} itemStyle={{ color:"#9b6b7a", fontWeight:600 }} />
                <Line type="monotone" dataKey="ventes" stroke="url(#lg1)" strokeWidth={3} dot={{ fill:"#9b6b7a", r:5, strokeWidth:0 }} activeDot={{ r:7, fill:"#7a4d5d", strokeWidth:0 }} name="Ventes" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 border" style={{ borderColor:"#ede5df" }}>
            <p className="font-sans-custom font-bold mb-5" style={{ fontSize:"16px", color:"#1a1212" }}>Histogramme des ventes par mois</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesData} margin={{ top:5, right:20, left:0, bottom:5 }}>
                <defs><linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c49aaa"/><stop offset="100%" stopColor="#e8cfd8"/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e2" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize:13, fill:"#5e4d4d", fontFamily:"DM Sans", fontWeight:500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:13, fill:"#5e4d4d", fontFamily:"DM Sans", fontWeight:500 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border:"1px solid #ede5df", borderRadius:12, fontSize:14, fontFamily:"DM Sans", backgroundColor:"#fff", boxShadow:"0 4px 16px rgba(46,38,38,.10)" }} labelStyle={{ color:"#1a1212", fontWeight:700 }} itemStyle={{ color:"#9b6b7a", fontWeight:600 }} />
                <Bar dataKey="ventes" fill="url(#lg2)" radius={[6,6,0,0]} name="Ventes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </main>
      )}
    </>
  );
}
