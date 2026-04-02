import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '../layout/Layout'
import Accueil from '../pages/Accueil'
import ProduitsCategories from '../pages/ProduitsCategories'
import Clients from '../pages/Clients'
import Login from '../pages/Login'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Accueil />} />
          <Route path="produits" element={<ProduitsCategories />} />
          <Route path="clients" element={<Clients />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
