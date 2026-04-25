import { Settings, Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/':         'Tableau de bord',
  '/produits': 'Catégories & Stock',
  '/clients':  'Clients',
}

const Navbar = () => {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? ''

  return (
    <header
      className="h-16 bg-white sticky top-0 z-50 flex items-center px-8"
      style={{
        borderBottom: "1px solid #ede5df",
        boxShadow: "0 1px 12px rgba(46,38,38,0.05)",
      }}
    >
      {/* Page title */}
      <span
        className="font-sans-custom font-bold"
        style={{ fontSize: "17px", color: "#1a1212", letterSpacing: "0.005em" }}
      >
        {title}
      </span>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          className="icon-btn-hover w-9 h-9 rounded-full flex items-center justify-center border-none bg-transparent"
          style={{ color: "#5e4d4d" }}
          title="Notifications"
        >
          <Bell size={18} />
        </button>
        <button
          className="icon-btn-hover w-9 h-9 rounded-full flex items-center justify-center border-none bg-transparent"
          style={{ color: "#5e4d4d" }}
          title="Paramètres"
        >
          <Settings size={18} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1.5" style={{ backgroundColor: "#ede5df" }} />

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold font-serif-custom cursor-pointer"
          style={{
            fontSize: "13px",
            background: "linear-gradient(135deg, #9b6b7a 0%, #c49aaa 100%)",
            boxShadow: "0 2px 8px rgba(155,107,122,0.35)",
            letterSpacing: "0.06em",
          }}
          title="Mon compte"
        >
          HM
        </div>
      </div>
    </header>
  )
}

export default Navbar
