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

const recentOrders = [];
const lowStock = [];

const statusStyle = {
  "En cours":     { bg: "#fff7ed", color: "#c2410c" },
  "Livré":        { bg: "#f0fdf4", color: "#15803d" },
  "Non commencé": { bg: "#fef2f2", color: "#b91c1c" },
};

const navItems = [
  { label: "Dashboard",           icon: LayoutGrid, key: "dashboard",  file: "Accueil.jsx" },
  { label: "Catégories et Stock", icon: List,        key: "categories", file: "ProduitsCategories.jsx" },
  { label: "Clients",             icon: Users,       key: "clients",    file: "Clients.jsx" },
];

export default function HajtajebDashboard() {
  const [page, setPage]       = useState("dashboard");
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');

        .font-serif-custom { font-family: 'Cormorant Garamond', serif; }
        .font-sans-custom  { font-family: 'DM Sans', sans-serif; }
        .muted { color: #8a7878; }

        /* ── Sidebar ── */
        .sidebar {
          width: 200px;
          min-width: 200px;
          background: #ffffff;
          border-right: 1px solid #e0d5cf;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0; top: 0;
          height: 100vh;
          z-index: 100;
        }
        .sidebar-logo {
          padding: 22px 20px 18px;
          border-bottom: 1px solid #e0d5cf;
        }
        .sidebar-logo-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 700;
          color: #2e2626;
          letter-spacing: 0.04em;
          line-height: 1.1;
          text-transform: uppercase;
        }
        .sidebar-logo-title span { color: #9b6b7a; }
        .sidebar-logo-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: #8a7878;
          letter-spacing: 0.1em;
          margin-top: 3px;
        }
        .sidebar-section-label {
          padding: 16px 20px 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          color: #8a7878;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 10px;
          overflow-y: auto;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #8a7878;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background-color 0.18s, color 0.18s;
          text-align: left;
        }
        .nav-item:hover { background-color: #f2ece4; color: #2e2626; }
        .nav-item.active { background-color: #9b6b7a; color: #ffffff; font-weight: 500; }
        .nav-item svg { flex-shrink: 0; }

        .sidebar-footer {
          border-top: 1px solid #e0d5cf;
          padding: 10px;
        }
        .btn-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #8a7878;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.18s, color 0.18s;
        }
        .btn-logout:hover { background-color: #fdf0f0; color: #b34343; }

        /* ── Main layout ── */
        .main-wrapper {
          margin-left: 200px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .topbar {
          height: 56px;
          background: #ffffff;
          border-bottom: 1px solid #e0d5cf;
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          padding: 0 32px;
        }
        .topbar-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .icon-btn {
          width: 34px; height: 34px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #8a7878;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background-color 0.18s;
        }
        .icon-btn:hover { background-color: #f2ece4; }
        .avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background-color: #9b6b7a;
          border: 2px solid #c49aaa;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          margin-left: 4px;
        }

        /* ── Page content ── */
        .page-content {
          flex: 1;
          padding: 36px;
          background: #ffffff;
        }
        .page-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #8a7878;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }
        .page-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 34px;
          font-weight: 700;
          color: #2e2626;
          letter-spacing: 0.02em;
        }
        .btn-rose {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          background: #9b6b7a;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.18s, transform 0.15s;
        }
        .btn-rose:hover { background-color: #7a4d5d; transform: translateY(-1px); }

        /* ── KPI grid ── */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }
        .kpi-card {
          background: #ffffff;
          border: 1px solid #e0d5cf;
          border-radius: 16px;
          padding: 18px;
          transition: box-shadow 0.2s, transform 0.18s, border-color 0.2s;
        }
        .kpi-card:hover {
          box-shadow: 0 8px 28px rgba(155,107,122,0.13);
          transform: translateY(-2px);
          border-color: #c49aaa;
        }
        .kpi-icon-wrap {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: #f2ece4;
          color: #9b6b7a;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 10px;
        }
        .kpi-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #8a7878;
          line-height: 1.35;
          margin-bottom: 8px;
        }
        .kpi-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 700;
          color: #2e2626;
        }

        /* ── Bottom grid ── */
        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #2e2626;
        }
        .link-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #9b6b7a;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .badge-danger {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: #b91c1c;
          background: #fef2f2;
          padding: 2px 8px;
          border-radius: 99px;
        }

        /* ── List cards ── */
        .list-card {
          background: #ffffff;
          border: 1px solid #e0d5cf;
          border-radius: 16px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
          transition: box-shadow 0.2s, transform 0.18s, border-color 0.2s;
        }
        .list-card:hover {
          box-shadow: 0 8px 28px rgba(155,107,122,0.13);
          transform: translateY(-2px);
          border-color: #c49aaa;
        }
        .list-card-icon {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: #f2ece4;
          color: #9b6b7a;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ── Stats page ── */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: #8a7878;
          margin-bottom: 24px;
        }
        .breadcrumb-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #9b6b7a;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .summary-card {
          background: #ffffff;
          border: 1px solid #e0d5cf;
          border-radius: 16px;
          padding: 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: box-shadow 0.2s, transform 0.18s, border-color 0.2s;
        }
        .summary-card:hover {
          box-shadow: 0 8px 28px rgba(155,107,122,0.13);
          transform: translateY(-2px);
          border-color: #c49aaa;
        }
        .summary-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: #f2ece4;
          color: #9b6b7a;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .chart-card {
          background: #ffffff;
          border: 1px solid #e0d5cf;
          border-radius: 16px;
          padding: 22px;
          margin-bottom: 16px;
        }
        .chart-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #2e2626;
          margin-bottom: 18px;
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-title">
            HAJTAIEB<span> Model</span>
          </div>
          <div className="sidebar-logo-sub">Tapis &amp; Kilim · Jewelry · Modèles</div>
        </div>

        <div className="sidebar-section-label">Gestion Interne</div>

        <nav className="sidebar-nav">
          {navItems.map(({ label, icon: Icon, key, file }) => (
            <button
              key={key}
              onClick={() => handleNavClick(key, file)}
              className={`nav-item${activeNav === key ? " active" : ""}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout">
            <LogOut size={15} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="main-wrapper">

        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-right">
            <button className="icon-btn"><Settings size={16} /></button>
            <div className="avatar">HM</div>
          </div>
        </header>

        {/* ══ DASHBOARD PAGE ══ */}
        {page === "dashboard" && (
          <main className="page-content">
            <div className="page-eyebrow">Aperçu de la boutique</div>
            <div className="page-header-row">
              <h1 className="page-title">HAJTAEB MODELES</h1>
              <button onClick={() => setPage("stats")} className="btn-rose">
                <BarChart2 size={15} />
                Statistique des commandes
              </button>
            </div>

            {/* KPI */}
            <div className="kpi-grid">
              {[
                { label: "Clients",                   value: 4,  icon: Users },
                { label: "Commande livré",            value: 50, icon: ShoppingCart },
                { label: "Commande non commencé",     value: 4,  icon: XCircle },
                { label: "Commande en cours",         value: 4,  icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="kpi-card">
                  <div className="kpi-icon-wrap"><Icon size={15} /></div>
                  <p className="kpi-label">{label}</p>
                  <p className="kpi-value">{value}</p>
                </div>
              ))}
            </div>

            {/* Bottom grid */}
            <div className="bottom-grid">
              {/* Recent orders */}
              <div>
                <div className="section-header">
                  <p className="section-title">Derniers achats</p>
                  <button className="link-btn">Voir tout l'inventaire</button>
                </div>
                <div>
                  {recentOrders.map((order, i) => (
                    <div key={i} className="list-card">
                      <div className="list-card-icon"><ShoppingCart size={16} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#2e2626", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.name}</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#8a7878" }}>{order.date}</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#2e2626" }}>{order.amount}</p>
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", backgroundColor: statusStyle[order.status]?.bg, color: statusStyle[order.status]?.color }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low stock */}
              <div>
                <div className="section-header">
                  <p className="section-title">Alertes stocks faibles</p>
                  <span className="badge-danger"><AlertTriangle size={10} /> Attention</span>
                </div>
                <div>
                  {lowStock.map((item, i) => (
                    <div key={i} className="list-card" style={{ alignItems: "flex-start" }}>
                      <div className="list-card-icon" style={{ borderRadius: 8 }}><Package size={16} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#2e2626" }}>{item.name}</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#8a7878", marginTop: 2 }}>{item.note}</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: "#9b6b7a", marginTop: 4, letterSpacing: "0.07em", textTransform: "uppercase" }}>{item.action}</p>
                      </div>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#8a7878", flexShrink: 0 }}>{item.qty} restants</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ══ STATS PAGE ══ */}
        {page === "stats" && (
          <main className="page-content">
            <div className="breadcrumb">
              <button onClick={() => setPage("dashboard")} className="breadcrumb-link">
                <ArrowLeft size={12} /> Dashboard
              </button>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span>Statistiques</span>
            </div>

            <h1 className="page-title" style={{ marginBottom: 4 }}>Statistiques des commandes</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#8a7878", marginBottom: 24 }}>Évolution des ventes par mois — 2026</p>

            <div className="summary-grid">
              {[
                { label: "Total annuel",      value: total,    sub: "commandes",    icon: TrendingUp },
                { label: "Meilleur mois",     value: maxMonth, sub: `${max} ventes`, icon: Award },
                { label: "Moyenne mensuelle", value: avg,      sub: "ventes / mois", icon: Calendar },
              ].map(({ label, value, sub, icon: Icon }) => (
                <div key={label} className="summary-card">
                  <div className="summary-icon"><Icon size={18} /></div>
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#8a7878", marginBottom: 4 }}>{label}</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "#2e2626" }}>{value}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#8a7878", marginTop: 2 }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="chart-card">
              <p className="chart-title">Courbe des ventes mensuelles</p>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f2ece4" />
                  <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#8a7878", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#8a7878", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ border: "1.5px solid #e0d5cf", borderRadius: 10, fontSize: 12, fontFamily: "DM Sans", backgroundColor: "#fff" }}
                    labelStyle={{ color: "#2e2626", fontWeight: 500 }}
                    itemStyle={{ color: "#9b6b7a" }}
                  />
                  <Line type="monotone" dataKey="ventes" stroke="#9b6b7a" strokeWidth={2.5}
                    dot={{ fill: "#9b6b7a", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#7a4d5d" }} name="Ventes" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card" style={{ marginBottom: 0 }}>
              <p className="chart-title">Histogramme des ventes par mois</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f2ece4" vertical={false} />
                  <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#8a7878", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#8a7878", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ border: "1.5px solid #e0d5cf", borderRadius: 10, fontSize: 12, fontFamily: "DM Sans", backgroundColor: "#fff" }}
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