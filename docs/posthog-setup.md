# PostHog Analytics Setup

## Overview

Basic PostHog analytics tracking has been implemented for the private beta launch. This tracks 4 critical events:

1. **Page views** (auto-tracked)
2. **audio_generated** - When users successfully generate audio
3. **trial_started** - When users start a 7-day premium trial
4. **error** - Global error boundary catches

## Setup Steps

### 1. Create PostHog Account

1. Go to https://posthog.com/
2. Sign up for a free account
3. Create a new project called "Audio Anything"

### 2. Get API Key

1. In PostHog dashboard, go to **Project Settings**
2. Copy your **Project API Key** (starts with `phc_`)
3. Note your PostHog Host URL (usually `https://app.posthog.com` for cloud)

### 3. Add to Environment Variables

**Local development** (`.env.local`):
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Vercel deployment**:
1. Go to Vercel project settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_POSTHOG_KEY` = `phc_your_key_here`
   - `NEXT_PUBLIC_POSTHOG_HOST` = `https://app.posthog.com`
3. Redeploy

### 4. Verify Tracking

After deployment:
1. Visit your app and generate audio
2. Check PostHog dashboard → Live Events
3. You should see `$pageview` and `audio_generated` events

## Events Tracked

### audio_generated
**When**: User successfully generates audio from URL or text
**Properties**:
- `wordCount` - Number of words in article
- `isPremium` - Whether user has premium subscription
- `hasUrl` - Whether generation was from URL or text
- `voiceId` - Which voice was selected
- `source` - "url" or "text"

**Usage**: Track activation rate, identify popular voices, monitor usage by tier

### trial_started
**When**: User clicks "Start 7-Day Trial" and Stripe checkout session is created
**Properties**:
- `plan` - "premium"
- `price` - 4.99
- `trial_days` - 7

**Usage**: Track conversion funnel from free → trial

### error
**When**: Global error boundary catches an error
**Properties**:
- `error_message` - Error message text
- `error_digest` - Next.js error digest
- `error_stack` - Stack trace

**Usage**: Monitor production errors, identify bugs

### $pageview (auto-tracked)
**When**: User navigates to any page
**Properties**:
- `$current_url` - Full URL with query params

**Usage**: Track traffic, popular pages, user flow

## Key Dashboards to Create

### 1. Activation Funnel
1. Page view (/)
2. audio_generated
3. trial_started

**Goal**: Measure % of visitors who generate audio and convert to trial

### 2. Daily Active Users
- Track unique users per day
- Filter by authenticated vs anonymous

### 3. Audio Generation Metrics
- Total generations per day
- Average word count
- Voice popularity (group by voiceId)
- Free vs Premium usage

### 4. Error Monitoring
- Errors per day
- Group by error_message
- Alert if error rate > 5%

## Testing Analytics

To test locally without PostHog account:
1. Leave `NEXT_PUBLIC_POSTHOG_KEY` empty in `.env.local`
2. Analytics will be disabled with warning in console
3. App will function normally

## Future Enhancements

These events are **not yet implemented** but should be added post-launch:

- `rate_limit_shown` - User hits free tier limit
- `link_expired_shown` - User sees 1-hour expiration message
- `playback_position_saved` - Track listening behavior
- `chat_opened` - User opens CEO chat widget
- `payment_completed` - Trial converts to paid (via Stripe webhook)

## Notes

- PostHog is disabled if `NEXT_PUBLIC_POSTHOG_KEY` is not set
- No analytics = app still works, just no tracking
- PostHog automatically captures device, browser, location (anonymized)
- GDPR compliant - no PII tracked
