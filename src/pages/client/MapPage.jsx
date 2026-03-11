import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Navigation, Star, X } from 'lucide-react'
import useGeolocation from '../../hooks/useGeolocation'
import { mockProviders } from '../../data/mockProviders'
import { cn } from '../../lib/utils'

// Fix icônes Leaflet avec Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Icône personnalisée pour les prestataires
const providerIcon = (emoji) =>
  L.divIcon({
    html: `<div style="
      background: white;
      border: 2px solid #F97316;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    "><span style="transform: rotate(45deg)">${emoji}</span></div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })

const userIcon = L.divIcon({
  html: `<div style="
    background: #1E3A5F;
    border: 3px solid white;
    border-radius: 50%;
    width: 16px; height: 16px;
    box-shadow: 0 0 0 4px rgba(30,58,95,0.3);
  "></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

function RecenterButton({ position }) {
  const map = useMap()
  return (
    <button
      onClick={() => map.flyTo([position.lat, position.lng], 14)}
      className="absolute bottom-6 right-4 z-[1000] w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100">
      <Navigation className="w-4 h-4 text-navy" />
    </button>
  )
}

export default function MapPage() {
  const navigate = useNavigate()
  const { position, loading } = useGeolocation()
  const [selected, setSelected] = useState(null)

  if (loading) {
    return (
      <div className="app-container flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-400">
          <Navigation className="w-10 h-10 mx-auto mb-3 text-primary animate-pulse" />
          <p className="text-sm">Détection de votre position...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container relative" style={{ height: '100dvh' }}>
      {/* Header flottant */}
      <div className="absolute top-0 left-0 right-0 z-[1000] px-4 pt-12 pb-3 bg-gradient-to-b from-white via-white/90 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-lg font-bold text-navy">Carte</h1>
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">
              <MapPin className="w-3 h-3 text-primary" />
              <span>Lomé, Togo</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">{mockProviders.filter(p => p.disponible).length} prestataires disponibles près de vous</p>
        </div>
      </div>

      {/* Carte Leaflet */}
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {/* Position utilisateur */}
        <Marker position={[position.lat, position.lng]} icon={userIcon}>
          <Popup>Vous êtes ici</Popup>
        </Marker>
        <Circle
          center={[position.lat, position.lng]}
          radius={500}
          pathOptions={{ color: '#1E3A5F', fillColor: '#1E3A5F', fillOpacity: 0.05, weight: 1 }}
        />

        {/* Marqueurs prestataires */}
        {mockProviders.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={providerIcon(p.emoji)}
            eventHandlers={{ click: () => setSelected(p) }}
          />
        ))}

        <RecenterButton position={position} />
      </MapContainer>

      {/* Fiche prestataire sélectionné */}
      {selected && (
        <div className="absolute bottom-20 left-4 right-4 z-[1000] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-slide-up">
          <button onClick={() => setSelected(null)}
            className="absolute top-3 right-3 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>

          <div className="flex gap-3">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
              {selected.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-navy">{selected.nom}</div>
              <div className="text-gray-500 text-xs">{selected.services.join(', ')} · {selected.quartier}</div>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                  <Star className="w-3 h-3 fill-amber-400 stroke-none" />{selected.note}
                </span>
                <span className="text-xs text-gray-400">{selected.distance} km</span>
                <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full ml-auto',
                  selected.disponible ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400')}>
                  {selected.disponible ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <a href={`tel:${selected.telephone}`}
              className="flex-1 py-2.5 bg-gray-50 rounded-xl text-xs font-medium text-center text-gray-700">
              📞 Appeler
            </a>
            <button
              onClick={() => navigate(`/client/prestataire/${selected.id}`)}
              className="flex-1 py-2.5 bg-primary rounded-xl text-xs font-medium text-center text-white">
              Voir le profil
            </button>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000]">
        <nav className="bg-white border-t border-gray-100 px-2 pb-safe">
          <div className="flex justify-around py-2">
            {[
              { label: 'Accueil',   icon: '🏠', path: '/client' },
              { label: 'Recherche', icon: '🔍', path: '/client/recherche' },
              { label: 'Carte',     icon: '🗺️', path: '/client/carte', active: true },
              { label: 'Profil',    icon: '👤', path: '/client/profil' },
            ].map(({ label, icon, path, active }) => (
              <button key={path} onClick={() => navigate(path)}
                className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[60px]">
                <span className="text-lg">{icon}</span>
                <span className={cn('text-[10px] font-medium', active ? 'text-primary' : 'text-gray-400')}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
