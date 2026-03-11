import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

import RegisterType from '../pages/auth/RegisterType'
import Register from '../pages/auth/Register'
import Login from '../pages/auth/Login'
import ClientDashboard from '../pages/client/ClientDashboard'
import ClientProfile from '../pages/client/ClientProfile'
import SearchPage from '../pages/client/SearchPage'
import MapPage from '../pages/client/MapPage'
import ProviderDetail from '../pages/client/ProviderDetail'
import ProviderDashboard from '../pages/provider/ProviderDashboard'
import ProviderProfile from '../pages/provider/ProviderProfile'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/" replace />
}

function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return children
  return <Navigate to={user?.type === 'provider' ? '/prestataire' : '/client'} replace />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<GuestRoute><RegisterType /></GuestRoute>} />
        <Route path="/inscription/:type" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/connexion" element={<GuestRoute><Login /></GuestRoute>} />

        {/* Client */}
        <Route path="/client" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
        <Route path="/client/profil" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
        <Route path="/client/recherche" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/client/carte" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/client/prestataire/:id" element={<ProtectedRoute><ProviderDetail /></ProtectedRoute>} />

        {/* Prestataire */}
        <Route path="/prestataire" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
        <Route path="/prestataire/profil" element={<ProtectedRoute><ProviderProfile /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
