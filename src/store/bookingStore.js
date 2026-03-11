import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useBookingStore = create((set, get) => ({
  bookings: [],
  loading: false,

  // ── Créer une réservation ──────────────────────────────
  addBooking: async (booking) => {
    const { data, error } = await supabase.from('bookings').insert({
      client_id:   booking.clientId,
      provider_id: booking.providerId,
      service:     booking.service,
      date:        booking.date,
      time:        booking.time,
      address:     booking.address,
      note:        booking.note || null,
      tarif:       booking.tarif,
      status:      'pending',
    }).select().single()

    if (error) { console.error(error); return null }

    // On enrichit avec les noms pour l'affichage local
    const enriched = {
      ...data,
      clientId:      data.client_id,
      providerId:    data.provider_id,
      clientNom:     booking.clientNom,
      providerNom:   booking.providerNom,
      providerEmoji: booking.providerEmoji,
    }
    set((state) => ({ bookings: [enriched, ...state.bookings] }))
    return enriched
  },

  // ── Charger les réservations ───────────────────────────
  fetchBookings: async (userId, userType) => {
    set({ loading: true })
    const field = userType === 'provider' ? 'provider_id' : 'client_id'

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq(field, userId)
      .order('created_at', { ascending: false })

    if (error) { console.error(error); set({ loading: false }); return }

    // Récupérer les noms des profils séparément
    const ids = [...new Set((data || []).flatMap((b) => [b.client_id, b.provider_id].filter(Boolean)))]
    let profileMap = {}
    if (ids.length > 0) {
      const { data: profiles } = await supabase.from('profiles').select('id, nom').in('id', ids)
      profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p.nom]))
    }

    const enriched = (data || []).map((b) => ({
      ...b,
      clientId:    b.client_id,
      providerId:  b.provider_id,
      clientNom:   profileMap[b.client_id]  || 'Client',
      providerNom: profileMap[b.provider_id] || 'Prestataire',
      providerEmoji: '👤',
    }))

    set({ bookings: enriched, loading: false })
  },

  // ── Mettre à jour le statut ────────────────────────────
  updateStatus: async (id, status) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)

    if (!error) {
      set((state) => ({
        bookings: state.bookings.map((b) => b.id === id ? { ...b, status } : b),
      }))
    }
  },

  getClientBookings:   () => get().bookings.filter((b) => b.status !== undefined),
  getProviderBookings: () => get().bookings.filter((b) => b.status !== undefined),
}))

export default useBookingStore
