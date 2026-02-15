# Audio Anything - Deployment Checklist

**Target Date**: 2026-02-16
**Product**: Audio Anything Private Beta
**Environment**: Vercel Production

---

## Pre-Deployment Requirements

### 1. Environment Variables (Vercel Dashboard)
All of these must be configured in Vercel before deployment:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=

# OpenAI API
OPENAI_API_KEY=

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Application
NEXTAUTH_URL=https://[your-domain].vercel.app
NEXT_PUBLIC_APP_URL=https://[your-domain].vercel.app

# Beta Access
BETA_INVITE_CODE=BETA-FOUNDER
```

### 2. External Service Setup

- [ ] **PostHog Account Created**
  - Sign up at https://posthog.com
  - Create project
  - Copy API key to `NEXT_PUBLIC_POSTHOG_KEY`
  - 5-minute setup (see `docs/posthog-setup.md`)

- [ ] **Vercel Auth Token Generated**
  - Account Settings → Tokens → Create Token
  - Scope: Full Access (or deployment-specific)
  - Copy token for deployment CLI/CI

- [ ] **Stripe Webhook Configured**
  - Dashboard → Developers → Webhooks → Add endpoint
  - Endpoint URL: `https://[domain]/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
  - Copy signing secret to `STRIPE_WEBHOOK_SECRET`

- [ ] **Domain Configured** (if custom domain)
  - DNS records pointing to Vercel
  - SSL certificate provisioned

---

## Deployment Steps

### Option A: Vercel CLI (Recommended for first deploy)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login with auth token
vercel login

# 3. Link project (first time only)
cd /Users/jaxonklein/Projects/audio-anything-3
vercel link

# 4. Set environment variables
# Do this via Vercel Dashboard (easier) or CLI:
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# ... repeat for all env vars

# 5. Deploy to production
vercel --prod

# 6. Note the deployment URL
```

### Option B: Git Push (if GitHub integration set up)

```bash
# 1. Commit all changes
git add .
git commit -m "Production deployment for private beta"

# 2. Push to main branch
git push origin main

# Vercel auto-deploys from GitHub
# Monitor at: https://vercel.com/[team]/[project]/deployments
```

---

## Post-Deployment Verification

### 1. Production Smoke Test (5-10 minutes)

Visit the production URL and verify:

- [ ] **Landing Page** (`/`)
  - Page loads without console errors
  - Beta access control works (should redirect to `/waitlist` without invite code)
  - Access with `?invite=BETA-FOUNDER` grants entry (sets cookie)

- [ ] **Anonymous Audio Generation** (Story 1)
  - Paste text into generator
  - Click "Generate Audio"
  - Audio file generates and plays
  - Waveform displays
  - Player controls work (play, pause, speed, voice)

- [ ] **Rate Limiting** (Story 3)
  - Generate 3 audio files as anonymous user
  - Verify counter decrements: 3 → 2 → 1 → 0
  - 4th attempt blocked with rate limit message
  - Countdown timer shows time until reset

- [ ] **OAuth Sign-In** (Story 2)
  - Click "Sign in with Google"
  - OAuth flow completes
  - Returns to app authenticated
  - Navigation shows Library and Account links

- [ ] **Premium Features** (Story 10-11)
  - Sign in as authenticated user
  - Navigate to `/library` - page loads, shows empty state or saved audio
  - Navigate to `/account` - subscription UI displays
  - "Start Free Trial" button works (creates Stripe checkout session)

- [ ] **Chat Widget** (Story 15)
  - Widget button visible in bottom-right
  - Clicks to open chat interface
  - Can type message and submit
  - CEO receives message and can reply

- [ ] **Dark Mode** (Story 14)
  - Toggle dark mode switch
  - Page theme switches correctly
  - Preference persists on refresh

- [ ] **Analytics Tracking**
  - Check PostHog dashboard for events:
    - `$pageview` events appearing
    - `audio_generated` event fires on generation
  - May take 1-2 minutes for events to appear

### 2. Critical Error Checks

- [ ] Check Vercel deployment logs for runtime errors
- [ ] Check browser console for JavaScript errors
- [ ] Verify all API routes return 200/201 (not 500/404)
- [ ] Test on mobile device (responsive design)
- [ ] Test on Safari, Chrome, Firefox (cross-browser)

### 3. Database Verification

- [ ] Supabase: Check `users` table for new sign-ups
- [ ] Supabase: Check `audio_library` table for saved audio (if premium user tests)
- [ ] Stripe: Check dashboard for subscription events (if trial started)

---

## Beta Launch Execution

### 1. Prepare Beta Tester List (10-20 people)
- Compile emails of beta testers
- Create personalized invite messages

### 2. Send Invites
```
Subject: You're invited to Audio Anything Private Beta

Hi [Name],

You're invited to try Audio Anything - turn any article into studio-quality audio.

Access the private beta here:
https://[domain].vercel.app?invite=BETA-FOUNDER

What you can do:
- Generate audio from articles (paste text or URL)
- Start a 7-day free trial for unlimited access ($4.99/month after)
- Save audio to your library
- Manage your subscription

We'd love your feedback! Reply to this email or use the chat widget in the app.

Thanks,
[Your name]
```

### 3. Monitor First 24 Hours
- [ ] Watch PostHog for user activity
- [ ] Monitor Vercel logs for errors
- [ ] Check Stripe dashboard for trial starts
- [ ] Respond to chat widget messages promptly
- [ ] Track conversion rate (visitors → trials)

### 4. Collect Feedback
- [ ] Note any bugs reported by beta testers
- [ ] Track feature requests
- [ ] Measure engagement (audio generations per user)
- [ ] Identify drop-off points

---

## Rollback Plan

If critical issues are discovered post-deployment:

```bash
# Option 1: Rollback to previous deployment
vercel rollback [deployment-url]

# Option 2: Redeploy last known good commit
git revert HEAD
git push origin main

# Option 3: Take site down temporarily
# Set BETA_INVITE_CODE to invalid value to block all access
# Or deploy a maintenance page
```

---

## Known Limitations (Acceptable for Private Beta)

1. **Anonymous rate limit resets on browser refresh** - by design for private beta
2. **Stories 4-6, 9, 12-13 not fully QA tested** - will be tested by real beta users
3. **OAuth only tested with Google** - other providers (GitHub, etc.) untested
4. **No automated tests** - relying on manual QA and beta user testing

---

## Support Contact

**Technical issues**: @audio-anything-ic-engineer-1, @audio-anything-ic-engineer-2
**Product/strategy questions**: @audio-anything-ceo
**Billing/subscription issues**: Check Stripe dashboard, contact @audio-anything-ceo

---

## Success Metrics (Week 1)

- [ ] 10-20 beta testers invited
- [ ] 50%+ trial conversion rate
- [ ] Average 3+ audio generations per user
- [ ] Zero critical bugs reported
- [ ] 90%+ uptime
- [ ] PostHog tracking 100+ events

---

**Status**: Ready for deployment pending founder approval and Vercel auth token.
