import { MapPin, Search, Star, Clock } from 'lucide-react'
import AppLayout from '../../components/shared/AppLayout'
import useAuthStore from '../../store/authStore'

const CATEGORIES = [
  { label: 'Ménage',        emoji: '🧹' },
  { label: 'Plomberie',     emoji: '🔧' },
  { label: 'Électricité',   emoji: '⚡' },
  { label: 'Coiffure',      emoji: '✂️' },
  { label: 'Mécanique',     emoji: '🚗' },
  { label: 'Jardinage',     emoji: '🌿' },
  { label: 'Cuisine',       emoji: '🍳' },
  { label: 'Peinture',      emoji: '🖌️' },
]

export default function ClientDashboard() {
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

        {/* Localisation */}
        <div className="flex items-center gap-1 text-orange-100 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          <span>{user?.quartier || 'Lomé, Togo'}</span>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-xl flex items-center gap-2 px-3 py-3 mb-2">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span className="text-gray-400 text-sm">Quel service cherchez-vous ?</span>
        </div>
      </div>

      <div className="px-4 pt-5 pb-4">
        {/* Catégories */}
        <h3 className="font-bold text-navy text-base mb-3">Catégories</h3>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {CATEGORIES.map(({ label, emoji }) => (
            <button key={label}
              className="flex flex-col items-center gap-1.5 bg-white rounded-xl py-3 border border-gray-100 active:scale-95 transition-transform">
              <span className="text-2xl">{emoji}</span>
              <span className="text-[10px] text-gray-600 font-medium text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>

        {/* Prestataires proches - placeholder */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-navy text-base">Près de vous</h3>
          <button className="text-primary text-sm font-medium">Voir tout</button>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { nom: 'Ama Koffi', service: 'Ménage', note: 4.8, distance: '0.8 km', tarif: '3 000 FCFA/h' },
            { nom: 'Koku Attivor', service: 'Plomberie', note: 4.6, distance: '1.2 km', tarif: '5 000 FCFA/h' },
            { nom: 'Abla Mensah', service: 'Coiffure', note: 4.9, distance: '2.1 km', tarif: '2 500 FCFA' },
          ].map((p) => (
            <div key={p.nom} className="card flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">{p.nom[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-navy text-sm">{p.nom}</div>
                <div className="text-gray-500 text-xs">{p.service}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5 text-xs text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400 stroke-none" />{p.note}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />{p.distance}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-primary text-xs font-semibold">{p.tarif}</div>
                <button className="mt-1 bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
                  Contacter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
