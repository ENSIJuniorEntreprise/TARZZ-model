import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, List, Users, LogOut, Images } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: "Dashboard",           icon: LayoutGrid, to: "/" },
  { label: "Catégories & Stock",  icon: List,        to: "/produits" },
  { label: "Clients",             icon: Users,       to: "/clients" },
]

const Sidebar = () => {
  const { logout } = useAuth()
  const navigate   = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className="fixed left-0 top-0 w-56 h-screen flex flex-col"
      style={{ backgroundColor: "#ffffff", borderRight: "1px solid #ede5df" }}
    >
      {/* Logo */}
      <div className="px-5 pt-7 pb-5">
        <div
          className="font-serif-custom font-bold leading-tight"
          style={{ fontSize: "22px", color: "#1a1212", letterSpacing: "0.02em" }}
        >
          HAJTAJEB
          <span style={{ color: "#9b6b7a" }}> Model</span>
        </div>
        <div
          className="font-sans-custom mt-1.5 font-medium"
          style={{ fontSize: "11px", color: "#7a6060", letterSpacing: "0.12em" }}
        >
          Tapis · Bijoux · Modèles
        </div>
        <div
          className="mt-4 rounded-full"
          style={{ height: "2px", width: "36px", background: "linear-gradient(90deg, #9b6b7a, #c49aaa)" }}
        />
      </div>

      {/* Section label */}
      <div
        className="px-5 pb-2 font-sans-custom font-bold uppercase"
        style={{ fontSize: "10px", letterSpacing: "0.20em", color: "#9b8095" }}
      >
        Gestion Interne
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto py-1">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `nav-item gap-3 px-3 py-2.5 rounded-xl ${isActive ? "active" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                  style={{
                    backgroundColor: isActive ? "rgba(255,255,255,0.22)" : "#f4f4f5",
                    color: isActive ? "#ffffff" : "#9b6b7a",
                    transition: "background-color 0.2s",
                  }}
                >
                  <Icon size={15} />
                </span>
                <span style={{ color: isActive ? "#ffffff" : "#2e1e1e" }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Espace isolé */}
      <div className="px-3 pb-3" style={{ borderTop: "1px solid #ede5df" }}>
        <div
          className="mt-3 mb-1 px-2 font-sans-custom font-bold uppercase"
          style={{ fontSize: "10px", letterSpacing: "0.20em", color: "#9b8095" }}
        >
          Espace
        </div>
        <NavLink
          to="/espace"
          className={({ isActive }) =>
            `nav-item gap-3 px-3 py-2.5 rounded-xl ${isActive ? "active" : ""}`
          }
          style={({ isActive }) => ({
            background: isActive ? "linear-gradient(135deg,#9B6B9A,#C9B8D8)" : undefined,
          })}
        >
          {({ isActive }) => (
            <>
              <span
                className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: isActive ? "rgba(255,255,255,0.22)" : "#F0EAF7",
                  color: isActive ? "#ffffff" : "#9B6B9A",
                  transition: "background-color 0.2s",
                }}
              >
                <Images size={15} />
              </span>
              <span style={{ color: isActive ? "#ffffff" : "#2e1e1e" }}>Espace</span>
            </>
          )}
        </NavLink>
      </div>

      {/* Footer / Logout */}
      <div className="px-3 pb-4 pt-2" style={{ borderTop: "1px solid #ede5df" }}>
        <button
          onClick={handleLogout}
          className="btn-logout flex items-center gap-3 px-3 py-2.5 w-full border-none bg-transparent font-sans-custom font-medium"
          style={{ color: "#6b4040", fontSize: "14px" }}
        >
          <span
            className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
            style={{ backgroundColor: "#f4f4f5", color: "#c49aaa" }}
          >
            <LogOut size={15} />
          </span>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
