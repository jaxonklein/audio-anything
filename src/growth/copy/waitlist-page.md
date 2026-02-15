# Waitlist Page Copy — Audio Anything

## Full-Page Layout (for non-beta users)

### Headline
**Audio Anything is in private beta.**

### Subhead
We're testing with a small group first. Join the waitlist for early access.

---

### Email Capture Form

**Input placeholder:** "your@email.com"

**Submit button:** "Join the Waitlist"

**Confirmation message (after submit):**
✅ **You're on the list!**
We'll email you when we open up. (Usually within 2 weeks.)

---

### What is Audio Anything? (explainer section)

**Paste any URL. Get a podcast.**

Turn articles, blogs, and PDFs into high-quality audio narration. Listen on your commute, at the gym, or while cooking dinner.

**How it works:**
1. Paste a link to an article, blog post, or PDF
2. Pick a voice (we have 4 podcast-quality options)
3. Listen instantly — or save it for later

**Why Audio Anything?**
- Reading takes focus. Listening fits into your life.
- No robotic voices — ours sound human.
- Works on mobile and desktop, syncs across devices.

---

### Social Proof (if we have beta testimonials)

**What beta users are saying:**

> "Finally, a way to catch up on my reading backlog without actually reading."
> — [Beta User Name], [Title/Company]

> "The voices are shockingly good. I thought it was a real person at first."
> — [Beta User Name], [Title/Company]

> "I've been waiting for this product for years."
> — [Beta User Name], [Title/Company]

---

### CTA (bottom of page)

**Ready to turn the web into your personal podcast?**

[Join the Waitlist]

---

## Variant: Minimal Version (if we want less text)

**Headline:** Audio Anything is in private beta.

**Subhead:** Paste any URL, get a podcast-style audio summary. Join the waitlist for early access.

**Email input + button**

**Confirmation:** ✅ You're on the list. We'll email you soon.

---

## Variant: Mystery/Hype Version (if we want to build intrigue)

**Headline:** Something's coming.

**Subhead:** We're building a better way to consume the web. Private beta launching soon.

**Email input placeholder:** "Get early access"

**Button:** "Join the Waitlist"

**Confirmation:** ✅ You're in. Check your email in a few weeks.

---

## Design Notes

- **Tone:** Friendly, not corporate. Conversational but not overly casual.
- **Visuals:** Show a mockup of the audio player or a demo GIF (if available)
- **CTA color:** High contrast (blue or green button on off-white background)
- **Mobile-first:** Email input should be large and easy to tap on mobile

---

## Backend Requirements

**Email storage:**
- Table: `waitlist` with columns: `email`, `created_at`, `source` (for tracking where they came from)
- No email verification needed for beta — just collect and store
- Track `waitlist_signup` event in PostHog

**Confirmation:**
- Show in-page confirmation message (no redirect)
- Optional: Send confirmation email ("Thanks for joining! We'll be in touch soon.")

---

## Recommendation

Use the **full-page layout** for private beta. It's informative without being overwhelming, builds hype without overpromising, and captures emails with a clear value prop.

Once we go public, we can switch to the minimal version or remove the waitlist entirely.
