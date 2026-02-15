# Minimum Viable Launch Spec — Audio Anything Private Beta

**Context:** 10/16 acceptance stories complete, 3h 24min to 9am deadline. If we can't finish all 16 stories, what's the MINIMUM we can ship and still have a functional private beta?

**Philosophy:** Private beta with 10-20 invited users is forgiving. They're friends/colleagues who expect rough edges. We can launch with core flow working and iterate based on their feedback.

---

## Absolute Must-Have (Ship-Blocking)

These 7 stories are non-negotiable. Without these, the product doesn't work at all.

### ✅ Story 2: User Authentication (Clerk)
**Status:** Complete
**Why it's critical:** Can't have users without auth. No workarounds.

### ✅ Story 6: Voice Regeneration
**Status:** Complete
**Why it's critical:** If users hate the voice, they abandon immediately. Must be able to change it.

### ✅ Story 7: Error Handling
**Status:** Complete
**Why it's critical:** When ElevenLabs or Claude fails, users need to know why. Silent failures kill trust.

### ✅ Story 8: Stripe Payment Integration
**Status:** Complete
**Why it's critical:** Can't monetize without payments. The whole business model depends on this.

### 🚧 Story 1: Landing Page with Rate Limit Display
**Status:** In progress
**Why it's critical:** This is the first thing users see. Without it, they don't understand the product or the free vs premium value prop.
**Workaround if not done:** Ship with placeholder landing page that just says "Paste a URL below" - but this is bad UX.

### 🚧 Story 16: Beta Access Gating
**Status:** 90% complete (CEO built it, blocked on Supabase export fix)
**Why it's critical:** Without this, anyone can access the site. We'll get randos instead of invited beta users. Can't control the beta cohort.
**Workaround if not done:** Manually share the live URL only with beta users, trust they won't share it. Risky but possible for 24 hours.

### 🚧 Story 3: Rate Limiting (3/hour free, 200/month premium)
**Status:** Not started
**Why it's critical:** Without this, free users can abuse the system and run up ElevenLabs bills. Also, no incentive to upgrade.
**Workaround if not done:** Everyone is effectively premium on Day 1. Monitor usage manually, email heavy users to ask them to upgrade. Financially risky but survivable for 10-20 users.

---

## Should-Have (Degrades UX but not fatal)

These 4 stories significantly improve the experience but can be added post-launch.

### ✅ Story 10: Library Management
**Status:** Complete
**Why it's valuable:** Users want to revisit old content. Without this, every listen is ephemeral.
**If missing:** Users have to re-generate URLs to re-listen. Annoying but not blocking.

### ✅ Story 14: Dark Mode
**Status:** Complete
**Why it's valuable:** Many power users prefer dark mode. It's a polish feature.
**If missing:** Product works fine, just less polished. Can add in v1.1.

### ✅ Story 15: Chat Widget
**Status:** Complete
**Why it's valuable:** Direct line to CEO for feedback and support. Builds relationship with beta users.
**If missing:** Users email or DM via WhatsApp. Slower but workable.

### 🚧 Story 11: Playback Position Persistence
**Status:** In progress
**Why it's valuable:** If user closes tab, they lose their place in a 20-minute audio. Frustrating.
**If missing:** Users have to scrub back to where they were. Bad UX but not a showstopper.

---

## Nice-to-Have (Can ship without)

These 5 stories are polish and can definitely wait for post-beta.

### 🚧 Story 5: Link Expiration (1-hour for free tier)
**Status:** Not started
**Why it's valuable:** Creates urgency to upgrade. Part of the monetization strategy.
**If missing:** Free tier links last forever (like premium). We leave money on the table but product still works. Can add in v1.1 after observing user behavior.

### 🚧 Story 12: Mobile Responsiveness
**Status:** Not started
**Why it's valuable:** Some users will try it on mobile. Broken mobile = bad impression.
**If missing:** Tell beta users "Desktop only for now." They'll forgive it. Fix for public launch.

### 🚧 Story 13: Invite Code System
**Status:** Not started (CEO attempted, blocked)
**Why it's valuable:** Cleaner beta access UX - users enter code, get validated, see welcome message.
**If missing:** Use Story 16's cookie-based approach instead. Invite link with `?code=BETA-XXXXXXXX` sets a cookie, user is in. No code entry UI needed.

### ❓ Story 4: (Unknown - seems duplicate of Story 16 based on CEO's note)
**Status:** Unknown
**If duplicate:** Ignore, already covered by Story 16.

### ❓ Story 9: Database Schema
**Status:** Founder applying now
**Why it's valuable:** All database-dependent features need this (library, saved links, waitlist, invite codes).
**If missing:** None of those features work. But schema takes 2 minutes to apply - this WILL be done.

---

## Minimum Viable Launch: The 7-Story Version

If we run out of time, here's what we ship:

**Working stories:**
1. ✅ Story 2: User can sign up with Google/GitHub (Clerk)
2. ✅ Story 6: User can switch voices (4 options: 2M, 2F)
3. ✅ Story 7: Errors show helpful messages (not silent failures)
4. ✅ Story 8: User can start 7-day trial and enter payment info (Stripe)
5. ✅ Story 10: User can save links to library (if schema is applied)
6. ✅ Story 14: User can toggle dark mode
7. ✅ Story 15: User can chat with CEO via widget

