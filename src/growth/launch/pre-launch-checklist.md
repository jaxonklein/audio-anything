# Pre-Launch Checklist — Audio Anything Private Beta

**Launch time:** Sunday 9am CT (3h 30min from now)
**Audience:** 10-20 invited users (friends/colleagues)
**Distribution:** WhatsApp direct messages with unique invite codes

---

## T-Minus 3 Hours (6am CT)

### Product Readiness
- [ ] All 16 must-have acceptance stories pass QA verification
- [ ] CEO sign-off complete
- [ ] Deployed to production (Vercel)
- [ ] SSL certificate valid
- [ ] Custom domain working (if applicable)

### Authentication & Access
- [ ] Clerk authentication working in production
- [ ] Beta access gating active (shows waitlist to non-beta users)
- [ ] 10-20 unique invite codes generated in database
- [ ] BETA-FOUNDER unlimited code created and tested
- [ ] OAuth providers (Google/GitHub) working in production

### Payment Flow
- [ ] Stripe connected to production environment
- [ ] 7-day trial flow tested end-to-end
- [ ] $4.99/month subscription created and active
- [ ] Webhook endpoints configured and verified
- [ ] Test payment completed successfully in production

### Content Generation
- [ ] ElevenLabs API connected (production key)
- [ ] All 4 voices available and tested (2M, 2F)
- [ ] Anthropic Claude API connected (production key)
- [ ] URL extraction working for test URLs (article, blog post, documentation)
- [ ] Audio files generating and playable

### Rate Limiting & Expiration
- [ ] Free tier: 3 generations/hour enforced
- [ ] Free tier: 1-hour link expiry working (tested by waiting 61 minutes)
- [ ] Premium tier: 200 generations/month enforced
- [ ] Premium tier: 100 saved links limit working
- [ ] Rate limit error messages displaying correctly

### Database
- [ ] Supabase production database live
- [ ] All migrations applied
- [ ] Row Level Security policies active
- [ ] Database backup configured

### Analytics
- [ ] PostHog production environment configured
- [ ] All 7 core events firing correctly:
  - [ ] url_submitted
  - [ ] audio_generated
  - [ ] play_started
  - [ ] playback_position_saved
  - [ ] link_expired_shown
  - [ ] upgrade_clicked
  - [ ] payment_completed
- [ ] 3 funnels created in PostHog dashboard
- [ ] Real-time event stream visible

### UX & Copy
- [ ] Pricing page live with correct tiers ($4.99/month, 200/month, 7-day trial)
- [ ] Chat widget visible with recommended CTA ("Bug the CEO directly")
- [ ] Upgrade prompts displaying in correct contexts (expiration, rate limit, post-playback)
- [ ] Waitlist page live for non-beta users
- [ ] All error states showing helpful messages

---

## T-Minus 1 Hour (8am CT)

### Final Smoke Tests
- [ ] Complete end-to-end flow as free user:
  1. Visit site with invite code
  2. Sign up with Google
  3. Paste URL, generate audio
  4. Play audio, verify playback
  5. Wait 61 minutes, verify expiration message
- [ ] Complete end-to-end flow as premium user:
  1. Sign up with invite code
  2. Click "Start free trial"
  3. Enter payment details (Stripe test mode first, then real card)
  4. Verify 7-day trial starts
  5. Generate audio, save to library
  6. Verify no expiration on premium links
- [ ] Test chat widget → verify CEO receives message
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Test on desktop (Chrome, Firefox, Safari)

### Invite Distribution Prep
- [ ] 10-20 recipient phone numbers confirmed
- [ ] WhatsApp messages drafted (use Version C from `/src/growth/launch/private-beta-invite.md`)
- [ ] Unique invite links ready to paste (format: `https://audioanything.com/?code=BETA-XXXXXXXX`)
- [ ] Founder has invite list and copy ready to send

### Monitoring Setup
- [ ] PostHog dashboard open in browser tab
- [ ] Vercel deployment logs open
- [ ] Supabase database dashboard open
- [ ] Stripe dashboard open (watching for trial starts)
- [ ] CEO's phone/email ready for chat widget messages

---

## T-Minus 15 Minutes (8:45am CT)

### Go/No-Go Decision
**CEO makes final call:** Are we ready to launch?

**Go criteria:**
- All must-have stories verified ✓
- Payment flow working ✓
- Beta gating active ✓
- Analytics firing ✓
- Mobile + desktop tested ✓

**No-go criteria:**
- Any must-have story fails QA
- Payment flow broken
- Authentication not working
- Audio generation failing
- Mobile experience broken

If NO-GO: Delay launch, fix blockers, re-run checklist.

---

## 9:00am CT — LAUNCH

### Founder sends invites
1. Copy WhatsApp message (Version C)
2. For each recipient:
   - Replace `[UNIQUE_LINK]` with their specific invite link
   - Send via WhatsApp
3. Post in #audio-anything-3-leadership: "🚀 Invites sent to [N] users. Monitoring begins."

### Team monitoring stations
- **CEO:** Chat widget messages, user support
- **Growth (me):** PostHog analytics, conversion funnel, user behavior
- **Engineer:** Vercel logs, error monitoring, performance
- **Ops:** Database health, API rate limits, infrastructure

### First 60 minutes
- Watch for first sign-ups (expect 5-10 in first hour)
- Monitor `url_submitted` and `audio_generated` events
- Check for errors in Vercel logs
- Respond to chat widget messages within 5 minutes
- Note any UX confusion or bugs reported

---

## Post-Launch Cadence

**First 6 hours (9am-3pm CT):**
- Standup every 60 minutes in #audio-anything-3-team
- Report: sign-ups, generations, errors, user feedback
- Fix critical bugs immediately
- Document feature requests for post-beta

**First 24 hours:**
- Track key metrics:
  - Sign-up conversion rate (invites sent → accounts created)
  - Activation rate (accounts created → first audio generated)
  - Premium conversion rate (trial starts in first 24h)
  - Average generations per user
  - Most common errors/drop-off points
- CEO posts end-of-day summary in #leadership

**First 7 days:**
- Daily standup at 9am CT
- Monitor trial expiration (Day 7) → payment conversion
- Collect qualitative feedback via chat widget
- Prepare for public beta launch (if private beta succeeds)

---

## Emergency Contacts

**Critical bugs:** @audio-anything-ic-engineer-1, @audio-anything-ic-engineer-2
**Infrastructure issues:** @audio-anything-chief-of-staff
**User support questions:** @audio-anything-ceo
**Analytics/funnel questions:** @audio-anything-head-of-growth
**Founder escalation:** @jaxonklein (WhatsApp or Slack)

---

## Success Metrics (Private Beta)

**Minimum viable success:**
- 50%+ of invited users sign up
- 80%+ of sign-ups generate at least one audio
- Zero critical bugs blocking core flow
- At least one user starts premium trial

**Strong success:**
- 70%+ sign-up rate
- 2+ generations per user average
- 10%+ trial conversion in first 24 hours
- Positive unsolicited feedback via chat widget

**Exceptional success:**
- 90%+ sign-up rate
- 5+ generations per user average
- 25%+ trial conversion in first 24 hours
- Users sharing links organically (referral behavior)
