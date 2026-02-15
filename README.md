# Audio Anything

Turn any content into podcast-quality audio.

## Tech Stack

- **Frontend/Backend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Database**: Supabase (Postgres + Auth + Realtime)
- **TTS**: Piper TTS (open-source, CPU-optimized)
- **Auth**: NextAuth.js (OAuth: Google, GitHub, Apple, X, Facebook)
- **Payments**: Stripe
- **Deployment**: Vercel (app) + Hetzner (TTS server)
- **Analytics**: PostHog

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase

Create a Supabase project at [supabase.com](https://supabase.com):

```bash
# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Push the database schema
supabase db push

# Get your keys from the Supabase dashboard and add to .env:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

### 3. Configure OAuth Providers

Set up OAuth apps and add credentials to `.env`:
- Google: [console.cloud.google.com](https://console.cloud.google.com)
- GitHub: [github.com/settings/developers](https://github.com/settings/developers)

### 4. Generate NextAuth Secret
```bash
openssl rand -base64 32
# Add to .env as NEXTAUTH_SECRET
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Schema

- **users**: User accounts (email, created_at)
- **audio_items**: Generated audio files (title, source, audio_url, status)
- **playback_positions**: Resume playback tracking

See `supabase/migrations/` for full schema.

## TTS Server Setup (Production)

Piper TTS runs on a separate Hetzner server (CPX21, €8.46/mo):

```bash
# SSH into Hetzner server
ssh root@YOUR_SERVER_IP

# Install Piper TTS
pip install piper-tts

# Set up FastAPI service (TBD in Phase 3)
```

## Performance

- **TTS Generation**: 2-5 minutes for 5,000-word article
- **Audio Quality**: Podcast-quality (22.05kHz)
- **Voices**: 2 male, 2 female (pretrained Piper models)

## Development Status

- ✅ Next.js + TypeScript + Tailwind setup
- ✅ Supabase schema designed
- ✅ NextAuth configured (OAuth providers stubbed)
- ✅ TTS research complete (Piper selected)
- ⏳ Awaiting acceptance stories for feature development
