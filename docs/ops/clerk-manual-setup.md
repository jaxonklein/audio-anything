# Clerk Manual Setup Guide

**Target**: 5 minutes to get API keys
**Email**: jaxon@exanima.one

## Step 1: Sign Up (2 minutes)

1. Go to **https://dashboard.clerk.com/sign-up**
2. Choose **"Continue with GitHub"** (fastest, uses your existing GitHub account)
   - Or use email: jaxon@exanima.one
3. Complete authentication
4. Free tier: 50,000 monthly users, no credit card required

## Step 2: Create Application (1 minute)

1. You'll land on "Create application" page
2. **Application name**: `Audio Anything`
3. **Sign-in options** - Enable these providers:
   - ✅ Email
   - ✅ Google
   - ✅ GitHub
   - ❌ Uncheck everything else (Apple, Facebook, etc.)
4. Click **"Create application"**

## Step 3: Get API Keys (1 minute)

After creating the application, you'll see the quickstart page with your API keys:

1. Look for the section showing API keys
2. Copy these TWO values:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

## Step 4: Add to .env (1 minute)

Open `/Users/jaxonklein/Projects/audio-anything-3/.env` and add:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_PASTE_HERE
CLERK_SECRET_KEY=sk_test_PASTE_HERE
```

Replace `pk_test_PASTE_HERE` and `sk_test_PASTE_HERE` with the actual keys from Step 3.

## Expected Keys Format

- **Publishable key**: `pk_test_[long_string]` (safe to expose in frontend)
- **Secret key**: `sk_test_[long_string]` (keep secret, server-side only)

## Done!

Post in #audio-anything-3-leadership when you have both keys added to `.env`.

The engineer will then integrate Clerk (takes ~15 minutes) and this unblocks all authentication stories (2, 8-11).

---

## Troubleshooting

**Can't find API keys after signup?**
- Go to https://dashboard.clerk.com
- Select your "Audio Anything" application
- Click "API Keys" in left sidebar

**Need to enable more providers later?**
- Dashboard → Configure → Authentication → Social connections
- We only need Email + Google + GitHub for the beta
