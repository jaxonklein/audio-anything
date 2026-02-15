import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogClient(): PostHog | null {
  if (typeof window !== 'undefined') {
    // Don't initialize server client on client side
    return null;
  }

  if (!posthogClient) {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

    if (apiKey) {
      posthogClient = new PostHog(apiKey, {
        host,
      });
    } else {
      console.warn('PostHog API key not found. Server-side analytics disabled.');
    }
  }

  return posthogClient;
}

export async function trackEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, any>
) {
  const client = getPostHogClient();
  if (client) {
    client.capture({
      distinctId,
      event,
      properties,
    });
  }
}
