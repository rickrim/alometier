import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, FileText, CheckCircle } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useBookingStore from '../../store/bookingStore'
import useProviderStore from '../../store/providerStore'

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00']

function getTodayAndNext6() {
  const days = []
  const now = new Date()
  const labels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc']
  for (let i = 0; i < 7; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    days.push({
      label: i === 0 ? "Auj." : labels[d.getDay()],
      date: `${d.getDate()} ${months[d.getMonth()]}`,
      iso: d.toISOString().split('T')[0],
    })
  }
  return days
}

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const addBooking = useBookingStore((s) => s.addBooking)
  const provider = useProviderStore((s) => s.getById(id))

  const days = getTodayAndNext6()
  const [selectedDay, setSelectedDay] = useState(days[0].iso)
  const [selectedTime, setSelectedTime] = useState('')
  const [address, setAddress] = useState(user?.quartier || '')
  const [note, setNote] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!provider) { navigate(-1); return null }

  const isMockProvider = !provider.id.includes('-')

  const handleConfirm = async () => {
    if (!selectedTime || loading) return
    if (isMockProvider) {
      setError('Ce prestataire est une démo et ne peut pas être réservé. Cherchez un vrai prestataire.')
      return
    }
    setLoading(true)
    setError(null)
    const result = await addBooking({
      clientId: user.id,
      clientNom: user.nom,
      providerId: provider.id,
      providerNom: provider.nom,
      providerEmoji: provider.emoji,
      service: provider.services[0],
      date: selectedDay,
      time: selectedTime,
      address,
      note,
      tarif: provider.tarif,
    })
    setLoading(false)
    if (result) setConfirmed(true)
    else setError('Erreur lors de la réservation. Vérifiez votre connexion et réessayez.')
  }

  if (confirmed) {
    return (
      <div className="app-container flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-navy mb-2">Réservation envoyée !</h2>
        <p className="text-gray-500 text-sm mb-1">
          Votre demande a été envoyée à <span className="font-semibold text-navy">{provider.nom}</span>.
        </p>
        <p className="text-gray-400 text-xs mb-8">
          {days.find(d => d.iso === selectedDay)?.date} à {selectedTime} · {address}
        </p>
        <div className="w-full flex flex-col gap-3">
          <button onClick={() => navigate('/client/reservations')}
            className="btn-primary">
            Voir mes réservations
          </button>
          <button onClick={() => navigate('/client')}
            className="btn-outline">
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-5">
        <button onClick={() => navigate(-1)} className="text-white mb-3 p-1 -ml-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white">Réserver un service</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-2xl">{provider.emoji}</span>
          <div>
            <div className="text-white font-medium text-sm">{provider.nom}</div>
            <div className="text-orange-100 text-xs">{provider.services[0]} · {provider.tarif}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-5 overflow-y-auto pb-32">
        {/* Choix de la date */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-navy">Choisir la date</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {days.map((d) => (
              <button key={d.iso} onClick={() => setSelectedDay(d.iso)}
                className={`flex flex-col items-center px-3 py-2 rounded-xl flex-shrink-0 min-w-[56px] transition-colors ${
                  selectedDay === d.iso
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                <span className="text-[10px] font-medium">{d.label}</span>
                <span className="text-sm font-bold">{d.date.split(' ')[0]}</span>
                <span className="text-[10px]">{d.date.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Choix de l'heure */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-navy">Choisir l'heure</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((t) => (
              <button key={t} onClick={() => setSelectedTime(t)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  selectedTime === t
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Adresse */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-navy">Adresse d'intervention</h3>
          </div>
          <input value={address} onChange={(e) => setAddress(e.target.value)}
            placeholder="Ex: Rue des Bananier, Bè Klikamé"
            className="input-field" />
        </div>

        {/* Note */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-navy">Instructions (optionnel)</h3>
          </div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Décrivez votre besoin, accès, matériel requis..."
            rows={3} className="input-field resize-none" />
        </div>
      </div>

      {/* Bouton confirmer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-4">
        {error && (
          <p className="text-red-500 text-xs text-center mb-2">{error}</p>
        )}
        <button onClick={handleConfirm} disabled={!selectedTime || loading}
          className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all ${
            selectedTime && !loading ? 'bg-primary active:scale-95' : 'bg-gray-300 cursor-not-allowed'
          }`}>
          {loading ? 'Envoi en cours...' : 'Confirmer la réservation'}
        </button>
      </div>
    </div>
  )
}
