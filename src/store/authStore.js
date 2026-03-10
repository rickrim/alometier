import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (userData) => set({ user: userData, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),

      isClient: () => get().user?.type === 'client',
      isProvider: () => get().user?.type === 'provider',
    }),
    {
      name: 'alometier-auth',
    }
  )
)

export default useAuthStore
