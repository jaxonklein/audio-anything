-- Audio Anything Database Schema
-- Uses Clerk for auth (user IDs are text strings like "user_xxx")
-- Uses service role key to bypass RLS (no Supabase Auth)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced from Clerk via app code)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,  -- Clerk user ID (e.g., "user_2abc...")
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_subscription_status TEXT CHECK (stripe_subscription_status IN ('active', 'trialing', 'canceled', 'past_due', 'incomplete', 'incomplete_expired', 'unpaid')),
  stripe_current_period_end TIMESTAMPTZ,
  stripe_trial_end TIMESTAMPTZ,
  stripe_cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audio items table
CREATE TABLE IF NOT EXISTS public.audio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source_url TEXT,
  source_text TEXT,
  audio_url TEXT,
  duration INTEGER, -- in seconds
  word_count INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playback positions table (for resume functionality)
CREATE TABLE IF NOT EXISTS public.playback_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  audio_item_id UUID NOT NULL REFERENCES public.audio_items(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0, -- in seconds
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, audio_item_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS audio_items_user_id_idx ON public.audio_items(user_id);
CREATE INDEX IF NOT EXISTS audio_items_status_idx ON public.audio_items(status);
CREATE INDEX IF NOT EXISTS audio_items_created_at_idx ON public.audio_items(created_at);
CREATE INDEX IF NOT EXISTS playback_positions_user_id_idx ON public.playback_positions(user_id);
CREATE INDEX IF NOT EXISTS playback_positions_audio_item_id_idx ON public.playback_positions(audio_item_id);
CREATE INDEX IF NOT EXISTS users_stripe_customer_idx ON public.users(stripe_customer_id);

-- RLS disabled — we use service role key and handle auth in application code via Clerk
-- This is the correct pattern when using a third-party auth provider

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_audio_items_updated_at ON public.audio_items;
CREATE TRIGGER update_audio_items_updated_at BEFORE UPDATE ON public.audio_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_playback_positions_updated_at ON public.playback_positions;
CREATE TRIGGER update_playback_positions_updated_at BEFORE UPDATE ON public.playback_positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
