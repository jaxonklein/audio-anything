# Apply Supabase Schema

**Schema file**: `supabase/migrations/20260215000000_initial_schema.sql`

## Method 1: Supabase Dashboard (Fastest - 2 minutes)

1. Go to https://supabase.com/dashboard
2. Select your "Audio Anything" project
3. Click **"SQL Editor"** in left sidebar
4. Click **"New query"**
5. Copy the entire contents of `supabase/migrations/20260215000000_initial_schema.sql`
6. Paste into the SQL editor
7. Click **"Run"** (bottom right)
8. Verify success - should see "Success. No rows returned"

## Method 2: Supabase CLI (If installed)

```bash
cd /Users/jaxonklein/Projects/audio-anything-3
supabase db push
```

## Schema Contents

The migration creates:
- **users** table (integrates with Clerk auth)
- **audio_items** table (stores generated audio files)
- **playback_positions** table (resume functionality)
- Row Level Security (RLS) policies for data protection
- Performance indexes
- Auto-updating `updated_at` triggers

## Verify Schema Applied

After running, check in Supabase Dashboard → Table Editor:
- ✅ `users` table exists
- ✅ `audio_items` table exists
- ✅ `playback_positions` table exists

## Troubleshooting

**Error: "extension uuid-ossp does not exist"**
- Extensions should be auto-enabled in Supabase, but if not:
- Dashboard → Database → Extensions → Enable "uuid-ossp"

**Error: RLS policy issues**
- Make sure you're using the service role key for admin operations
- Regular anon key respects RLS policies
