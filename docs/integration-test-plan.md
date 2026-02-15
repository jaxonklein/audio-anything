# Integration Test Plan
**Created**: 2026-02-15 03:40 UTC
**Author**: Theo Nakamura (@audio-anything-ic-engineer-1)
**Purpose**: Verify all real service integrations once credentials are provided

## Pre-Test Setup Checklist

Before testing, verify these environment variables are set:

### Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for NextAuth adapter)

### OAuth Providers
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- [ ] `GITHUB_ID` - GitHub OAuth app ID
- [ ] `GITHUB_SECRET` - GitHub OAuth app secret
- [ ] `NEXTAUTH_URL` - NextAuth callback URL (http://localhost:3000 for dev)
- [ ] `NEXTAUTH_SECRET` - NextAuth JWT secret (generate with: `openssl rand -base64 32`)

### TTS Service
- [ ] `ELEVENLABS_API_KEY` - ElevenLabs API key (starts with `xi_`)

### Content Extraction
- [ ] `ANTHROPIC_API_KEY` - Anthropic API key for Claude

### Payment (if implementing Story 14-15)
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret

---

## Test 1: Supabase Database Connection

**File**: `lib/supabase.ts`, `lib/db.ts`

### Test Steps:
1. Start dev server: `npm run dev`
2. Open browser console: `http://localhost:3000`
3. Open Network tab to monitor API calls
4. Expected: No connection errors in console

### Verification Commands (run in browser console or API route test):
```javascript
// Test 1A: Basic connection
const { data, error } = await supabase.from('users').select('*').limit(1);
console.log('Connection test:', error ? 'FAIL' : 'PASS', { data, error });
```

### Expected Results:
- ✅ PASS: Query returns data or empty array (no error)
- ❌ FAIL: Error with "Invalid API key" or connection timeout

### Troubleshooting:
- Verify Supabase project is not paused
- Check URL format: `https://[project-ref].supabase.co`
- Verify anon key matches project settings

---

## Test 2: Google OAuth Flow

**File**: `lib/auth-config.ts`, `app/api/auth/[...nextauth]/route.ts`

### Test Steps:
1. Navigate to: `http://localhost:3000`
2. Click "Sign In" button (Story 2 - not yet implemented in UI)
3. Should redirect to: `http://localhost:3000/auth/signin`
4. Click "Sign in with Google"
5. Should redirect to Google OAuth consent screen
6. Approve consent
7. Should redirect back to app, logged in

### Verification Checklist:
- [ ] OAuth consent screen appears
- [ ] After approval, redirected to app
- [ ] Session exists (check cookies: `next-auth.session-token`)
- [ ] User row created in Supabase `users` table
- [ ] No console errors

### Expected Database State:
```sql
-- Check user was created
SELECT * FROM users WHERE email = '[your-test-email]';
-- Should return 1 row with id, email, timestamps
```

### Troubleshooting:
- Error "redirect_uri_mismatch": Add `http://localhost:3000/api/auth/callback/google` to Google Console authorized redirects
- Error "invalid_client": Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET match Google Console
- No session cookie: Check NEXTAUTH_URL is set correctly

---

## Test 3: GitHub OAuth Flow

**File**: `lib/auth-config.ts`

### Test Steps:
1. Navigate to: `http://localhost:3000/auth/signin`
2. Click "Sign in with GitHub"
3. Should redirect to GitHub OAuth approval
4. Approve authorization
5. Should redirect back to app, logged in

### Verification Checklist:
- [ ] GitHub authorization page appears
- [ ] After approval, redirected to app
- [ ] Session exists (check cookies)
- [ ] User row created in Supabase `users` table
- [ ] No console errors

### Troubleshooting:
- Error "redirect_uri_mismatch": Add `http://localhost:3000/api/auth/callback/github` to GitHub App settings
- Error "incorrect_client_credentials": Verify GITHUB_ID and GITHUB_SECRET

---

## Test 4: ElevenLabs TTS Generation

**File**: `app/api/tts/route.ts`

### Test Steps:
1. Test with curl command:
```bash
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test of the ElevenLabs text to speech integration. The voice should sound natural and clear.", "voiceId": "male1"}' \
  --output test-male1.mp3
```

2. Play the generated `test-male1.mp3` file

3. Repeat for all 4 voices:
   - male1 (Adam)
   - male2 (Josh)
   - female1 (Rachel)
   - female2 (Bella)

### Verification Checklist:
- [ ] male1 generates valid MP3 audio
- [ ] male2 generates valid MP3 audio
- [ ] female1 generates valid MP3 audio
- [ ] female2 generates valid MP3 audio
- [ ] Audio sounds natural (not robotic)
- [ ] Audio matches requested text
- [ ] Response is audio/mpeg content type

### Expected Response:
- Status: 200 OK
- Content-Type: audio/mpeg
- Body: Binary MP3 data
- File size: ~50-200KB for test sentence

### Troubleshooting:
- Error 401 "Unauthorized": Verify ELEVENLABS_API_KEY is set and valid
- Error 429 "Quota exceeded": Free tier limit reached (10,000 chars/month)
- Stub audio returned: API key not configured, falls back to dummy MP3

---

## Test 5: Anthropic Content Extraction

**File**: `app/api/generate/route.ts` (needs update to use real Anthropic API)

### Current State:
Currently using placeholder content. Need to update to real Anthropic API call.

### Expected Implementation:
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  messages: [{
    role: 'user',
    content: `Extract and rewrite this article for audio narration: ${articleContent}`
  }]
});

