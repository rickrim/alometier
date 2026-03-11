import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Phone, MessageCircle, CalendarCheck, Shield } from 'lucide-react'
import useProviderStore from '../../store/providerStore'

export default function ProviderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const p = useProviderStore((s) => s.getById(id))

  if (!p) {
    navigate('/client/recherche')
    return null
  }

  return (
    <div className="app-container flex flex-col min-h-screen bg-gray-50">
      {/* Header image / avatar */}
      <div className="relative bg-primary h-52 flex items-end">
        <button onClick={() => navigate(-1)}
          className="absolute top-12 left-4 z-10 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-7xl">{p.emoji}</div>
        </div>
        {/* Badge disponibilité */}
        <div className="absolute top-12 right-4 z-10">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${p.disponible ? 'bg-green-400 text-white' : 'bg-gray-400 text-white'}`}>
            {p.disponible ? '● Disponible' : '● Indisponible'}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 px-4 -mt-4">
        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-navy">{p.nom}</h1>
              <p className="text-gray-500 text-sm">{p.services.join(' · ')}</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary">{p.tarif}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 stroke-none" />
              <span className="font-semibold text-navy text-sm">{p.note}</span>
              <span className="text-gray-400 text-xs">({p.avis} avis)</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{p.quartier} · {p.distance} km</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-3">
          <h3 className="font-semibold text-navy mb-2">À propos</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
        </div>

        {/* Vérification */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            <div>
              <div className="font-medium text-navy text-sm">Profil vérifié</div>
              <div className="text-gray-400 text-xs">Identité confirmée par AloMétier</div>
            </div>
          </div>
        </div>

        {/* Avis clients */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <h3 className="font-semibold text-navy mb-3">Avis clients</h3>
          {[
            { auteur: 'Kossi A.', note: 5, texte: 'Excellent travail, très ponctuel !', date: 'Il y a 2 jours' },
            { auteur: 'Mimi K.', note: 5, texte: 'Je recommande vivement.', date: 'Il y a 1 semaine' },
            { auteur: 'Paul E.', note: 4, texte: 'Bon travail, propre et efficace.', date: 'Il y a 2 semaines' },
          ].map((avis, i) => (
            <div key={i} className={`pb-3 mb-3 ${i < 2 ? 'border-b border-gray-50' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-navy">{avis.auteur}</span>
                <span className="text-xs text-gray-400">{avis.date}</span>
              </div>
              <div className="flex mb-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-3 h-3 ${j < avis.note ? 'fill-amber-400 stroke-none' : 'text-gray-200'}`} />
                ))}
              </div>
              <p className="text-gray-500 text-xs">{avis.texte}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-2">
        <a href={`tel:${p.telephone}`}
          className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Phone className="w-5 h-5 text-gray-600" />
        </a>
        <button onClick={() => navigate(`/client/chat/${p.id}`)}
          className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 text-primary" />
        </button>
        <button onClick={() => navigate(`/client/reserver/${p.id}`)}
          className="flex-1 bg-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
          <CalendarCheck className="w-5 h-5" />
          Réserver maintenant
        </button>
      </div>
    </div>
  )
}
