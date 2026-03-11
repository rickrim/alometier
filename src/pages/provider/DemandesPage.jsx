import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { CalendarCheck, Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react'
import AppLayout from '../../components/shared/AppLayout'
import useAuthStore from '../../store/authStore'
import useBookingStore from '../../store/bookingStore'
import { cn } from '../../lib/utils'

const STATUS = {
  pending:     { label: 'En attente',  color: 'bg-amber-50 text-amber-600', icon: Clock },
  confirmed:   { label: 'Confirmée',   color: 'bg-blue-50 text-blue-600',   icon: CheckCircle },
  in_progress: { label: 'En cours',    color: 'bg-orange-50 text-primary',  icon: Clock },
  done:        { label: 'Terminée',    color: 'bg-green-50 text-green-600', icon: CheckCircle },
  cancelled:   { label: 'Annulée',     color: 'bg-red-50 text-red-400',     icon: XCircle },
}

const MONTHS = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc']
function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export default function DemandesPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { bookings, fetchBookings, updateStatus } = useBookingStore()

  useEffect(() => {
    if (user?.id) fetchBookings(user.id, 'provider')
  }, [user?.id])

  const pending  = bookings.filter((b) => b.status === 'pending')
  const others   = bookings.filter((b) => b.status !== 'pending')

  return (
    <AppLayout title="Demandes reçues">
      <div className="px-4 py-4 flex flex-col gap-4">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CalendarCheck className="w-12 h-12 text-gray-200 mb-3" />
            <h3 className="font-semibold text-gray-400 mb-1">Aucune demande</h3>
            <p className="text-gray-300 text-sm">Les demandes des clients apparaîtront ici</p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <div>
                <h3 className="font-semibold text-navy text-sm mb-2">
                  Nouvelles demandes <span className="bg-amber-100 text-amber-600 text-xs px-1.5 py-0.5 rounded-full ml-1">{pending.length}</span>
                </h3>
                <div className="flex flex-col gap-3">
                  {pending.map((b) => (
                    <BookingCard key={b.id} booking={b} onAccept={() => updateStatus(b.id, 'confirmed')}
                      onDecline={() => updateStatus(b.id, 'cancelled')}
                      onChat={() => navigate(`/prestataire/chat/${b.clientId}`)}
                      showActions />
                  ))}
                </div>
              </div>
            )}

            {others.length > 0 && (
              <div>
                <h3 className="font-semibold text-navy text-sm mb-2">Historique</h3>
                <div className="flex flex-col gap-3">
                  {others.map((b) => (
                    <BookingCard key={b.id} booking={b}
                      onChat={() => navigate(`/prestataire/chat/${b.clientId}`)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}

function BookingCard({ booking: b, onAccept, onDecline, onChat, showActions }) {
  const st = STATUS[b.status] || STATUS.pending
  const Icon = st.icon

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="font-semibold text-navy text-sm">{b.clientNom}</div>
          <div className="text-gray-500 text-xs">{b.service}</div>
        </div>
        <span className={cn('flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full flex-shrink-0', st.color)}>
          <Icon className="w-3 h-3" />{st.label}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-400 mb-1">
        <span>📅 {formatDate(b.date)} à {b.time}</span>
      </div>
      <div className="text-xs text-gray-400">📍 {b.address}</div>
      {b.note && <div className="text-xs text-gray-500 mt-1 italic">"{b.note}"</div>}

      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
        <button onClick={onChat}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-50 text-primary text-xs font-medium rounded-xl">
          <MessageCircle className="w-3.5 h-3.5" /> Chat
        </button>
        {showActions && (
          <>
            <button onClick={onDecline}
              className="flex-1 py-2 bg-red-50 text-red-500 text-xs font-semibold rounded-xl">
              Refuser
            </button>
            <button onClick={onAccept}
              className="flex-1 py-2 bg-primary text-white text-xs font-semibold rounded-xl">
              Accepter
            </button>
          </>
        )}
      </div>
    </div>
  )
}