const articleText = message.content[0].text;
```

### Test Steps:
1. Update `app/api/generate/route.ts` with real Anthropic call
2. Test with curl:
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/article", "voiceId": "male1"}' \
  -v
```

3. Check response contains extracted article text
4. Verify TTS generation happens with extracted text

### Verification Checklist:
- [ ] Article content extracted from URL
- [ ] Content formatted for narration (no HTML, proper formatting)
- [ ] TTS generated from extracted content
- [ ] Audio URL returned in response
- [ ] No API errors in logs

### Troubleshooting:
- Error 401: Verify ANTHROPIC_API_KEY is set
- Error 429: Rate limit exceeded
- Timeout: Article too long, implement chunking

---

## Test 6: End-to-End User Flow (Anonymous)

**Stories**: 1, 3, 4, 5, 12, 13

### Test Steps:
1. Open browser in incognito mode: `http://localhost:3000`
2. Paste URL into input: `https://example.com/article`
3. Click "Convert to Audio"
4. Wait for generation (should show "Processing...")
5. Audio player should appear with waveform
6. Click play - audio should play
7. Test playback controls:
   - Pause/resume
   - Seek to different position
   - Change playback speed (1x → 1.5x → 2x)
   - Switch voice (male1 → female1)
8. Refresh page - playback position should resume from last position
9. Generate 2 more articles (total 3)
10. Attempt 4th generation - should see rate limit warning

### Verification Checklist:
- [ ] URL input works
- [ ] Audio generates successfully
- [ ] Waveform displays
- [ ] Play/pause works
- [ ] Seek works
- [ ] Playback speed changes work (hear actual speed difference)
- [ ] Voice switching works (hear voice change)
- [ ] Playback position persists on refresh (cookie-based)
- [ ] Rate limiting works (3/hour for anonymous)
- [ ] Expiration warning shows at <5min remaining
- [ ] Link expires after 1 hour

---

## Test 7: End-to-End User Flow (Logged In)

**Stories**: 2, 6, 7, 8, 9, 10, 11

### Test Steps:
1. Sign in with Google or GitHub
2. Navigate to Library page
3. Should see empty state or previous audio items
4. Create new audio from URL
5. Verify audio item appears in Library
6. Click audio item - should navigate to player
7. Test playback position persistence:
   - Play for 30 seconds
   - Navigate away (back to Library)
   - Return to same audio item
   - Verify playback resumes from ~30 seconds
8. Test Library features:
   - Sort by newest/oldest
   - Search by title
   - Delete audio item

### Verification Checklist:
- [ ] OAuth sign-in works (Test 2 or 3)
- [ ] Library page shows user's audio items
- [ ] New audio items appear in Library
- [ ] Playback position persists (database-backed, not cookie)
- [ ] Sorting works
- [ ] Search works
- [ ] Delete works
- [ ] RLS enforced (can't see other users' audio)

