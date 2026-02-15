# Deployment Checklist - Audio Anything Private Beta

**Target Launch:** Sunday, February 16, 2026 @ 9:00 AM Central Time

## Pre-Deployment

### Environment Setup
- [ ] **Vercel Project Created**
  - [ ] Connect GitHub repo
  - [ ] Configure auto-deploy from `main` branch
  - [ ] Set up preview deployments for PRs

- [ ] **Environment Variables Configured** (Vercel)
  - [ ] `DATABASE_URL` (Supabase connection string)
  - [ ] `NEXTAUTH_URL` (production domain)
  - [ ] `NEXTAUTH_SECRET` (generated secret)
  - [ ] `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
  - [ ] `APPLE_CLIENT_ID` / `APPLE_CLIENT_SECRET`
  - [ ] `TWITTER_CLIENT_ID` / `TWITTER_CLIENT_SECRET`
  - [ ] `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET`
  - [ ] `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `STRIPE_PRICE_ID` (premium subscription price)
  - [ ] `ANTHROPIC_API_KEY` (for Claude content extraction)
  - [ ] `TTS_SERVER_URL` (Hetzner TTS endpoint)
  - [ ] `POSTHOG_API_KEY` (analytics)
  - [ ] `POSTHOG_HOST` (self-hosted or cloud URL)

- [ ] **Hetzner TTS Server Provisioned**
  - [ ] Server created and running
  - [ ] TTS model installed and tested
  - [ ] API endpoint accessible from Vercel
  - [ ] Rate limiting configured (per-IP)
  - [ ] Health check endpoint responding

- [ ] **Supabase Database**
  - [ ] Project created
  - [ ] Database schema deployed (migrations)
  - [ ] Row-level security policies enabled
  - [ ] Connection pooling configured
  - [ ] Backups enabled (daily)

- [ ] **Stripe Account**
  - [ ] Product created ("Audio Anything Premium")
  - [ ] Price created ($4.99/month recurring)
  - [ ] Webhook endpoint configured (points to `/api/webhooks/stripe`)
  - [ ] Webhook events enabled: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
  - [ ] Test mode OFF (production keys in use)

- [ ] **OAuth Apps Configured**
  - [ ] Google OAuth app created, redirect URIs set
  - [ ] Apple Sign In configured, redirect URIs set
  - [ ] X (Twitter) OAuth app created, redirect URIs set
  - [ ] Facebook app created, redirect URIs set
  - [ ] GitHub OAuth app created, redirect URIs set

### Domain & DNS
- [ ] **Domain Configured**
  - [ ] Domain acquired (or temporary Vercel URL documented)
  - [ ] DNS records pointed to Vercel
  - [ ] SSL certificate auto-provisioned by Vercel
  - [ ] `www` subdomain redirects to apex (or vice versa)

### Monitoring & Alerts
- [ ] **Error Tracking** (Choose one: Sentry, LogRocket, etc.)
  - [ ] SDK installed and configured
  - [ ] Source maps uploaded for production
  - [ ] Alert rules configured (email on critical errors)

- [ ] **Uptime Monitoring**
  - [ ] UptimeRobot or similar configured
  - [ ] Monitoring `/api/health` endpoint every 5 minutes
  - [ ] Alert email configured for downtime

- [ ] **Cost Monitoring**
  - [ ] Vercel usage alerts enabled (if approaching plan limits)
  - [ ] Hetzner billing alerts set up
  - [ ] Stripe dashboard monitored for transaction volume

### Legal & Compliance
- [ ] **Terms of Service** finalized and deployed at `/terms`
- [ ] **Privacy Policy** finalized and deployed at `/privacy`
- [ ] Support email created (e.g., `support@audioanything.com`)
- [ ] Privacy email created (e.g., `privacy@audioanything.com`) or aliased to support
- [ ] Footer links to Terms and Privacy added to all pages
- [ ] GDPR/CCPA compliance reviewed (if applicable)

### Support Infrastructure
- [ ] **Embedded Chat**
  - [ ] Chat widget installed (Intercom, Crisp, or similar)
  - [ ] Connected to CEO's account for direct messaging
  - [ ] Tested in staging environment

- [ ] **Email Support**
  - [ ] Support email inbox set up
  - [ ] Forwarding rules configured (if needed)
  - [ ] Auto-responder with expected response time (optional)

