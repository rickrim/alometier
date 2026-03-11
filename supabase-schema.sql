-- ============================================
-- AloMétier - Schéma de base de données
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  type        TEXT NOT NULL CHECK (type IN ('client', 'provider')),
  nom         TEXT NOT NULL,
  telephone   TEXT,
  quartier    TEXT,
  photo_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Table des profils prestataires (complète profiles)
CREATE TABLE IF NOT EXISTS public.provider_profiles (
  id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  services    TEXT[]  DEFAULT '{}',
  zone        TEXT,
  tarif       TEXT,
  description TEXT,
  disponible  BOOLEAN DEFAULT true,
  lat         DECIMAL(10, 8),
  lng         DECIMAL(11, 8),
  note        DECIMAL(3, 2) DEFAULT 0,
  nb_avis     INTEGER DEFAULT 0
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS public.bookings (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id    UUID REFERENCES public.profiles(id),
  provider_id  UUID REFERENCES public.profiles(id),
  service      TEXT,
  date         DATE,
  time         TEXT,
  address      TEXT,
  note         TEXT,
  status       TEXT DEFAULT 'pending'
                 CHECK (status IN ('pending','confirmed','in_progress','done','cancelled')),
  tarif        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Table des messages
CREATE TABLE IF NOT EXISTS public.messages (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id    UUID REFERENCES public.profiles(id),
  receiver_id  UUID REFERENCES public.profiles(id),
  text         TEXT NOT NULL,
  read         BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages          ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Profiles visibles par tous"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Utilisateur insère son profil"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Utilisateur modifie son profil"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Provider profiles
CREATE POLICY "Profils prestataires visibles"
  ON public.provider_profiles FOR SELECT USING (true);

CREATE POLICY "Prestataire insère son profil"
  ON public.provider_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Prestataire modifie son profil"
  ON public.provider_profiles FOR UPDATE USING (auth.uid() = id);

-- Bookings
CREATE POLICY "Utilisateur voit ses réservations"
  ON public.bookings FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = provider_id);

CREATE POLICY "Client crée une réservation"
  ON public.bookings FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Parties modifient la réservation"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = client_id OR auth.uid() = provider_id);

-- Messages
CREATE POLICY "Utilisateur voit ses messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Utilisateur envoie un message"
  ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Destinataire marque comme lu"
  ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

-- ============================================
-- Realtime (pour le chat)
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- ============================================
-- Fonction auto-création profil après inscription
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Le profil sera créé explicitement côté app après inscription
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
