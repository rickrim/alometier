import { useState } from 'react'
import { Bell, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react'
import AppLayout from '../../components/shared/AppLayout'
import useAuthStore from '../../store/authStore'

export default function ProviderDashboard() {
  const { user, updateProfile } = useAuthStore()
  const [disponible, setDisponible] = useState(user?.disponible ?? true)

  const toggleDisponibilite = () => {
    const next = !disponible
    setDisponible(next)
    updateProfile({ disponible: next })
  }

  const stats = [
    { label: 'Missions', value: '0', icon: CheckCircle, color: 'text-green-500' },
    { label: 'En attente', value: '0', icon: Clock,       color: 'text-amber-500' },
    { label: 'Revenus',   value: '0 FCFA', icon: TrendingUp, color: 'text-blue-500' },
  ]

  return (
    <AppLayout>
      <div className="px-4 pt-12 pb-5 bg-navy">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-200 text-sm">Tableau de bord</p>
            <h2 className="text-white font-bold text-xl">{user?.nom}</h2>
          </div>
          <button className="relative w-10 h-10 bg-navy-light rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Disponibilité toggle */}
        <div className="bg-navy-light rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-semibold">Disponibilité</div>
            <div className={`text-xs mt-0.5 ${disponible ? 'text-green-300' : 'text-gray-400'}`}>
              {disponible ? 'Vous êtes visible par les clients' : 'Vous êtes hors ligne'}
            </div>
          </div>
          <button onClick={toggleDisponibilite}
            className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${disponible ? 'bg-green-400' : 'bg-gray-500'}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${disponible ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
              <div className="font-bold text-navy text-sm">{value}</div>
              <div className="text-gray-400 text-[10px]">{label}</div>
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="card">
          <h3 className="font-semibold text-navy mb-3">Mes services</h3>
          {user?.services?.length ? (
            <div className="flex flex-wrap gap-2">
              {user.services.map((s) => (
                <span key={s} className="bg-orange-50 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Aucun service ajouté</p>
          )}
        </div>

        {/* Demandes */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-navy">Demandes reçues</h3>
            <span className="text-xs text-gray-400">0 nouvelle</span>
          </div>
          <div className="flex flex-col items-center py-6 text-gray-400">
            <XCircle className="w-10 h-10 mb-2 text-gray-200" />
            <p className="text-sm">Aucune demande reçue</p>
            <p className="text-xs text-gray-300 mt-1">Activez votre disponibilité pour être visible</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
