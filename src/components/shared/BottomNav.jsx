import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, CalendarCheck, User } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { cn } from '../../lib/utils'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const base = user?.type === 'provider' ? '/prestataire' : '/client'

  const tabs = [
    { label: 'Accueil',      icon: Home,          path: base },
    { label: 'Recherche',    icon: Search,         path: `${base}/recherche` },
    { label: 'Réservations', icon: CalendarCheck,  path: `${base}/reservations` },
    { label: 'Profil',       icon: User,           path: `${base}/profil` },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-2 pb-safe">
      <div className="flex justify-around py-2">
        {tabs.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path
          return (
            <button key={path} onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[60px]">
              <Icon className={cn('w-5 h-5', active ? 'text-primary' : 'text-gray-400')} />
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
