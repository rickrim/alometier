import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helpers auth
export const getUser = () => supabase.auth.getUser()
export const getSession = () => supabase.auth.getSession()

// Convertit un numéro de téléphone en email fictif pour Supabase auth
// Ex: "+228 90 11 22 33" → "22890112233@alometier.tg"
export function phoneToEmail(phone) {
  return phone.replace(/\D/g, '') + '@alometier.tg'
}
