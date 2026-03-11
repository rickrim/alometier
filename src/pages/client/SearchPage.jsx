import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, Star, MapPin, Map, List, Phone, MessageCircle } from 'lucide-react'
import AppLayout from '../../components/shared/AppLayout'
import { mockProviders, getAllServices } from '../../data/mockProviders'
import { cn } from '../../lib/utils'

const SORT_OPTIONS = [
  { value: 'distance', label: 'Distance' },
  { value: 'note',     label: 'Note' },
  { value: 'tarif',    label: 'Prix' },
]

export default function SearchPage() {
  const navigate = useNavigate()
  const services = getAllServices()

  const [query, setQuery]           = useState('')
  const [serviceFilter, setService] = useState('Tous')
  const [sortBy, setSort]           = useState('distance')
  const [disponibleOnly, setDispo]  = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode]     = useState('list') // 'list' | 'map'

  const filtered = useMemo(() => {
    return mockProviders
      .filter((p) => {
        const matchQuery = !query ||
          p.nom.toLowerCase().includes(query.toLowerCase()) ||
          p.services.some((s) => s.toLowerCase().includes(query.toLowerCase())) ||
          p.quartier.toLowerCase().includes(query.toLowerCase())
        const matchService = serviceFilter === 'Tous' || p.services.includes(serviceFilter)
        const matchDispo = !disponibleOnly || p.disponible
        return matchQuery && matchService && matchDispo
      })
      .sort((a, b) => {
        if (sortBy === 'note') return b.note - a.note
        if (sortBy === 'tarif') return a.tarifNum - b.tarifNum
        return a.distance - b.distance
      })
  }, [query, serviceFilter, sortBy, disponibleOnly])

  return (
    <AppLayout>
      {/* Header fixe */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 pt-12 pb-3">
        {/* Barre de recherche */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Nom, service, quartier..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
              showFilters ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600')}>
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-600">
            {viewMode === 'list' ? <Map className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </button>
        </div>

        {/* Filtres par service */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {services.map((s) => (
            <button key={s} onClick={() => setService(s)}
              className={cn('px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors',
                serviceFilter === s
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600')}>
              {s}
            </button>
          ))}
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Trier par</span>
              <div className="flex gap-1">
                {SORT_OPTIONS.map(({ value, label }) => (
                  <button key={value} onClick={() => setSort(value)}
                    className={cn('px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                      sortBy === value ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600')}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer ml-auto">
              <span className="text-xs text-gray-500">Disponibles</span>
              <div onClick={() => setDispo(!disponibleOnly)}
                className={cn('w-9 h-5 rounded-full transition-colors relative cursor-pointer',
                  disponibleOnly ? 'bg-primary' : 'bg-gray-300')}>
                <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                  disponibleOnly ? 'translate-x-4' : 'translate-x-0.5')} />
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Résultats */}
      <div className="px-4 py-3">
        <p className="text-xs text-gray-400 mb-3">
          {filtered.length} prestataire{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
        </p>

        {viewMode === 'map' ? (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-2xl text-gray-400">
            <div className="text-center">
              <Map className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Vue carte disponible prochainement</p>
              <button onClick={() => navigate('/client/carte')}
                className="mt-3 bg-primary text-white text-xs px-4 py-2 rounded-full font-medium">
                Ouvrir la carte
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                <p className="text-sm">Aucun prestataire trouvé</p>
                <p className="text-xs text-gray-300 mt-1">Essayez un autre filtre</p>
              </div>
            ) : (
              filtered.map((p) => (
                <ProviderCard key={p.id} provider={p}
                  onClick={() => navigate(`/client/prestataire/${p.id}`)} />
              ))
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

function ProviderCard({ provider: p, onClick }) {
  return (
    <div className="card active:scale-[0.99] transition-transform" onClick={onClick}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl">
          {p.emoji}
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold text-navy text-sm">{p.nom}</div>
              <div className="text-gray-500 text-xs">{p.services.join(', ')}</div>
            </div>
            <span className={cn('flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full',
              p.disponible ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400')}>
              {p.disponible ? 'Disponible' : 'Indisponible'}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
              <Star className="w-3 h-3 fill-amber-400 stroke-none" />{p.note}
              <span className="text-gray-400 font-normal">({p.avis})</span>
            </span>
            <span className="flex items-center gap-0.5 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />{p.distance} km
            </span>
            <span className="text-xs font-semibold text-primary ml-auto">{p.tarif}</span>
          </div>

          <div className="flex items-center gap-1 mt-2">
            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
              <MapPin className="w-3 h-3" />{p.quartier}
            </span>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
        <a href={`tel:${p.telephone}`} onClick={(e) => e.stopPropagation()}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 rounded-xl text-xs font-medium text-gray-600 active:bg-gray-100">
          <Phone className="w-3.5 h-3.5" /> Appeler
        </a>
        <button onClick={(e) => { e.stopPropagation() }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-50 rounded-xl text-xs font-medium text-primary active:bg-orange-100">
          <MessageCircle className="w-3.5 h-3.5" /> Discuter
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary rounded-xl text-xs font-medium text-white active:bg-primary-600">
          Réserver
        </button>
      </div>
    </div>
  )
}
