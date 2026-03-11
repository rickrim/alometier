import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { mockProviders } from '../data/mockProviders'

const useProviderStore = create((set, get) => ({
  providers: mockProviders,
  loading: false,

  fetchProviders: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('profiles')
      .select('*, provider_profiles(*)')
      .eq('type', 'provider')

    if (error) { set({ loading: false }); return }

    const real = (data || []).map((p) => ({
      id:          p.id,
      nom:         p.nom,
      telephone:   p.telephone || '',
      quartier:    p.quartier  || 'Lomé',
      emoji:       '👤',
      services:    p.provider_profiles?.services    || [],
      zone:        p.provider_profiles?.zone        || 'Lomé',
      tarif:       p.provider_profiles?.tarif       || 'Sur devis',
      tarifNum:    0,
      description: p.provider_profiles?.description || '',
      disponible:  p.provider_profiles?.disponible  ?? true,
      note:        5.0,
      avis:        0,
      distance:    0,
    }))

    // Vrais prestataires en premier, mock ensuite
    set({ providers: [...real, ...mockProviders], loading: false })
  },

  getById: (id) => get().providers.find((p) => p.id === id),
}))

export default useProviderStore