## Deployment Day (Sunday Morning)

### Final Checks (8:00 AM CT)
- [ ] **Code freeze** — no commits to `main` after 8:00 AM unless critical bug
- [ ] **Database migration** dry-run completed successfully
- [ ] **TTS server** responding with <5s latency on test requests
- [ ] **Stripe webhook** tested with test events
- [ ] **OAuth flows** tested for all 5 providers

### Deploy (8:30 AM CT)
- [ ] **Merge final PR** to `main` (triggers Vercel deploy)
- [ ] **Monitor deployment logs** for errors
- [ ] **Verify deployment** at production URL
- [ ] **Run smoke tests** (see below)

### Smoke Tests (8:45 AM CT)
- [ ] **Free Tier Flow**
  - [ ] Submit a URL (article)
  - [ ] Wait for audio generation
  - [ ] Play audio (verify playback works)
  - [ ] Check playback position saves (refresh page, verify resume)
  - [ ] Submit 3 URLs in <1 hour, verify rate limit message on 4th
  - [ ] Wait 1 hour, verify link expires and shows upgrade prompt

- [ ] **Premium Tier Flow**
  - [ ] Sign up with OAuth (Google)
  - [ ] Complete Stripe checkout ($4.99/month)
  - [ ] Verify account shows "Premium" status
  - [ ] Submit URL, save to library
  - [ ] Verify library shows saved item
  - [ ] Play from library, verify playback position syncs
  - [ ] Regenerate audio with different voice
  - [ ] Delete library item
  - [ ] Cancel subscription via Stripe customer portal
  - [ ] Verify account downgrades to free tier

- [ ] **Edge Cases**
  - [ ] Submit unsupported URL (YouTube) → verify error message
  - [ ] Submit paywalled content → verify extraction fails gracefully
  - [ ] Submit overly long article (>5k words free, >25k premium) → verify length error
  - [ ] Test on mobile device (iOS Safari, Android Chrome)

### Go Live (9:00 AM CT)
- [ ] **Send WhatsApp invites** to 10-20 beta users (founder sends)
- [ ] **Monitor analytics** (PostHog dashboard)
- [ ] **Watch error logs** (Sentry/console)
- [ ] **Monitor chat widget** for incoming questions

## Post-Launch Monitoring (First 24 Hours)

### Continuous Monitoring
- [ ] **Check analytics every 2 hours**
  - [ ] URL submissions
  - [ ] Audio generation success rate
  - [ ] Playback completions
  - [ ] Premium conversions

- [ ] **Respond to support messages** <30 min
- [ ] **Triage errors** in real-time (critical bugs get hotfixes)
- [ ] **Monitor TTS server load** (CPU, memory, queue length)

### Success Metrics (Day 1 Target)
- [ ] **Activation:** 80%+ of beta users submit at least 1 URL
- [ ] **Engagement:** 50%+ listen to at least 50% of generated audio
- [ ] **Conversion:** 10%+ upgrade to premium (2-3 users out of 10-20)
- [ ] **Technical:** <5% error rate on audio generation
- [ ] **Performance:** <10s average time-to-audio

### Incident Response Plan
**Critical Issues (Site Down, Payment Broken):**
1. Post in `#audio-anything-3-ops` immediately
2. CEO + Engineer respond within 15 minutes
3. Hotfix deployed within 1 hour
4. Post-mortem written after resolution

**High Priority (Feature Broken, Poor UX):**
1. Document issue in GitHub
2. Triage within 2 hours
3. Fix deployed within 6 hours

**Low Priority (Minor Bugs, Enhancement Requests):**
1. Add to backlog
2. Triage in Monday meeting
3. Schedule for next sprint

## Rollback Plan

If critical issues arise that cannot be hotfixed quickly:

1. **Revert deployment** to previous stable version (Vercel: click "Promote to Production" on previous deployment)
2. **Post in beta user WhatsApp group:** "We've hit a technical issue and rolled back. Fix incoming in [timeframe]."
3. **Debug offline** until resolved
4. **Redeploy** when ready with full smoke tests

---

**Note:** This checklist assumes a single-day deployment for private beta. For public launch, add:
- Load testing (simulate 1000+ concurrent users)
- DDoS protection (Cloudflare)
- CDN for static assets
- Database read replicas (if high traffic)
