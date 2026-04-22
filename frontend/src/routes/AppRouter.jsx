import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../layout/Layout'
import Accueil from '../pages/Accueil'
import ProduitsCategories from '../pages/categoriesetproduit'
import Clients from '../pages/Clients'
import Login from '../pages/Login'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff' }}>
      <div style={{ color: '#9b6b7a', fontFamily: 'DM Sans, sans-serif', fontSize: 15 }}>Chargement…</div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/" replace /> : children
}

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index            element={<Accueil />} />
        <Route path="produits"  element={<ProduitsCategories />} />
        <Route path="clients"   element={<Clients />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
)

export default AppRouter
