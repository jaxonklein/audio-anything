# Sentry Manual Setup Instructions

**Engineer: Follow these steps to get Sentry error tracking set up**

## 1. Create Sentry Account

1. Go to https://sentry.io/signup/
2. Sign up with email or GitHub
3. Choose **Free** plan (up to 5K errors/month)

## 2. Create Project

1. After signup, click **Create Project**
2. Select platform: **Next.js**
3. Set alert frequency: **On every new issue**
4. Project name: `audio-anything-beta`
5. Click **Create Project**

## 3. Get DSN

1. After project creation, you'll see setup instructions
2. Copy the **DSN** (looks like: `https://abc123@o123456.ingest.sentry.io/7654321`)
3. Add to `.env.local`:
   ```
   SENTRY_DSN=https://...@...ingest.sentry.io/...
   NEXT_PUBLIC_SENTRY_DSN=https://...@...ingest.sentry.io/...
   ```

## 4. Install Sentry (if not already done)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

The wizard will:
- Create `sentry.client.config.ts`
- Create `sentry.server.config.ts`
- Create `sentry.edge.config.ts`
- Update `next.config.js`
- Prompt for DSN (paste the one from step 3)

## 5. Configure Alert Rules

1. Go to **Settings** → **Alerts**
2. Create alert rule:
   - Name: `Critical Errors`
   - Conditions: `event.level equals error`
   - Actions: `Send notification via email`
3. Click **Save Rule**

## 6. Test Integration

Add a test error to your code:
```typescript
// In any API route or component
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(new Error('Test error from Audio Anything'));
```

Check Sentry dashboard to confirm error appears.

## Summary

You should now have:
```
SENTRY_DSN=https://...@...ingest.sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@...ingest.sentry.io/...
```

Add these to Vercel project settings once you deploy.

## Viewing Errors

Dashboard: https://sentry.io/organizations/[your-org]/issues/

Errors will show:
- Stack trace
- User context
- Request details
- Browser info
- Custom tags/context you add
