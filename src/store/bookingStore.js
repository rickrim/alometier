import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useBookingStore = create(
  persist(
    (set, get) => ({
      bookings: [],

      addBooking: (booking) =>
        set((state) => ({
          bookings: [
            {
              ...booking,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              status: 'pending', // pending | confirmed | in_progress | done | cancelled
            },
            ...state.bookings,
          ],
        })),

      updateStatus: (id, status) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status } : b
          ),
        })),

      getClientBookings: (clientId) =>
        get().bookings.filter((b) => b.clientId === clientId),

      getProviderBookings: (providerId) =>
        get().bookings.filter((b) => b.providerId === providerId),
    }),
    { name: 'alometier-bookings' }
  )
)

export default useBookingStore
