import { useNavigate } from 'react-router-dom'
import { LogOut, Edit2, MapPin, Phone, Mail, Star, Briefcase } from 'lucide-react'
import AppLayout from '../../components/shared/AppLayout'
import useAuthStore from '../../store/authStore'

export default function ProviderProfile() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AppLayout title="Mon profil">
      <div className="px-4 py-6 flex flex-col gap-4">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-navy">
                {(user?.nom || 'P')[0].toUpperCase()}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-navy rounded-full flex items-center justify-center border-2 border-white">
              <Edit2 className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-navy">{user?.nom}</h2>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-amber-400 stroke-none" />
              <span className="text-sm text-gray-600 font-medium">Nouveau prestataire</span>
            </div>
            <span className="inline-block bg-blue-50 text-navy text-xs font-medium px-3 py-1 rounded-full mt-1">
              Prestataire
            </span>
          </div>
        </div>

        {/* Infos */}
        <div className="card flex flex-col gap-4">
          <h3 className="font-semibold text-navy">Informations</h3>
          {[
            { icon: Phone,    label: 'Téléphone', value: user?.telephone },
            { icon: Mail,     label: 'Email',     value: user?.email || 'Non renseigné' },
            { icon: MapPin,   label: 'Zone',      value: user?.zone || 'Non renseigné' },
            { icon: Briefcase,label: 'Tarif',     value: user?.tarif || 'Non renseigné' },
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

        {/* Description */}
        {user?.description && (
          <div className="card">
            <h3 className="font-semibold text-navy mb-2">À propos</h3>
            <p className="text-gray-600 text-sm">{user.description}</p>
          </div>
        )}

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
