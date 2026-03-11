import { useNavigate } from 'react-router-dom'
import { MapPin, Search, Star, Map } from 'lucide-react'
import AppLayout from '../../components/shared/AppLayout'
import useAuthStore from '../../store/authStore'
import { mockProviders } from '../../data/mockProviders'

const CATEGORIES = [
  { label: 'Ménage',      emoji: '🧹', service: 'Ménage' },
  { label: 'Plomberie',   emoji: '🔧', service: 'Plomberie' },
  { label: 'Électricité', emoji: '⚡', service: 'Électricité' },
  { label: 'Coiffure',    emoji: '✂️', service: 'Coiffure à domicile' },
  { label: 'Mécanique',   emoji: '🚗', service: 'Mécanique' },
  { label: 'Jardinage',   emoji: '🌿', service: 'Jardinage' },
  { label: 'Cuisine',     emoji: '🍳', service: 'Cuisine' },
  { label: 'Peinture',    emoji: '🖌️', service: 'Peinture' },
]

const nearbyProviders = mockProviders.filter((p) => p.disponible).slice(0, 3)

export default function ClientDashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  return (
    <AppLayout>
      <div className="px-4 pt-12 pb-4 bg-primary">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-orange-100 text-sm">Bonjour 👋</p>
            <h2 className="text-white font-bold text-xl">{user?.nom || 'Client'}</h2>
          </div>
          <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {(user?.nom || 'C')[0].toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-orange-100 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          <span>{user?.quartier || 'Lomé, Togo'}</span>
        </div>

        {/* Barre de recherche cliquable */}
        <button onClick={() => navigate('/client/recherche')}
          className="w-full bg-white rounded-xl flex items-center gap-2 px-3 py-3 mb-3 text-left">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span className="text-gray-400 text-sm">Quel service cherchez-vous ?</span>
        </button>

        {/* Bouton carte */}
        <button onClick={() => navigate('/client/carte')}
          className="w-full bg-white/20 rounded-xl flex items-center justify-center gap-2 py-2.5 text-white text-sm font-medium">
          <Map className="w-4 h-4" />
          Voir sur la carte
        </button>
      </div>

      <div className="px-4 pt-5 pb-4">
        {/* Catégories */}
        <h3 className="font-bold text-navy text-base mb-3">Catégories</h3>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {CATEGORIES.map(({ label, emoji, service }) => (
            <button key={label}
              onClick={() => navigate(`/client/recherche?service=${encodeURIComponent(service)}`)}
              className="flex flex-col items-center gap-1.5 bg-white rounded-xl py-3 border border-gray-100 active:scale-95 transition-transform">
              <span className="text-2xl">{emoji}</span>
              <span className="text-[10px] text-gray-600 font-medium text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>

        {/* Prestataires proches */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-navy text-base">Près de vous</h3>
          <button onClick={() => navigate('/client/recherche')}
            className="text-primary text-sm font-medium">Voir tout</button>
        </div>

        <div className="flex flex-col gap-3">
          {nearbyProviders.map((p) => (
            <button key={p.id} onClick={() => navigate(`/client/prestataire/${p.id}`)}
              className="card flex items-center gap-3 text-left w-full active:scale-[0.99] transition-transform">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-navy text-sm">{p.nom}</div>
                <div className="text-gray-500 text-xs">{p.services[0]}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5 text-xs text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400 stroke-none" />{p.note}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />{p.distance} km
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-primary text-xs font-semibold">{p.tarif}</div>
                <span className="mt-1 inline-block bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
                  Voir
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
