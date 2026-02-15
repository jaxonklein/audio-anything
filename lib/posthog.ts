import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window !== 'undefined') {
    // Only initialize if we have a PostHog API key
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

    if (apiKey) {
      posthog.init(apiKey, {
        api_host: host,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('PostHog initialized');
          }
        },
        capture_pageview: true, // Auto-capture page views
        capture_pageleave: true,
      });
    } else {
      console.warn('PostHog API key not found. Analytics disabled.');
    }
  }
}

export { posthog };
