import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, Map, CalendarCheck, User, Bell } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useBookingStore from '../../store/bookingStore'
import { cn } from '../../lib/utils'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const { getProviderBookings } = useBookingStore()
  const isProvider = user?.type === 'provider'
  const base = isProvider ? '/prestataire' : '/client'

  const pendingCount = isProvider
    ? getProviderBookings(user?.id).filter((b) => b.status === 'pending').length
    : 0

  const clientTabs = [
    { label: 'Accueil',      icon: Home,         path: base },
    { label: 'Recherche',    icon: Search,        path: `${base}/recherche` },
    { label: 'Carte',        icon: Map,           path: `${base}/carte` },
    { label: 'Réservations', icon: CalendarCheck, path: `${base}/reservations` },
    { label: 'Profil',       icon: User,          path: `${base}/profil` },
  ]

  const providerTabs = [
    { label: 'Accueil',   icon: Home,         path: base },
    { label: 'Demandes',  icon: Bell,         path: `${base}/demandes`, badge: pendingCount },
    { label: 'Profil',    icon: User,         path: `${base}/profil` },
  ]

  const tabs = isProvider ? providerTabs : clientTabs

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-2 pb-safe z-50">
      <div className="flex justify-around py-2">
        {tabs.map(({ label, icon: Icon, path, badge }) => {
          const active = location.pathname === path
          return (
            <button key={path} onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[52px] relative">
              <div className="relative">
                <Icon className={cn('w-5 h-5', active ? 'text-primary' : 'text-gray-400')} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              <span className={cn('text-[10px] font-medium', active ? 'text-primary' : 'text-gray-400')}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
