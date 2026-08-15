import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../layout/Layout'
import Login from '../pages/Login'

const Accueil = lazy(() => import('../pages/Accueil'))
const ProduitsCategories = lazy(() => import('../pages/categoriesetproduit'))
const Clients = lazy(() => import('../pages/Clients'))
const ClientDetail = lazy(() => import('../pages/ClientDetail'))
const Fournisseurs = lazy(() => import('../pages/Fournisseurs'))
const FournisseurDetail = lazy(() => import('../pages/FournisseurDetail'))
const Espace = lazy(() => import('../pages/Espace'))

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff' }}>
    <div style={{ color: '#9b6b7a', fontFamily: 'DM Sans, sans-serif', fontSize: 15 }}>Chargement…</div>
  </div>
)

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
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index            element={<Accueil />} />
          <Route path="produits"         element={<ProduitsCategories />} />
          <Route path="clients"          element={<Clients />} />
          <Route path="clients/:id"      element={<ClientDetail />} />
          <Route path="fournisseurs"     element={<Fournisseurs />} />
          <Route path="fournisseurs/:id" element={<FournisseurDetail />} />
          <Route path="espace"           element={<Espace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
)

export default AppRouter
