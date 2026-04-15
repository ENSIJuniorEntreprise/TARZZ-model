import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#faf7f4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .font-serif-custom { font-family: 'Cormorant Garamond', serif; }
        .font-sans-custom  { font-family: 'DM Sans', sans-serif; }
        .muted { color: #8a7878; }

        .nav-item { transition: background-color 0.18s, color 0.18s; font-family: 'DM Sans', sans-serif; text-decoration: none; display: flex; align-items: center; }
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
      <Sidebar />
      <div className="ml-56 flex-1 flex flex-col min-h-screen">
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
