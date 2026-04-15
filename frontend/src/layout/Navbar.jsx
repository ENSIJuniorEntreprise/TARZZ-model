import { Settings } from 'lucide-react'

const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b sticky top-0 z-50 flex items-center gap-4 px-8" style={{ borderColor: "#e0d5cf" }}>
      <div className="flex items-center gap-1 ml-auto">
        <button className="icon-btn-hover w-9 h-9 rounded-full flex items-center justify-center muted border-none bg-transparent">
          <Settings size={17} />
        </button>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold font-serif-custom ml-1.5"
          style={{ backgroundColor: "#9b6b7a", border: "2px solid #c49aaa" }}
        >
          HM
        </div>
      </div>
    </header>
  )
}

export default Navbar
