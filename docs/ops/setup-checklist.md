# Audio Anything - Ops Setup Checklist

**Status**: Waiting for founder to answer tech stack questions
**Last Updated**: 2026-02-15 01:03 UTC

## Pending Decisions from Founder

1. **Database**: PostgreSQL, MongoDB, Supabase, or Firebase?
2. **OAuth Provider**: Google + GitHub, or other options (Apple, Twitter)?
3. **Payment Provider**: Stripe confirmed or other preference?
4. **Deployment**: Localhost only or production deployment today?
5. **Timeline**: Still shipping today with expanded scope?

---

## Setup Tasks (Execute After Founder Approval)

### 1. OAuth Setup
**Owner**: CoS (with engineering support if needed)
**Status**: Pending provider selection

- [ ] Create OAuth app(s) with selected provider(s)
- [ ] Get Client ID and Client Secret
- [ ] Configure callback URLs (localhost:3000 + production if applicable)
- [ ] Add to `.env`:
  ```
  OAUTH_CLIENT_ID=
  OAUTH_CLIENT_SECRET=
  NEXTAUTH_SECRET= (generate random string)
  NEXTAUTH_URL=http://localhost:3000
  ```

### 2. Payment Provider Setup
**Owner**: CoS
**Status**: Pending confirmation (assuming Stripe)

- [ ] Create Stripe account (or use existing)
- [ ] Create product: "Audio Anything Premium" at $4.99/month
- [ ] Get API keys (publishable + secret)
- [ ] Configure webhook endpoint for subscription events
- [ ] Add to `.env`:
  ```
  STRIPE_PUBLISHABLE_KEY=
  STRIPE_SECRET_KEY=
  STRIPE_WEBHOOK_SECRET=
  STRIPE_PRICE_ID= (for $4.99/month subscription)
  ```

### 3. Database Setup
**Owner**: CoS (with engineering input on schema)
**Status**: Pending database selection

**If PostgreSQL/Supabase:**
- [ ] Provision database instance
- [ ] Get connection string
- [ ] Add to `.env`:
  ```
  DATABASE_URL=
  ```

**If Firebase:**
- [ ] Create Firebase project
- [ ] Enable Firestore
- [ ] Get service account credentials
- [ ] Add to `.env`:
  ```
  FIREBASE_PROJECT_ID=
  FIREBASE_CLIENT_EMAIL=
  FIREBASE_PRIVATE_KEY=
  ```

**Schema Requirements** (for engineering):
- Users table (id, oauth_provider, oauth_id, email, subscription_status, created_at)
- Library table (id, user_id, article_url, article_title, audio_url, playback_position, created_at)
- Sessions table (anonymous session management with 2-hour expiry)

### 4. Environment Variables Consolidation
**Owner**: CoS
**Status**: Ready to execute once we have all credentials

Current `.env`:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ELEVENLABS_API_KEY=sk_4b1b3b7e2f8a5d6c9e0f1a2b3c4d5e6f7a8b9c0d
```

Add:
- OAuth credentials (see #1)
- Stripe credentials (see #2)
- Database credentials (see #3)
- NextAuth secret

### 5. Production Deployment (If Applicable)
**Owner**: CoS (coordinate with engineering)
**Status**: Pending decision

**If deploying to production today:**
- [ ] Choose hosting platform (Vercel recommended for Next.js)
- [ ] Set up production environment variables
- [ ] Configure custom domain (if applicable)
- [ ] Set up database in production
- [ ] Configure Stripe webhook to production URL
- [ ] Test OAuth callback URLs in production
- [ ] Set up monitoring/logging

---

## Risk Assessment

### Timeline Risks
- **Scope expansion**: Went from simple MVP to full SaaS with auth + payments + library
- **Complex integrations**: OAuth, Stripe, database, session management
- **If deadline is still TODAY**: High risk of incomplete implementation
- **Recommendation**: Clarify timeline with founder before committing

### Technical Risks
- **Payment integration**: Stripe webhooks, subscription management, edge cases
- **Session management**: Cookie-based 2-hour expiry for anonymous users
- **Library limits**: Enforcing 100-article cap, handling edge cases
- **Text extraction**: Quality varies by website structure

### Mitigation
- Start with MUST-HAVE stories only
- Use battle-tested libraries (NextAuth, Stripe SDK)
- Have fallback plan: ship anonymous flow first, add premium later

---

## Ready to Execute

As soon as founder answers the 5 questions, I can:
1. Set up OAuth apps (15 min)
2. Set up Stripe product + keys (15 min)
3. Provision database (15 min)
4. Update `.env` with all credentials (5 min)
5. Verify all integrations work (15 min)

**Total setup time**: ~1 hour once decisions are made

Standing by.
