# Credentials & Environment Variables - Audio Anything Beta

**⚠️ PRIVATE - DO NOT COMMIT TO GIT**

Last updated: 2026-02-15 02:56 CT

## Stripe (Test Mode)

Creating Stripe account now...

**Status:** Pending setup
**Account:** TBD
**Dashboard:** https://dashboard.stripe.com/test/dashboard

**Environment Variables:**
```bash
STRIPE_SECRET_KEY=sk_test_[PENDING]
STRIPE_PUBLISHABLE_KEY=pk_test_[PENDING]
STRIPE_PRICE_ID=price_[PENDING]
STRIPE_WEBHOOK_SECRET=whsec_[PENDING]
```

## Sentry (Error Tracking)

Setting up Sentry project now...

**Status:** Pending setup
**Organization:** TBD
**Project:** audio-anything-beta

**Environment Variables:**
```bash
SENTRY_DSN=https://[PENDING]@sentry.io/[PENDING]
NEXT_PUBLIC_SENTRY_DSN=https://[PENDING]@sentry.io/[PENDING]
```

## Anthropic (Content Extraction)

**Status:** Using temporary key (CEO to provide)

**Environment Variables:**
```bash
ANTHROPIC_API_KEY=[CEO TO PROVIDE]
```

## ElevenLabs (TTS)

**Status:** Setting up now

**Account:** Creating account for Audio Anything
**Dashboard:** https://elevenlabs.io/app

**Environment Variables:**
```bash
ELEVENLABS_API_KEY=[SETTING UP - ETA 3:45am]
```

**Voice IDs (pre-configured):**
- Male 1 (Adam): `pNInz6obpgDQGcFmaJgB`
- Male 2 (Josh): `TxGEqnHWrfWFTfGW9XjX`
- Female 1 (Rachel): `21m00Tcm4TlvDq8ikWAM`
- Female 2 (Bella): `EXAVITQu4vr4xnSDxMaL`

## Supabase (Database)

**Status:** Engineer creating via dashboard

**Environment Variables:**
```bash
DATABASE_URL=postgresql://[PENDING]
NEXT_PUBLIC_SUPABASE_URL=https://[PENDING].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[PENDING]
SUPABASE_SERVICE_ROLE_KEY=[PENDING]
```

## NextAuth (OAuth)

**Status:** Pending OAuth app creation

**Environment Variables:**
```bash
NEXTAUTH_URL=https://[vercel-url-pending]
NEXTAUTH_SECRET=[GENERATE_WITH: openssl rand -base64 32]

# Google OAuth
GOOGLE_CLIENT_ID=[PENDING]
GOOGLE_CLIENT_SECRET=[PENDING]

# GitHub OAuth
GITHUB_CLIENT_ID=[PENDING]
GITHUB_CLIENT_SECRET=[PENDING]
```

## PostHog (Analytics)

**Status:** Optional - if time permits

**Environment Variables:**
```bash
NEXT_PUBLIC_POSTHOG_KEY=[PENDING]
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## TTS Server

**Status:** Stubbed for now, real server TBD

**Environment Variables:**
```bash
TTS_SERVER_URL=http://localhost:5000  # Stub during development
```

---

## Setup Checklist

- [ ] Stripe account created
- [ ] Stripe keys added to Vercel
- [ ] Sentry project created
- [ ] Sentry DSN added to Vercel
- [ ] Anthropic key obtained
- [ ] Supabase project created
- [ ] Google OAuth app created
- [ ] GitHub OAuth app created
- [ ] NEXTAUTH_SECRET generated
- [ ] All env vars added to Vercel project settings

## Notes

- All test mode keys are safe to use during beta
- Switch to production keys only after founder approval
- Keep this file updated as credentials are obtained
- Share relevant credentials with engineer via secure channel
