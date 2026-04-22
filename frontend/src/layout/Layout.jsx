import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#ffffff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-size: 15px;
        }

        ::selection { background: rgba(155,107,122,0.18); color: #2e2626; }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d4c5be; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #b89aaa; }

        .font-serif-custom { font-family: 'Cormorant Garamond', serif; font-variant-numeric: lining-nums; }
        .font-sans-custom  { font-family: 'DM Sans', sans-serif; }
        /* Les chiffres utilisent toujours DM Sans — plus lisible */
        .num { font-family: 'DM Sans', sans-serif; font-variant-numeric: tabular-nums; }

        /* muted = texte secondaire mais toujours lisible */
        .muted { color: #5e4d4d; }

        /* ── Sidebar nav ── */
        .nav-item {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          display: flex;
          align-items: center;
          transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
          position: relative;
        }
        .nav-item:hover { background-color: #f4f4f5; color: #1a1212; }
        .nav-item.active {
          background: linear-gradient(90deg, #9b6b7a 0%, #b5828f 100%);
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(155,107,122,0.30);
        }

        /* ── Buttons ── */
        .btn-rose {
          background: linear-gradient(135deg, #9b6b7a 0%, #b07585 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(155,107,122,0.28);
        }
        .btn-rose:hover {
          background: linear-gradient(135deg, #7a4d5d 0%, #9b6b7a 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(155,107,122,0.38);
        }

        .btn-logout { transition: background-color 0.18s, color 0.18s; border-radius: 8px; }
        .btn-logout:hover { background-color: #fdf0f0; color: #b34343; }
        .icon-btn-hover { transition: background-color 0.18s; }
        .icon-btn-hover:hover { background-color: #f4f4f5; }

        /* ── Cards ── */
        .card-hover { transition: box-shadow 0.25s, transform 0.2s, border-color 0.25s; }
        .card-hover:hover {
          box-shadow: 0 10px 32px rgba(155,107,122,0.14);
          transform: translateY(-3px);
          border-color: #c49aaa !important;
        }

        /* ── Inputs ── */
        input, select, textarea {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #1a1212;
          transition: border-color 0.18s, box-shadow 0.18s, background-color 0.18s;
        }
        input::placeholder, textarea::placeholder { color: #9a8585; opacity: 0.8; font-size: 14px; }
        input:focus, select:focus, textarea:focus {
          border-color: #9b6b7a !important;
          box-shadow: 0 0 0 3px rgba(155,107,122,0.14) !important;
          background-color: #ffffff !important;
          outline: none;
        }
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