### Database Verification:
```sql
-- Check audio items created
SELECT * FROM audio_items WHERE user_id = '[user-id]' ORDER BY created_at DESC;

-- Check playback positions saved
SELECT * FROM playback_positions WHERE user_id = '[user-id]';
```

---

## Test 8: Rate Limiting (Free vs Premium)

**Story**: 13

### Test 8A: Anonymous Rate Limiting
1. Open incognito browser
2. Generate 3 audio items (should succeed)
3. Attempt 4th generation immediately - should fail with "Rate limit reached"
4. Wait 1 hour, try again - should succeed

### Test 8B: Free User Rate Limiting
1. Sign in (don't subscribe)
2. Generate 200 audio items in a month (simulate with database inserts if needed)
3. Attempt 201st - should fail or show upgrade prompt

### Test 8C: Premium User (No Limit)
**Requires Stripe integration**
1. Sign in
2. Subscribe to premium ($4.99/month)
3. Generate >200 audio items - should succeed
4. Verify no rate limit warnings

---

## Test 9: Link Expiration

**Story**: 13 (Free users - 1 hour expiration)

### Test Steps:
1. Generate audio as anonymous user
2. Note the timestamp
3. After 55 minutes - should see warning banner
4. After 60 minutes - audio should be unplayable
5. Attempt to access expired audio URL - should return 404 or "Expired"

### Verification Checklist:
- [ ] Expiration warning shows at <5min remaining
- [ ] Countdown timer updates every second
- [ ] After expiration, audio can't be played
- [ ] Premium users have no expiration (test after Stripe integration)

---

## Test 10: Beta Access Gating

**Story**: 16

### Test Steps:
1. Navigate to app without invite code
2. Should redirect to `/waitlist`
3. See waitlist page with email form
4. Submit email - should show success message
5. Navigate with valid invite code: `http://localhost:3000?invite=BETA-FOUNDER`
6. Should bypass waitlist and access app

### Verification Checklist:
- [ ] Non-invited users redirected to waitlist
- [ ] Waitlist form works
- [ ] Invite code `BETA-FOUNDER` grants access
- [ ] Invite code stored in cookie (persists across sessions)
- [ ] Can generate additional codes for beta testers

---

## Test 11: Error Handling

### Test 11A: Invalid URL
1. Enter invalid URL: `not-a-url`
2. Should show error message: "Invalid URL"

### Test 11B: Network Error
1. Disconnect internet
2. Attempt to generate audio
3. Should show error message: "Network error, please try again"

### Test 11C: API Quota Exceeded (ElevenLabs)
1. Exceed ElevenLabs free tier (10,000 chars/month)
2. Should show error: "TTS quota exceeded" with upgrade prompt

### Test 11D: Article Too Long
1. Attempt to convert 10,000-word article
2. Should show warning: "Article exceeds 5,000 word limit"

---

## Test 12: Mobile Responsiveness

### Test Steps:
1. Open DevTools, switch to mobile view (iPhone 12 Pro)
2. Test all user flows on mobile viewport
3. Verify:
   - Input field usable
   - Audio player controls accessible
   - Waveform visible and interactive
   - Library page usable
   - OAuth flows work on mobile

---

## Success Criteria

All integration tests must PASS before proceeding to Stories 2, 6-11, 14-16 implementation:

- [x] Supabase connection verified
- [ ] Google OAuth flow complete
- [ ] GitHub OAuth flow complete
- [ ] ElevenLabs TTS generating quality audio for all 4 voices
- [ ] Anthropic content extraction working
- [ ] Anonymous user flow working end-to-end
- [ ] Logged-in user flow working end-to-end
- [ ] Rate limiting enforced correctly
- [ ] Link expiration working
- [ ] Beta access gating working
- [ ] Error handling graceful
- [ ] Mobile responsive

---

## Next Steps After Integration Tests Pass

1. Implement remaining UI components (Stories 2, 6-11, 14-16):
   - Sign-in page
   - Library page
   - Subscription flow

2. Self-verify all 16 must-have stories end-to-end in real browser

3. Report to CEO with evidence (screenshots, logs)

4. Deploy to Vercel before 6:00am CT deadline
