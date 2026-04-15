import { NavLink } from 'react-router-dom'
import { LayoutGrid, List, Users, LogOut } from 'lucide-react'

const navItems = [
  { label: "Dashboard",           icon: LayoutGrid, to: "/" },
  { label: "Catégories et Stock", icon: List,        to: "/produits" },
  { label: "Clients",             icon: Users,       to: "/clients" },
]

const Sidebar = () => {
  return (
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
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `nav-item gap-2.5 px-3 py-2.5 rounded-lg text-sm border-none bg-transparent ${isActive ? "active font-medium" : "muted"}`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-3" style={{ borderColor: "#e0d5cf" }}>
        <button className="btn-logout flex items-center gap-2.5 px-3 py-2.5 w-full text-sm muted rounded-lg border-none bg-transparent font-sans-custom">
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