**Workarounds for missing stories:**
- **No Story 1 (landing page):** Ship with basic heading + URL input. Ugly but functional.
- **No Story 16 (beta gating):** Only share URL with beta users via WhatsApp. Don't post publicly.
- **No Story 3 (rate limits):** Everyone is unlimited on Day 1. Monitor usage, manually ask heavy users to pay.
- **No Story 11 (playback position):** Users manually scrub to their position if they refresh.
- **No Story 5 (link expiration):** Free links last forever. Add expiration in v1.1.
- **No Story 12 (mobile):** Tell beta users "Desktop Chrome/Firefox/Safari only."
- **No Story 13 (invite codes):** Use direct links with cookie-based access (Story 16's approach).

**What this launch looks like:**
- 10-20 invited users get WhatsApp message: "Here's the link: [URL]. Desktop only, Chrome works best."
- They click link → sign up with Google → paste a URL → get audio → switch voice if needed → save to library
- If they love it → start 7-day trial → enter card → become paying customer
- If something breaks → chat widget to CEO → we fix it live

**Success criteria for 7-story launch:**
- At least 5 users generate audio successfully
- At least 1 user starts a trial
- No critical bugs that completely block usage
- Collect feedback via chat widget for v1.1 priorities

---

## Decision Framework: When to Reduce Scope

**Recommended cutoff times:**

### 8:00am CT (T-60min)
**If:** Fewer than 13 stories verified by QA
**Action:** CEO makes go/no-go decision
- **Go:** Ship with working stories + workarounds, email beta users about limitations
- **No-go:** Delay launch 6 hours (to 3pm CT), finish remaining stories

### 8:30am CT (T-30min)
**If:** Fewer than 10 stories verified
**Action:** Must reduce to 7-story minimum viable launch
- Update beta invite message to set expectations: "Early alpha, desktop only, expect rough edges"
- Ship what we have
- Fix remaining stories over next 48 hours based on beta feedback

### 8:45am CT (T-15min)
**If:** Fewer than 7 stories verified
**Action:** **DO NOT LAUNCH**
- Product is not viable even for friendly beta users
- Delay to 3pm CT or tomorrow 9am
- Would damage credibility to ship a completely broken product

---

## Communication Plan for Reduced Scope Launch

If we ship with <16 stories, the founder's WhatsApp invite message needs to set expectations.

### Full-scope message (16/16 stories):
Use Version C from `/src/growth/launch/private-beta-invite.md` as-is.

### Reduced-scope message (10-15 stories):
Prepend this to Version C:

> **Heads up:** You're getting access to a true beta - we shipped fast to get this in your hands. A few features are still being polished (mobile support, some UX refinements), but the core experience works great on desktop. Your feedback will directly shape v1.1.

### Minimum viable message (7-9 stories):
Replace Version C with:

> You're in the first 20 people to see Audio Anything. Fair warning: this is an alpha build. Desktop only (Chrome/Firefox/Safari), some rough edges, but the core magic works - paste a URL, get podcast-quality audio in seconds.
>
> I'm personally monitoring every user, so if something breaks, hit the chat widget and I'll fix it live. Your feedback shapes everything.
>
> Here's your link: [UNIQUE_LINK]
>
> Let's go. 🚀

---

## Post-Launch Iteration Priority (If Reduced Scope)

If we ship with <16 stories, here's the order to add missing features:

**Day 1 (within 6 hours of launch):**
1. Story 16: Beta gating (if missing) - prevents public access
2. Story 3: Rate limiting (if missing) - prevents cost blowout
3. Story 1: Landing page (if missing) - first impression matters

**Day 2:**
4. Story 12: Mobile responsiveness - some users will try mobile immediately
5. Story 11: Playback position - quality-of-life feature users will request

**Day 3-7:**
6. Story 5: Link expiration - monetization optimization
7. Story 13: Invite code UI - cleaner UX for future invites

---

## CEO/Founder Alignment Needed

@audio-anything-ceo, @jaxonklein — If we hit 8:00am and we're not at 13+ stories verified, I recommend making the go/no-go call:

**Option A: Ship reduced scope**
- Pros: Hit the deadline, get real user feedback today, iterate based on actual usage
- Cons: Rougher first impression, some features missing, may need to email beta users with workarounds
- Best if: We have 10+ stories working and the missing ones are nice-to-haves

**Option B: Delay 6 hours (launch 3pm CT)**
- Pros: More time to finish stories, better first impression, fewer workarounds
- Cons: Misses the 9am deadline, delays feedback loop by 6 hours
- Best if: We're at 8-10 stories and the missing ones are critical (like beta gating or rate limits)

**Option C: Delay 24 hours (launch Monday 9am CT)**
- Pros: Full breathing room, polish everything, zero technical debt
- Cons: Loses Sunday momentum, beta users might lose interest if already notified
- Best if: We're below 7 stories and the product isn't viable even for friendly users

I vote **Option A** if we hit 10+ stories. Private beta users are forgiving - they want to see the product, not perfection.

---

**Status:** Ready for CEO/founder review. This spec gives us a clear fallback plan if the sprint doesn't deliver all 16 stories by 8:45am.
