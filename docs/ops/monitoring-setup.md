# Monitoring Setup - Audio Anything

**Goal:** Track errors, uptime, and performance for private beta launch.

## 1. Error Tracking - Sentry

### Setup
1. Go to https://sentry.io
2. Create free account
3. Create new project:
   - Platform: Next.js
   - Project name: `audio-anything-beta`
   - Alert frequency: Real-time

### Integration

**Install:**
```bash
npm install @sentry/nextjs
```

**Configure:**
Run Sentry wizard:
```bash
npx @sentry/wizard@latest -i nextjs
```

This creates:
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- Updates `next.config.js`

**Environment Variable:**
```
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

### What to Track

**Automatic:**
- Unhandled exceptions
- Promise rejections
- API route errors

**Manual instrumentation:**
```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // risky operation
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'content-extraction' },
    extra: { url: submittedUrl }
  });
}
```

**Key events to track manually:**
- Content extraction failures
- TTS generation errors
- Payment failures
- OAuth failures

### Alert Rules

Configure in Sentry dashboard:

- **Critical:** Any error affecting checkout/payment → notify immediately
- **High:** Content extraction or TTS failures → notify if >5 in 10 min
- **Medium:** OAuth errors → notify if >3 in 10 min

## 2. Uptime Monitoring - UptimeRobot

### Setup
1. Go to https://uptimerobot.com
2. Create free account (50 monitors, 5-min intervals)
3. Add monitor:
   - Type: HTTP(S)
   - URL: `https://[vercel-url]/api/health`
   - Interval: 5 minutes
   - Alert contacts: Add email/Slack

### Health Check Endpoint

Create `/app/api/health/route.ts`:
```typescript
export async function GET() {
  // Basic health check
  const checks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    // Add checks for critical services:
    // - Database connection
    // - TTS server reachable
    // - Supabase accessible
  };

  return Response.json(checks);
}
```

## 3. Performance Monitoring - Vercel Analytics

### Setup
Vercel provides built-in analytics for free on hobby plan.

**Enable:**
1. Vercel Dashboard → Project → Analytics
2. Enable Web Analytics
3. Add to Next.js:

```bash
npm install @vercel/analytics
```

In `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Metrics Tracked
- Page load times
- Core Web Vitals (LCP, FID, CLS)
- Real user performance data

## 4. Application Logging - Vercel Logs

**Access:** Vercel Dashboard → Project → Logs

**Best practices:**
```typescript
// Use structured logging
console.log(JSON.stringify({
  level: 'info',
  message: 'Audio generation started',
  userId: user.id,
  url: submittedUrl,
  timestamp: new Date().toISOString()
}));

// For errors
console.error(JSON.stringify({
  level: 'error',
  message: 'TTS generation failed',
  error: error.message,
  stack: error.stack,
  context: { url, wordCount }
}));
```

## 5. TTS Server Monitoring

For Hetzner TTS server, add simple health endpoint and monitor it separately.

**UptimeRobot monitor #2:**
- URL: `http://[hetzner-ip]:PORT/health`
- Interval: 5 minutes
- Alert if down for >10 minutes

## Launch Day Monitoring Checklist

- [ ] Sentry project created and integrated
- [ ] UptimeRobot monitoring Vercel health endpoint
- [ ] UptimeRobot monitoring Hetzner TTS server
- [ ] Vercel Analytics enabled
- [ ] Alert emails configured
- [ ] Test alerts (trigger test error, verify notification)
- [ ] Dashboard access shared with CEO

## Monitoring During Beta

**First 24 hours:**
- Check Sentry every 2 hours for new errors
- Monitor uptime status (should be >99%)
- Review Vercel Analytics for performance issues

**After first week:**
- Review error trends weekly
- Optimize high-error areas
- Adjust alert thresholds based on real traffic

---

**Note:** All tools listed have free tiers sufficient for private beta (10-20 users).
