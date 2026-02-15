# Beta Access Control Spec — Audio Anything

## Problem
We need to gate private beta access to 10-20 invited users while:
1. Making it easy for the founder to distribute invites
2. Preventing unauthorized access (non-invitees can't use the app)
3. Tracking which invites are being used (analytics on conversion)
4. Preventing invite link sharing/leaks beyond intended testers

---

## Recommended Approach: Unique Invite Codes

### How It Works

**1. Pre-generate 20 unique invite codes + 1 founder code**
- Format: `BETA-XXXXXXXX` (8 random alphanumeric uppercase chars, e.g. `BETA-A3F9K2M7`, `BETA-P5X1Q8R4`)
- Harder to guess, looks more legitimate than 4-char codes
- Special founder code: `BETA-FOUNDER` (unlimited uses, never expires, for testing/demos)
- Store in database: `beta_invites` table with columns:
  - `code` (unique, indexed)
  - `created_at`
  - `used_at` (null until first use)
  - `used_by_user_id` (null until claimed)
  - `usage_count` (how many times this code was used)
  - `max_uses` (default: 1 for beta codes, unlimited for `BETA-FOUNDER`)

**2. Founder distributes invite links via WhatsApp**
- Each invite link: `https://audioanything.com?invite=BETA-XXXXXXXX`
- Founder copies from a list we provide (or we generate personalized messages with codes embedded)
- Each code is single-use (strict control for private beta — first person to use it "claims" it)

**3. User experience on first visit**

**Scenario A: User has valid invite code in URL**
- User clicks `https://audioanything.com?invite=BETA-XXXXXXXX`
- Backend validates code:
  - Code exists? ✅
  - Code already used? ❌ → Show "This invite has already been claimed"
  - Code valid? ✅ → Set cookie `beta_access=BETA-XXXXXXXX`, mark code as used, allow access
- User sees beta banner: "Private Beta — You're one of the first 20 users!"
- Cookie persists indefinitely (permanent beta access once claimed)

**Scenario B: User has no invite code but has beta_access cookie**
- User returns to `https://audioanything.com` (no `?invite=` in URL)
- Backend checks cookie: `beta_access=BETA-XXXXXXXX`
- Validates code in cookie is still valid → allow access
- User bypasses invite check on subsequent visits

**Scenario B2: User is logged in via OAuth (premium or free account)**
- User visits `https://audioanything.com` and is authenticated via OAuth session
- Backend recognizes authenticated user → bypass invite code check entirely
- Rationale: If they're already in the system with an account, they have access (either they claimed a beta code earlier or signed up for premium)

**Scenario C: User has no invite code and no cookie**
- User visits `https://audioanything.com` directly
- Backend finds no `?invite=` param and no `beta_access` cookie
- Redirect to `/waitlist` page:
  - "Audio Anything is in private beta."
  - Email capture form
  - "Join the waitlist for early access"

**Scenario D: User has invalid/expired invite code**
- User clicks `https://audioanything.com?invite=FAKE-1234`
- Backend validates: code doesn't exist
- Show error: "Invalid invite code. Join the waitlist: [link to /waitlist]"

---

## Preventing Invite Sharing

### Decision: Single-Use Codes (Strict Control)
- Each code can only be claimed once (`max_uses = 1`)
- First person to use `BETA-XXXXXXXX` claims it, subsequent users see "already claimed"
- **Why:** Tight control for private beta, prevent accidental viral spread
- **Exception:** `BETA-FOUNDER` has unlimited uses for founder's testing/demos

---

## Tracking & Analytics

### Events to Track
1. **`invite_code_viewed`** — someone landed on the site with `?invite=BETA-XXXX` (before validation)
2. **`invite_code_claimed`** — code was valid and user gained access (sets cookie)
3. **`invite_code_invalid`** — code was invalid/already used
4. **`beta_access_cookied`** — returning user accessed via cookie (no new code needed)
5. **`waitlist_viewed`** — non-invited user hit the waitlist page
6. **`waitlist_signup`** — email submitted on waitlist

### Analytics Dashboard (PostHog)
- **Invite conversion rate:** `invite_code_claimed` / `invite_code_viewed`
- **Code usage:** Which codes were claimed? Which weren't?
- **Returning beta users:** How many return visits via cookie vs new invite clicks?
- **Waitlist growth:** How many non-invitees tried to access?

---

## Engineering Implementation

### Database Schema

```sql
CREATE TABLE beta_invites (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,  -- e.g. "BETA-A3F9K2M7" or "BETA-FOUNDER"
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP NULL,            -- when first claimed
  used_by_user_id INT NULL,          -- which user claimed it (if logged in)
  usage_count INT DEFAULT 0,         -- how many times used
  max_uses INT DEFAULT 1,            -- 1 = single-use, 9999 = unlimited (for BETA-FOUNDER)
  notes TEXT NULL                    -- optional: "Sent to John Doe" or "Founder demo code"
);

CREATE INDEX idx_beta_invites_code ON beta_invites(code);
```

### API Endpoint: Validate Invite Code

**Request:**
```
GET /api/beta/validate?code=BETA-A3F9K2M7
```

**Response (valid, unclaimed):**
```json
{
  "valid": true,
  "code": "BETA-A3F9K2M7",
  "message": "Welcome to the private beta!"
}
```

**Response (already claimed — single-use code):**
```json
{
  "valid": false,
  "code": "BETA-A3F9K2M7",
  "message": "This invite has already been claimed."
}
```

**Response (valid, unlimited uses — BETA-FOUNDER):**
```json
{
  "valid": true,
  "code": "BETA-FOUNDER",
  "message": "Welcome to the private beta!"
}
```

**Response (invalid):**
```json
{
  "valid": false,
  "code": "FAKE-12345678",
  "message": "Invalid invite code."
}
```

### Frontend Flow

**On page load (`pages/index.tsx` or similar):**

```typescript
// Check if user is authenticated via OAuth
const isAuthenticated = await checkAuthSession(); // NextAuth or similar

if (isAuthenticated) {
  // User is logged in — bypass invite code check
  showBetaBanner(); // Optional: "Private Beta" banner
  trackEvent('beta_access_authenticated');
  return; // Allow access
}

// Check URL for invite code
const urlParams = new URLSearchParams(window.location.search);
const inviteCode = urlParams.get('invite');

// Check cookie for existing beta access
const betaCookie = getCookie('beta_access');

if (inviteCode) {
  // User has invite code in URL — validate it
  const response = await fetch(`/api/beta/validate?code=${inviteCode}`);
  const data = await response.json();

  if (data.valid) {
    // Valid code — set cookie (indefinite) and grant access
    setCookie('beta_access', inviteCode, 365); // 1 year (effectively indefinite)
    showBetaBanner(); // "You're one of the first 20 users!"
    trackEvent('invite_code_claimed', { code: inviteCode });
  } else {
    // Invalid or already claimed
    showError(data.message);
    trackEvent('invite_code_invalid', { code: inviteCode });
    redirectToWaitlist();
  }
} else if (betaCookie) {
  // Returning user with beta cookie — allow access
  showBetaBanner();
  trackEvent('beta_access_cookied', { code: betaCookie });
} else {
  // No invite code, no cookie, not authenticated — redirect to waitlist
  trackEvent('waitlist_viewed');
  redirectToWaitlist();
}
```

---

## Founder's Invite Distribution Kit

**What we provide to the founder:**

1. **List of 20 invite codes + 1 founder code** (generated and stored in DB)
   - Beta codes: `BETA-A3F9K2M7`, `BETA-K2M7P5X1`, `BETA-P5X1Q8R4`, etc. (8 random chars)
   - Founder code: `BETA-FOUNDER` (unlimited uses, for testing/demos)

2. **Invite link template:**
   ```
   https://audioanything.com?invite=BETA-XXXXXXXX
   ```

3. **WhatsApp message template** (from `private-beta-invite.md`)
   - Founder copies, replaces `[UNIQUE_LINK]` with actual invite link
   - Sends via WhatsApp to each beta tester

4. **Spreadsheet tracking (optional):**
   - Column 1: Beta tester name
   - Column 2: Invite code assigned
   - Column 3: Invite link
   - Column 4: Claimed? (check PostHog dashboard or query DB)

---

## Waitlist Page (`/waitlist`)

**Design:**
- Headline: "Audio Anything is in private beta."
- Subhead: "Join the waitlist for early access."
- Email input + submit button
- Confirmation: "You're on the list! We'll email you when we launch."

**Backend:**
- Store emails in `waitlist` table
- No verification email needed (beta only)
- Track `waitlist_signup` event in PostHog

---

## Alternative Approach: Magic Links (Not Recommended)

**How it would work:**
- Founder enters beta tester emails into admin panel
- We email each person a unique magic link (e.g. `https://audioanything.com/beta/magic-token-123`)
- Link is single-use, expires after 7 days
- First click grants permanent cookie access

**Why we're not doing this:**
- Founder wants to send via WhatsApp, not email
- Adds complexity (email delivery, magic link expiry)
- Invite codes are simpler and more flexible

---

## Recommendations

1. **Use unique single-use invite codes** (`BETA-XXXX` format)
2. **Track usage with PostHog events** (claimed, invalid, returning user)
3. **Set cookie on first valid access** (persists 30 days)
4. **Redirect non-invitees to waitlist page** (capture emails for public launch)
5. **Provide founder with 20 pre-generated codes** in a simple list or spreadsheet

---

## Final Decisions (CEO Approved)

1. **Code format:** `BETA-XXXXXXXX` (8 random alphanumeric uppercase chars) ✅
2. **Max uses per code:** 1 (strict control for private beta) ✅
3. **Cookie expiry:** Indefinite (permanent beta access once claimed) ✅
4. **Founder demo code:** `BETA-FOUNDER` with unlimited uses ✅
5. **OAuth bypass:** Authenticated users (via OAuth) bypass invite code check entirely ✅

**Ready for engineering implementation.**
