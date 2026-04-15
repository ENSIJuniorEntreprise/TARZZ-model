import { useState } from "react";
import {
  LayoutGrid, List, Package, Users, LogOut, Settings,
  ShoppingCart, XCircle, Clock, BarChart2, AlertTriangle, ArrowLeft,
  TrendingUp, Calendar, Award
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const salesData = [
  { mois: "Jan", ventes: 18 },
  { mois: "Fév", ventes: 25 },
  { mois: "Mar", ventes: 32 },
  { mois: "Avr", ventes: 28 },
  { mois: "Mai", ventes: 41 },
  { mois: "Juin", ventes: 37 },
  { mois: "Juil", ventes: 50 },
  { mois: "Août", ventes: 45 },
  { mois: "Sep", ventes: 38 },
  { mois: "Oct", ventes: 55 },
  { mois: "Nov", ventes: 62 },
  { mois: "Déc", ventes: 70 },
];

const recentOrders = []

const lowStock = [];

const statusStyle = {
  "En cours":       { bg: "#fff7ed", color: "#c2410c" },
  "Livré":          { bg: "#f0fdf4", color: "#15803d" },
  "Non commencé":   { bg: "#fef2f2", color: "#b91c1c" },
};

const navItems = [
  { label: "Dashboard",           icon: LayoutGrid, key: "dashboard",  file: "Accueil.jsx" },
  { label: "Catégories et Stock", icon: List,        key: "categories", file: "ProduitsCategories.jsx" },
  { label: "Clients",             icon: Users,       key: "clients",    file: "Clients.jsx" },
];

export default function HajtajebDashboard() {
  const [page, setPage]           = useState("dashboard");
  const [activeNav, setActiveNav] = useState("dashboard");

  const total    = salesData.reduce((s, d) => s + d.ventes, 0);
  const max      = Math.max(...salesData.map((d) => d.ventes));
  const maxMonth = salesData.find((d) => d.ventes === max)?.mois;
  const avg      = Math.round(total / salesData.length);

  const handleNavClick = (key, file) => {
    setActiveNav(key);
    if (key === "dashboard") {
      setPage("dashboard");
    } else {
      window.location.href = file;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#faf7f4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .font-serif-custom { font-family: 'Cormorant Garamond', serif; }
        .font-sans-custom  { font-family: 'DM Sans', sans-serif; }
        .muted { color: #8a7878; }

        .nav-item { transition: background-color 0.18s, color 0.18s; font-family: 'DM Sans', sans-serif; }
        .nav-item:hover { background-color: #f2ece4; color: #2e2626; }
        .nav-item.active { background-color: #9b6b7a; color: #ffffff; }

        .btn-rose { background-color: #9b6b7a; color: #ffffff; transition: background-color 0.18s, transform 0.15s; }
        .btn-rose:hover { background-color: #7a4d5d; transform: translateY(-1px); }

        .btn-logout:hover { background-color: #fdf0f0; color: #b34343; }
        .icon-btn-hover:hover { background-color: #f2ece4; }

        .card-hover { transition: box-shadow 0.2s, transform 0.18s, border-color 0.2s; }
        .card-hover:hover { box-shadow: 0 8px 28px rgba(155,107,122,0.13); transform: translateY(-2px); border-color: #c49aaa; }

        input { border: 1.5px solid #e0d5cf; background-color: #f2ece4; color: #2e2626; font-family: 'DM Sans', sans-serif; }
        input::placeholder { color: #8a7878; opacity: 0.7; }
        input:focus { border-color: #9b6b7a !important; box-shadow: 0 0 0 3px rgba(155,107,122,0.12) !important; background-color: #ffffff !important; outline: none; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className="fixed left-0 top-0 w-56 h-screen bg-white border-r flex flex-col" style={{ borderColor: "#e0d5cf" }}>
        <div className="px-5 py-6 border-b" style={{ borderColor: "#e0d5cf" }}>
          <div className="font-serif-custom text-2xl font-bold mb-0.5" style={{ color: "#2e2626", letterSpacing: "0.03em" }}>
            HAJTAJEB<span style={{ color: "#9b6b7a" }}> Model</span>
          </div>
          <div className="text-xs muted font-sans-custom" style={{ letterSpacing: "0.12em" }}>
            Tapis &amp; Kilim · Jewelry · Modèles
          </div>
        </div>

        <div className="px-5 py-5 text-xs font-medium muted font-sans-custom" style={{ letterSpacing: "0.14em" }}>
          Gestion Interne
        </div>

        <nav className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, key, file }) => (
            <button
              key={key}
              onClick={() => handleNavClick(key, file)}
              className={`nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm border-none bg-transparent ${activeNav === key ? "active font-medium" : "muted"}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="border-t p-3" style={{ borderColor: "#e0d5cf" }}>
          <button className="btn-logout flex items-center gap-2.5 px-3 py-2.5 w-full text-sm muted rounded-lg border-none bg-transparent font-sans-custom">
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="ml-56 flex-1 flex flex-col min-h-screen">

        {/* TOPBAR — barre de recherche supprimée */}
        <header className="h-16 bg-white border-b sticky top-0 z-50 flex items-center gap-4 px-8" style={{ borderColor: "#e0d5cf" }}>
          <div className="flex items-center gap-1 ml-auto">
            <button className="icon-btn-hover w-9 h-9 rounded-full flex items-center justify-center muted border-none bg-transparent">
              <Settings size={17} />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold font-serif-custom ml-1.5"
              style={{ backgroundColor: "#9b6b7a", border: "2px solid #c49aaa" }}>
              HM
            </div>
          </div>
        </header>

        {/* ══ DASHBOARD PAGE ══ */}
        {page === "dashboard" && (
          <main className="flex-1 p-9" style={{ backgroundColor: "#ffffff" }}>
            <div className="text-xs muted font-sans-custom mb-1">Aperçu de la boutique</div>
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-serif-custom text-4xl font-bold" style={{ color: "#2e2626", letterSpacing: "0.01em" }}>
                HAJTAEB MODELES
              </h1>
              <button onClick={() => setPage("stats")} className="btn-rose flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border-none font-sans-custom">
                <BarChart2 size={16} />
                Statistique des commandes
              </button>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: "Clients",                   value: 4,  icon: Users },
                { label: "Commande livré",            value: 50, icon: ShoppingCart },
                { label: "Commande non commencé",     value: 4,  icon: XCircle },
                { label: "Commande en cours",         value: 4,  icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="card-hover bg-white rounded-2xl p-5 border"
                  style={{ borderColor: "#e0d5cf" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#f2ece4", color: "#9b6b7a" }}>
                      <Icon size={16} />
                    </div>
                    <p className="text-xs muted font-sans-custom leading-tight">{label}</p>
                  </div>
                  <p className="font-serif-custom text-3xl font-bold" style={{ color: "#2e2626" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Recent orders */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium font-sans-custom" style={{ color: "#2e2626" }}>Derniers achats</p>
                  <button className="text-xs font-sans-custom border-none bg-transparent cursor-pointer" style={{ color: "#9b6b7a" }}>
                    Voir tout l'inventaire
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {recentOrders.map((order, i) => (
                    <div key={i} className="card-hover bg-white rounded-2xl p-4 flex items-center gap-3 border" style={{ borderColor: "#e0d5cf" }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#f2ece4", color: "#9b6b7a" }}>
                        <ShoppingCart size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium font-sans-custom truncate" style={{ color: "#2e2626" }}>{order.name}</p>
                        <p className="text-xs muted font-sans-custom">{order.date}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-sm font-medium font-sans-custom" style={{ color: "#2e2626" }}>{order.amount}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium font-sans-custom"
                          style={{ backgroundColor: statusStyle[order.status].bg, color: statusStyle[order.status].color }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low stock */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium font-sans-custom" style={{ color: "#2e2626" }}>Alertes stocks faibles</p>
                  <span className="flex items-center gap-1 text-xs font-medium font-sans-custom px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}>
                    <AlertTriangle size={11} /> Attention
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {lowStock.map((item, i) => (
                    <div key={i} className="card-hover bg-white rounded-2xl p-4 flex items-start gap-3 border" style={{ borderColor: "#e0d5cf" }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#f2ece4", color: "#9b6b7a" }}>
                        <Package size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium font-sans-custom" style={{ color: "#2e2626" }}>{item.name}</p>
                        <p className="text-xs muted font-sans-custom mt-0.5">{item.note}</p>
                        <p className="text-xs font-medium font-sans-custom mt-1 uppercase" style={{ color: "#9b6b7a", letterSpacing: "0.07em" }}>{item.action}</p>
                      </div>
                      <span className="text-xs muted font-sans-custom flex-shrink-0">{item.qty} restants</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ══ STATS PAGE ══ */}
        {page === "stats" && (
          <main className="flex-1 p-9" style={{ backgroundColor: "#fffff" }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs muted font-sans-custom mb-7">
              <button onClick={() => setPage("dashboard")}
                className="flex items-center gap-1 border-none bg-transparent cursor-pointer font-sans-custom"
                style={{ color: "#9b6b7a" }}>
                <ArrowLeft size={13} /> Dashboard
              </button>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span>Statistiques</span>
            </div>

            <h1 className="font-serif-custom text-4xl font-bold mb-1" style={{ color: "#2e2626", letterSpacing: "0.01em" }}>
              Statistiques des commandes
            </h1>
            <p className="text-sm muted font-sans-custom mb-8">Évolution des ventes par mois — 2026</p>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total annuel",       value: total,    sub: "commandes",    icon: TrendingUp },
                { label: "Meilleur mois",      value: maxMonth, sub: `${max} ventes`, icon: Award },
                { label: "Moyenne mensuelle",  value: avg,      sub: "ventes / mois", icon: Calendar },
              ].map(({ label, value, sub, icon: Icon }) => (
                <div key={label} className="card-hover bg-white rounded-2xl p-5 border flex items-start gap-4" style={{ borderColor: "#e0d5cf" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#f2ece4", color: "#9b6b7a" }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs muted font-sans-custom mb-1">{label}</p>
                    <p className="font-serif-custom text-3xl font-bold" style={{ color: "#2e2626" }}>{value}</p>
                    <p className="text-xs muted font-sans-custom mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Line chart */}
            <div className="bg-white rounded-2xl p-6 border mb-5" style={{ borderColor: "#e0d5cf" }}>
              <p className="text-sm font-medium font-sans-custom mb-5" style={{ color: "#2e2626" }}>Courbe des ventes mensuelles</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f2ece4" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#8a7878", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#8a7878", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ border: "1.5px solid #e0d5cf", borderRadius: 12, fontSize: 13, fontFamily: "DM Sans", backgroundColor: "#fff" }}
                    labelStyle={{ color: "#2e2626", fontWeight: 500 }}
                    itemStyle={{ color: "#9b6b7a" }}
                  />
                  <Line type="monotone" dataKey="ventes" stroke="#9b6b7a" strokeWidth={2.5}
                    dot={{ fill: "#9b6b7a", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#7a4d5d" }} name="Ventes" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#e0d5cf" }}>
              <p className="text-sm font-medium font-sans-custom mb-5" style={{ color: "#2e2626" }}>Histogramme des ventes par mois</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f2ece4" vertical={false} />
                  <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#8a7878", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#8a7878", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ border: "1.5px solid #e0d5cf", borderRadius: 12, fontSize: 13, fontFamily: "DM Sans", backgroundColor: "#fff" }}
                    labelStyle={{ color: "#2e2626", fontWeight: 500 }}
                    itemStyle={{ color: "#9b6b7a" }}
                  />
                  <Bar dataKey="ventes" fill="#c49aaa" radius={[6, 6, 0, 0]} name="Ventes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}