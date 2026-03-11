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
      .select('*, client:profiles!bookings_client_id_fkey(nom), provider:profiles!bookings_provider_id_fkey(nom)')
      .eq(field, userId)
      .order('created_at', { ascending: false })

    if (error) { console.error(error); set({ loading: false }); return }

    const enriched = (data || []).map((b) => ({
      ...b,
      clientId:    b.client_id,
      providerId:  b.provider_id,
      clientNom:   b.client?.nom || 'Client',
      providerNom: b.provider?.nom || 'Prestataire',
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
