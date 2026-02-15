# URGENT: Manual Account Setup Guide

**Time-sensitive:** Complete these 5 accounts in ~15 minutes total to unblock engineering.

## 1. ElevenLabs (5 minutes)

1. Go to https://elevenlabs.io/sign-up
2. Sign up with Google (fastest) or email
3. After signup, go to https://elevenlabs.io/app/settings/api-keys
4. Click "Generate API Key"
5. Copy the key (starts with `xi_`)
6. **Add to credentials doc:**
   ```
   ELEVENLABS_API_KEY=xi_[paste_key_here]
   ```

## 2. Supabase (3 minutes)

1. Go to https://supabase.com/dashboard
2. Sign in with GitHub (fastest)
3. Click "New Project"
4. Fill in:
   - Name: `audio-anything-beta`
   - Database Password: [generate strong password, save it]
   - Region: `East US (North Virginia)`
5. Click "Create new project" (takes ~2 minutes to provision)
6. While waiting, go to Project Settings → API
7. Copy these 3 values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=[Project URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon public key]
   SUPABASE_SERVICE_ROLE_KEY=[service_role secret key]
   ```
8. Go to SQL Editor → New Query
9. Paste contents from `supabase/migrations/20260215000000_initial_schema.sql`
10. Run the query

## 3. Google OAuth (3 minutes)

1. Go to https://console.cloud.google.com
2. Create new project: "Audio Anything Beta"
3. Enable APIs: Navigate to "APIs & Services" → "OAuth consent screen"
   - User Type: External
   - App name: "Audio Anything"
   - User support email: [your email]
   - Developer contact: [your email]
   - Save
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: Web application
   - Name: "Audio Anything Web"
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Create
5. Copy the credentials:
   ```
   GOOGLE_CLIENT_ID=[Client ID]
   GOOGLE_CLIENT_SECRET=[Client Secret]
   ```

## 4. GitHub OAuth (2 minutes)

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: "Audio Anything Beta"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Click "Generate a new client secret"
6. Copy the credentials:
   ```
   GITHUB_ID=[Client ID]
   GITHUB_SECRET=[Client Secret - copy immediately, only shown once]
   ```

## 5. Anthropic (2 minutes)

1. Go to https://console.anthropic.com
2. Sign in or create account
3. Go to "API Keys"
4. Click "Create Key"
5. Name: "Audio Anything Beta"
6. Copy the key:
   ```
   ANTHROPIC_API_KEY=sk-ant-[paste_key_here]
   ```

## Final Step: Consolidate Credentials

Create `.env.local` in project root with ALL credentials:

```bash
# ElevenLabs
ELEVENLABS_API_KEY=xi_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Google OAuth
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...

# GitHub OAuth
GITHUB_ID=...
GITHUB_SECRET=...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[run: openssl rand -base64 32]

# Stripe (if time permits)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Post Credentials to Engineer

Once all credentials are collected, post them to `#audio-anything-3-leadership` in this format:

```
✅ All credentials ready:

ELEVENLABS_API_KEY=xi_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...
ANTHROPIC_API_KEY=sk-ant-...
NEXTAUTH_SECRET=[run: openssl rand -base64 32]
```

Engineer will add these to `.env.local` and test all integrations immediately.

---

**ETA:** If starting now (3:40am), all credentials ready by 3:55am.
