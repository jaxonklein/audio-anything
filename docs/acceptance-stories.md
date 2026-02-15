# AUDIO ANYTHING — ACCEPTANCE STORIES (APPROVED)
**Private Beta Launch: Sunday Feb 15, 9am CT**

## MUST-HAVE STORIES (Ship-Blocking)

### STORY 1: Anonymous User — Generate Audio from URL
As an anonymous user (no account), I can:
1. Visit the homepage and see a centered input field with placeholder "Paste a link to an article, blog post, or PDF"
2. Paste a URL (e.g. NYT article, Medium post, TechCrunch article)
3. Click "Generate Audio" button
4. See a loading state with queue position if others are ahead of me ("Position in queue: 2")
5. After processing completes, see an audio player with:
   - Waveform visualization
   - Play/pause button
   - Scrubbing control (seek to any position)
   - Playback speed selector (1x, 1.5x, 2x as pill buttons)
   - Voice selector dropdown (2 male, 2 female podcast-style voices)
   - Article title and source URL displayed above player
6. Play the audio and hear natural-sounding narration of the article text
7. See a rate limit indicator showing "2 generations remaining this hour"
8. See a banner: "Create a free account to access this audio on other devices" with "Sign Up" button

**Pass criteria:**
- Audio plays smoothly on desktop and mobile
- Playback position persists if I refresh the page (cookie-based, same browser only)
- Voice quality is podcast-grade (natural pacing, respects punctuation)
- Article extraction is clean (no ads, navigation, or cruft) and preserves line breaks
- Audio link works only in the same browser (cookie-tied, not shareable cross-device)

---

### STORY 2: Free Account User — Cross-Device Access
As a user with a free account (OAuth, no payment), I can:
1. Click "Sign Up" and authenticate via Google/Apple/X/Facebook/GitHub
2. Generate audio from a URL (uses same rate limit as anonymous: 3/hour)
3. Copy the audio link and open it on my phone
4. See the same audio player and resume playback from where I left off (synced via account)
5. Generate audio on mobile, then play it on desktop — playback position syncs

**Pass criteria:**
- Free account unlocks cross-device access (no payment required)
- Playback position syncs in real-time across devices
- Rate limits (3/hour, 1-hour expiry) still apply to free accounts
- Can upgrade to premium from free account

---

### STORY 3: Anonymous/Free User — Rate Limiting
As an anonymous or free account user, I can:
1. Generate 3 audio files within an hour (tracked by IP for anonymous, account for logged-in)
2. On my 3rd generation, see "0 generations remaining this hour" and a countdown timer showing when I can generate again
3. Attempt to submit a 4th URL and see an error: "Rate limit reached. Upgrade to Premium for 200 generations/month, or wait [countdown]"
4. See a prominent "Upgrade to Premium" button in the error message

**Pass criteria:**
- Rate limit resets exactly 1 hour after first generation
- Countdown timer is accurate to the second
- Error message is clear and non-hostile

---

### STORY 4: Anonymous/Free User — Link Expiration
As an anonymous or free account user, I can:
1. Generate an audio file
2. Return 30 minutes later — audio still plays, playback position is saved
3. Return 61 minutes after generation and see:
   - Audio player replaced with message: "This link expired after 1 hour. Upgrade to Premium to save audio files permanently, or create a free account to extend access."
   - "Upgrade to Premium" CTA button
   - Option to paste the URL again to regenerate (consumes a rate limit slot)

