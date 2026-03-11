import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { CalendarCheck, Clock, CheckCircle, XCircle, ChevronRight, MessageCircle } from 'lucide-react'
import AppLayout from '../../components/shared/AppLayout'
import useAuthStore from '../../store/authStore'
import useBookingStore from '../../store/bookingStore'
import { cn } from '../../lib/utils'

const STATUS = {
  pending:     { label: 'En attente',    color: 'bg-amber-50 text-amber-600',  icon: Clock },
  confirmed:   { label: 'Confirmée',     color: 'bg-blue-50 text-blue-600',    icon: CheckCircle },
  in_progress: { label: 'En cours',      color: 'bg-orange-50 text-primary',   icon: Clock },
  done:        { label: 'Terminée',      color: 'bg-green-50 text-green-600',  icon: CheckCircle },
  cancelled:   { label: 'Annulée',       color: 'bg-red-50 text-red-400',      icon: XCircle },
}

const MONTHS = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export default function BookingsPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { bookings, fetchBookings } = useBookingStore()

  useEffect(() => {
    if (user?.id) fetchBookings(user.id, 'client')
  }, [user?.id])

  return (
    <AppLayout title="Mes réservations">
      <div className="px-4 py-4 flex flex-col gap-3">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CalendarCheck className="w-12 h-12 text-gray-200 mb-3" />
            <h3 className="font-semibold text-gray-400 mb-1">Aucune réservation</h3>
            <p className="text-gray-300 text-sm">Vos réservations apparaîtront ici</p>
            <button onClick={() => navigate('/client/recherche')}
              className="mt-6 bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl">
              Trouver un prestataire
            </button>
          </div>
        ) : (
          bookings.map((b) => {
            const st = STATUS[b.status] || STATUS.pending
            const Icon = st.icon
            return (
              <div key={b.id} className="card">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {b.providerEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-navy text-sm">{b.providerNom}</div>
                        <div className="text-gray-500 text-xs">{b.service}</div>
                      </div>
                      <span className={cn('flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full flex-shrink-0', st.color)}>
                        <Icon className="w-3 h-3" />{st.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>📅 {formatDate(b.date)}</span>
                      <span>🕐 {b.time}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">📍 {b.address}</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => navigate(`/client/chat/${b.providerId}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-50 text-primary text-xs font-medium rounded-xl">
                    <MessageCircle className="w-3.5 h-3.5" /> Discuter
                  </button>
                  <button
                    onClick={() => navigate(`/client/prestataire/${b.providerId}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 text-gray-600 text-xs font-medium rounded-xl">
                    Voir profil <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </AppLayout>
  )
}
