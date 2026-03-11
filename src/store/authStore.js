import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, phoneToEmail } from '../lib/supabase'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // ── Inscription ──────────────────────────────────────
      register: async (formData, type) => {
        set({ loading: true, error: null })
        // Toujours utiliser le téléphone pour l'auth Supabase (cohérence avec le login)
        const email = phoneToEmail(formData.telephone)

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password: formData.password,
        })
        if (authError) { set({ loading: false, error: authError.message }); return false }

        const uid = authData.user?.id
        if (!uid) { set({ loading: false, error: 'Erreur création compte' }); return false }

        // Connexion immédiate pour avoir une session valide (requis par RLS)
        if (!authData.session) {
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: formData.password })
          if (signInError) { set({ loading: false, error: signInError.message }); return false }
        }

        const { error: profileError } = await supabase.from('profiles').insert({
          id: uid, type,
          nom: formData.nom,
          telephone: formData.telephone,
          quartier: formData.quartier || null,
        })
        if (profileError) { set({ loading: false, error: profileError.message }); return false }

        if (type === 'provider') {
          await supabase.from('provider_profiles').insert({
            id: uid,
            services: formData.services || [],
            zone: formData.zone || null,
            tarif: formData.tarif || null,
            description: formData.description || null,
            disponible: true,
          })
        }

        const user = {
          id: uid, type,
          nom: formData.nom,
          telephone: formData.telephone,
          email,
          quartier: formData.quartier,
          ...(type === 'provider' && {
            services: formData.services,
            zone: formData.zone,
            tarif: formData.tarif,
            description: formData.description,
            disponible: true,
          }),
        }
        set({ user, isAuthenticated: true, loading: false })
        return true
      },

      // ── Connexion ─────────────────────────────────────────
      login: async (telephone, password) => {
        set({ loading: true, error: null })
        const email = phoneToEmail(telephone)

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { set({ loading: false, error: 'Téléphone ou mot de passe incorrect' }); return false }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*, provider_profiles(*)')
          .eq('id', data.user.id)
          .single()

        if (!profile) { set({ loading: false, error: 'Profil introuvable' }); return false }

        const user = {
          id: profile.id,
          type: profile.type,
          nom: profile.nom,
          telephone: profile.telephone,
          email: data.user.email,
          quartier: profile.quartier,
          photo_url: profile.photo_url,
          ...(profile.type === 'provider' && profile.provider_profiles && {
            services: profile.provider_profiles.services,
            zone: profile.provider_profiles.zone,
            tarif: profile.provider_profiles.tarif,
            description: profile.provider_profiles.description,
            disponible: profile.provider_profiles.disponible,
          }),
        }
        set({ user, isAuthenticated: true, loading: false })
        return true
      },

      // ── Initialisation session au démarrage ───────────────
      initSession: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          set({ user: null, isAuthenticated: false })
          return
        }
        // Session valide mais user pas encore chargé (ex: page refresh)
        const state = get()
        if (!state.isAuthenticated || !state.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, provider_profiles(*)')
            .eq('id', session.user.id)
            .single()
          if (profile) {
            const user = {
              id: profile.id, type: profile.type,
              nom: profile.nom, telephone: profile.telephone,
              email: session.user.email, quartier: profile.quartier,
              photo_url: profile.photo_url,
              ...(profile.type === 'provider' && profile.provider_profiles && {
                services: profile.provider_profiles.services,
                zone: profile.provider_profiles.zone,
                tarif: profile.provider_profiles.tarif,
                description: profile.provider_profiles.description,
                disponible: profile.provider_profiles.disponible,
              }),
            }
            set({ user, isAuthenticated: true })
          }
        }
      },

      // ── Déconnexion ───────────────────────────────────────
      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, isAuthenticated: false })
      },

      // ── Mise à jour profil ────────────────────────────────
      updateProfile: (data) =>
        set((state) => ({ user: { ...state.user, ...data } })),

      clearError: () => set({ error: null }),
      isClient: () => get().user?.type === 'client',
      isProvider: () => get().user?.type === 'provider',
    }),
    { name: 'alometier-auth' }
  )
)

export default useAuthStore