**Pass criteria:**
- Expiration is exactly 1 hour from generation time (not from last playback)
- Expired links show clear messaging with upgrade path
- Regenerating the same URL creates a new audio file (doesn't bypass rate limit)

---

### STORY 5: Anonymous/Free User — Cookie Expiry Warning
As an anonymous or free account user approaching 1-hour expiry, I can:
1. Be playing audio at 55 minutes after generation
2. See a dismissible banner appear: "This audio will expire in 5 minutes. Create a free account or upgrade to Premium to keep it."
3. Click "Upgrade" and land on premium checkout, or "Sign Up Free" for OAuth

**Pass criteria:**
- Warning appears at 55-minute mark (5 minutes before expiry)
- Banner is non-intrusive (dismissible, doesn't block playback)
- Messaging is friendly, not fear-based

---

### STORY 6: Anonymous/Free User — Voice Selection & Regeneration
As an anonymous or free account user, I can:
1. Generate audio for a URL with default voice (Male 1)
2. Click voice selector dropdown and choose "Female 2"
3. Click "Regenerate" button (with tooltip: "Uses 1 generation from your hourly limit")
4. See loading state, then hear the same article in the new voice
5. See rate limit counter decrease by 1

**Pass criteria:**
- All 4 voices (2M, 2F) sound distinct and natural
- Regeneration overwrites the previous audio but keeps the same link
- Rate limit enforcement works correctly

---

### STORY 7: Anonymous/Free User — Unsupported URL Handling
As an anonymous or free account user, I can:
1. Paste a YouTube URL and see error: "Video URLs not supported. Try an article, blog post, or PDF."
2. Paste a paywalled article URL and see error: "Unable to extract article text. This content may be paywalled or protected."
3. Paste a Twitter/Reddit/forum URL and see error: "Social media and forum URLs not supported. Try an article or blog post."
4. Paste a 6,000-word article and see error: "Article too long (6,000 words). Free tier supports up to 5,000 words. Upgrade to Premium for articles up to 25,000 words."
5. See an option: "Or paste the article text directly" which reveals a textarea
6. Paste article text manually into textarea and generate audio successfully

**Pass criteria:**
- Error messages are specific and helpful (not generic "Invalid URL")
- Manual text paste bypasses extraction but still enforces word count limits
- LLM extraction failure returns clear error with context

---

### STORY 8: Premium User — Sign Up Flow with Trial
As a free or anonymous user who wants premium, I can:
1. Click "Upgrade to Premium" button from anywhere (navbar, expiration screen, rate limit error)
2. If not logged in, authenticate via OAuth first (Google/Apple/X/Facebook/GitHub)
3. Land on Stripe checkout page showing:
   - "$4.99/month after 7-day trial"
   - "200 audio generations/month, 100 saved items, permanent access, cross-device sync"
   - Credit card required
4. Enter payment details and complete checkout
5. Land back on the app with "Welcome to Premium! Your 7-day trial starts now." message
6. See my previously generated audio (if within 1-hour window) now marked as "Saved to Library"

**Pass criteria:**
- OAuth works for all 5 providers (Google, Apple, X, Facebook, GitHub)
- Stripe checkout clearly shows 7-day trial (no charge for 7 days, then $4.99/month)
- Credit card required upfront (trial requires payment method)
- Successful payment immediately grants premium access
- Trial cancellation before 7 days = no charge

---

### STORY 9: Premium User — Generation Limits & Extended Length
As a premium user, I can:
1. Generate audio from a URL and see "197 generations remaining this month" (starts at 200)
2. Generate 10 URLs back-to-back and see counter decrease
3. Paste a 10,000-word article and generate audio successfully (would fail for free users)
4. Paste a 26,000-word article and see error: "Article too long (26,000 words). Premium supports up to 25,000 words."
5. Reach 200 generations in a month and see: "Monthly generation limit reached (200/200). Resets on [date]."

**Pass criteria:**
- Generation counter is visible and accurate
- Word count limit is enforced at 25,000 for premium
- Long article TTS generation works (may take several minutes, show progress indicator)
- Monthly limit resets on subscription anniversary date

---

### STORY 10: Premium User — Library Management
As a premium user, I can:
1. Generate audio from a URL and see it automatically appear in my "Library" (accessible via navbar link)
2. Navigate to Library and see a list of saved audio items showing:
   - Article title
   - Source URL (truncated)
   - Date added
   - Playback progress indicator (e.g. "42% complete")
3. Click an item and resume playback from where I left off
4. Click "View Text" button and see the raw extracted article text in a modal or separate page
5. Save up to 100 items in my library
6. Attempt to save a 101st item and see prompt: "Library full (100/100). Delete an item to add more."
7. Delete an item from library (trash icon) and confirm deletion

**Pass criteria:**
- Library view works on desktop and mobile (responsive grid or list)
- Playback position syncs in real-time across devices
- Raw text view shows clean extracted article (same text used for TTS)
- Deletion is immediate (no page refresh needed)

---

### STORY 11: Premium User — Subscription Management
As a premium user, I can:
1. Navigate to Account Settings (navbar link)
2. See my subscription status: "Premium — $4.99/month — Next billing date: [date]" or "Trial (6 days remaining)"
3. Click "Manage Subscription" and be redirected to Stripe Customer Portal
4. In Stripe portal, cancel my subscription
5. Return to app and see: "Premium active until [end of billing period]. You will not be charged again."
6. After billing period ends, lose access to library and revert to free tier limits (3/hour, 1-hour expiry, 5k words)

**Pass criteria:**
- Stripe Customer Portal link works and shows correct subscription
- Cancellation is processed immediately in Stripe
- App reflects cancellation status correctly
- Downgraded users keep their OAuth account but lose premium features

---

### STORY 12: Refresh Behavior — Loading State Persistence
As any user generating audio, I can:
1. Submit a URL and see "Generating audio... Position in queue: 2"
2. Refresh the page mid-generation
3. See the same accurate loading indicator ("Generating audio... Position in queue: 1" if queue moved)
4. Wait for generation to complete and play audio normally

**Pass criteria:**
- Loading state persists across page refreshes (stored in DB or session)
- Queue position updates in real-time
- No broken state if user refreshes during generation

---

### STORY 13: Refresh Behavior — Playback Position Persistence
As any user with generated audio, I can:
1. Play audio to 50% completion
2. Refresh the page or close and reopen the browser
3. See the audio player with playback paused at 50%
4. Click play and resume from exactly where I left off

**Pass criteria:**
- Playback position is saved continuously (every 5 seconds or on pause)
- Works for both anonymous (cookie) and logged-in users (DB)
- No audio restart on page refresh

---

### STORY 14: Design & Universal Mobile Responsiveness
As any user on any device, I can:
1. Visit the site on iPhone Safari, Android Chrome, Samsung Internet — all show clean, mobile-optimized layout (no horizontal scroll, tap targets are large)
2. Visit on desktop Chrome, Firefox, Safari, Edge — all show the same design scaled appropriately
3. See consistent branding: deep blue accent (#1E40AF), off-white background (#FAFAFA), Inter font
4. Toggle dark mode (sun/moon icon in navbar) and see color scheme invert (dark bg, light text, adjusted blue accent)
5. See upgrade prompts as a subtle bottom banner (dismissible with X) — NOT intrusive modals (except on link expiration)

**Pass criteria:**
- No UI breaks on any major mobile browser (iOS Safari, Chrome, Firefox, Samsung Internet)
- No UI breaks on any major desktop browser (Chrome, Firefox, Safari, Edge)
- Dark mode preserves readability and contrast
- Design feels modern, not dated or generic
- All interactive elements are keyboard-accessible (tab navigation works)

---

### STORY 15: Embedded Chat Support
As any user, I can:
1. See a small chat icon in bottom-right corner with text "Talk directly to the CEO 😊" (or funnier variant)
2. Click it and see a chat widget open
3. Type a message: "How do I upgrade to premium?"
4. Receive a response from the CEO (routed directly to CEO agent)
5. Have a back-and-forth conversation about the product

**Pass criteria:**
- Chat widget works on mobile and desktop
- Messages deliver to CEO in real-time
- CEO can respond and user sees response in widget
- Chat history persists during session (not across browser closes for beta)
- CTA text is friendly and inviting

---

### STORY 16: Private Beta Access Control
As a beta tester, I can:
1. Receive a WhatsApp invite from founder with a unique beta access link (`https://[vercel-url]?invite=BETA-XXXXXXXX`)
2. Click link and land on app (beta banner: "Private Beta — You're one of the first 20 users!")
3. Use the app normally (all features work)
4. Create an account (OAuth) and see a banner: "Invite a friend to the beta" with "Get Invite Link" button
5. Click button and receive a unique single-use invite code to share
6. Share that code with one friend — it works once, then expires

As someone without a beta invite, I can:
1. Visit the app URL directly (without invite code)
2. See a waitlist page: "Audio Anything is in private beta. Join the waitlist for early access."
3. Enter my email and submit
4. See confirmation: "You're on the list! We'll email you when we launch."

**Pass criteria:**
- Beta access is gated (non-invitees can't access the app)
- Invite codes are unique (`BETA-XXXXXXXX` format, 8 alphanumeric chars)
- Each beta user gets exactly 1 invite to share (requires account creation)
- Founder has unlimited-use code (`BETA-FOUNDER`)
- OAuth users bypass invite check (already in system)
- Waitlist emails are collected (stored in Supabase)
- Full tracking: invite claimed, invalid code, waitlist signup events

---

## SHOULD-HAVE STORIES (High Priority, Not Ship-Blocking)

### STORY 17: Analytics Tracking
As the CEO, I can:
1. View PostHog dashboard and see events:
   - `url_submitted` (with URL domain, word count, user type)
   - `audio_generated` (with TTS duration, voice selected, success/failure)
   - `play_started` (with playback position, device type)
   - `playback_position_saved` (frequency, average listen %)
   - `link_expired_shown` (free users only)
   - `upgrade_clicked` (source: navbar, expiration screen, rate limit error)
   - `payment_completed` (revenue, user ID)
   - `beta_invite_claimed`, `beta_invite_invalid`, `waitlist_signup`
2. See funnels:
   - URL submitted → Audio generated → Played 50%+ → Upgrade clicked → Payment completed
3. Filter by user type (anonymous, free, premium), device (mobile vs desktop), date range

**Pass criteria:**
- All events fire correctly (tested in PostHog)
- Funnels show accurate conversion rates
- No PII (personally identifiable info) in event data except user ID

---

### STORY 18: CAPTCHA on Rate Limit Boundary
As a free user hitting rate limits, I can:
1. Submit my 3rd URL within an hour
2. See a CAPTCHA challenge before audio generation starts ("Verify you're human")
3. Complete CAPTCHA and proceed to audio generation

**Pass criteria:**
- CAPTCHA only appears on 3rd generation (not 1st or 2nd)
- Uses hCaptcha or similar (accessible, privacy-friendly)
- Failed CAPTCHA shows clear error and allows retry

---

## COULD-HAVE STORIES (Nice-to-Have, Not Required for Beta)

### STORY 19: Playback Speed Memory
As any user, I can:
1. Set playback speed to 1.5x
2. Generate a new audio file
3. See playback speed default to 1.5x (my last-used preference)

---

### STORY 20: Article Preview Before Generation
As any user, I can:
1. Paste a URL
2. See a preview: "Article detected: 'How to Build a Startup' — 3,200 words — Estimated audio: 13 minutes"
3. Confirm or cancel before generating

---

## TECHNICAL REQUIREMENTS

**Content Extraction:**
- Use Claude Code Agent SDK on backend to extract article text from HTML
- Prompt: "Extract the main article text from this webpage. Return only the article body — no ads, navigation, comments, or sidebars. **Preserve line breaks and paragraph structure.** If no discrete article is found, return an error explaining what's failing."
- Fallback: Offer manual text paste if extraction fails

**TTS:**
- Use **Piper TTS** (approved) — open-source, CPU-optimized
- Must support 4 distinct podcast-quality voices (2M, 2F)
- Must respect punctuation, pacing, and line breaks (not robotic)
- Deployment: Hetzner server (CPX21)
- Generation time: 2-5 minutes for 5,000-word article

**Infrastructure:**
- Frontend + API: Vercel (Next.js)
- TTS processing: Hetzner (Piper TTS server)
- Database: Supabase (Postgres)
- Auth: NextAuth.js with OAuth (Google, Apple, X, Facebook, GitHub) — **Start with Google/GitHub for beta**
- Payments: Stripe Checkout + Customer Portal (7-day trial, $4.99/month, test mode for beta)
- Analytics: PostHog (cloud free tier or self-hosted)
- Target cost: <$20/month for beta (excluding payment processing fees)

**Performance:**
- Audio generation: 2-5 minutes for 5k-word article (acceptable for beta)
- Page load: <2 seconds on 3G mobile
- Audio playback: No buffering on standard broadband

---

## DEFINITION OF DONE

**Must-have stories 1-16:** All pass QA verification in real browser (desktop + mobile, multiple browsers)

**Deployment:** Live on Vercel URL, accessible to beta testers with invite codes

**Founder acceptance:** Founder walks through all must-have stories and explicitly approves
