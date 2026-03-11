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
import BookingPage from '../pages/client/BookingPage'
import BookingsPage from '../pages/client/BookingsPage'
import ProviderDashboard from '../pages/provider/ProviderDashboard'
import ProviderProfile from '../pages/provider/ProviderProfile'
import DemandesPage from '../pages/provider/DemandesPage'
import ChatPage from '../pages/ChatPage'

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
        <Route path="/client/reserver/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/client/reservations" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
        <Route path="/client/chat/:contactId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

        {/* Prestataire */}
        <Route path="/prestataire" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
        <Route path="/prestataire/profil" element={<ProtectedRoute><ProviderProfile /></ProtectedRoute>} />
        <Route path="/prestataire/demandes" element={<ProtectedRoute><DemandesPage /></ProtectedRoute>} />
        <Route path="/prestataire/chat/:contactId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
