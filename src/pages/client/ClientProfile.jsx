import { useNavigate } from 'react-router-dom'
import { LogOut, Edit2, MapPin, Phone, Mail, Clock } from 'lucide-react'
import AppLayout from '../../components/shared/AppLayout'
import useAuthStore from '../../store/authStore'

export default function ClientProfile() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AppLayout title="Mon profil">
      <div className="px-4 py-6 flex flex-col gap-4">
        {/* Avatar + nom */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="relative">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">
                {(user?.nom || 'C')[0].toUpperCase()}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white">
              <Edit2 className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-navy">{user?.nom}</h2>
            <span className="inline-block bg-orange-50 text-primary text-xs font-medium px-3 py-1 rounded-full mt-1">
              Client
            </span>
          </div>
        </div>

        {/* Infos */}
        <div className="card flex flex-col gap-4">
          <h3 className="font-semibold text-navy">Informations</h3>
          {[
            { icon: Phone, label: 'Téléphone', value: user?.telephone },
            { icon: Mail,  label: 'Email',     value: user?.email || 'Non renseigné' },
            { icon: MapPin,label: 'Quartier',  value: user?.quartier || 'Non renseigné' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <div className="text-xs text-gray-400">{label}</div>
                <div className="text-sm font-medium text-gray-800">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Historique */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-navy">Mes demandes</h3>
            <span className="text-xs text-gray-400">0 total</span>
          </div>
          <div className="flex flex-col items-center py-6 text-gray-400">
            <Clock className="w-10 h-10 mb-2 text-gray-200" />
            <p className="text-sm">Aucune demande pour l'instant</p>
          </div>
        </div>

        {/* Déconnexion */}
        <button onClick={handleLogout}
          className="flex items-center justify-center gap-2 text-red-500 font-medium py-3 border border-red-100 rounded-xl bg-red-50 active:scale-95 transition-transform">
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </div>
    </AppLayout>
  )
}
