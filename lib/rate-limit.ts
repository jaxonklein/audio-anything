/**
 * Rate Limiting Implementation
 * - Free users: 3 generations per hour
 * - Premium users: 200 generations per month
 *
 * Uses cookies for anonymous users
 * Uses database for authenticated users
 */

import { createClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  limit: number;
}

// Cookie name for storing generation timestamps
const GENERATIONS_COOKIE = 'generations';

/**
 * Check if user can generate audio
 */
export async function checkRateLimit(
  userId: string | null,
  isPremium: boolean
): Promise<RateLimitResult> {
  if (isPremium) {
    return checkPremiumRateLimit(userId!);
  }

  if (userId) {
    return checkAuthenticatedFreeRateLimit(userId);
  }

  return await checkAnonymousRateLimit();
}

/**
 * Premium users: 200 generations per month
 */
async function checkPremiumRateLimit(userId: string): Promise<RateLimitResult> {
  const supabase = createClient();

  // Get start of current month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Count generations this month
  const { count, error } = await supabase
    .from('audio_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', monthStart.toISOString())
    .lt('created_at', monthEnd.toISOString());

  if (error) {
    console.error('Rate limit check error:', error);
    return {
      allowed: true, // Fail open
      remaining: 200,
      resetAt: monthEnd,
      limit: 200
    };
  }

  const used = count || 0;
  const limit = 200;
  const remaining = Math.max(0, limit - used);

  return {
    allowed: remaining > 0,
    remaining,
    resetAt: monthEnd,
    limit
  };
}

/**
 * Authenticated free users: 3 generations per hour
 */
async function checkAuthenticatedFreeRateLimit(userId: string): Promise<RateLimitResult> {
  const supabase = createClient();

  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

  // Count generations in last hour
  const { count, error } = await supabase
    .from('audio_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', hourAgo.toISOString());

  if (error) {
    console.error('Rate limit check error:', error);
    return {
      allowed: true, // Fail open
      remaining: 3,
      resetAt: nextHour,
      limit: 3
    };
  }

  const used = count || 0;
  const limit = 3;
  const remaining = Math.max(0, limit - used);

  return {
    allowed: remaining > 0,
    remaining,
    resetAt: nextHour,
    limit
  };
}

/**
 * Anonymous users: 3 generations per hour (cookie-based tracking)
 */
async function checkAnonymousRateLimit(): Promise<RateLimitResult> {
  const now = Date.now();
  const limit = 3;
  const oneHourAgo = now - (60 * 60 * 1000);

  // Get generation timestamps from cookie
  const cookieStore = await cookies();
  const generationsCookie = cookieStore.get(GENERATIONS_COOKIE);

  let timestamps: number[] = [];
  if (generationsCookie?.value) {
    try {
      const parsed = JSON.parse(generationsCookie.value);
      // Filter to only timestamps within the last hour
      timestamps = parsed.filter((t: number) => t > oneHourAgo);
    } catch {
      timestamps = [];
    }
  }

  const count = timestamps.length;
  const remaining = Math.max(0, limit - count);
  const allowed = count < limit; // Fix Bug #1: Check count < limit to prevent off-by-one error

  // Calculate reset time (1 hour after oldest generation, or 1 hour from now if no generations)
  let resetAt: Date;
  if (timestamps.length > 0) {
    const oldestTimestamp = Math.min(...timestamps);
    resetAt = new Date(oldestTimestamp + 60 * 60 * 1000);
  } else {
    resetAt = new Date(now + 60 * 60 * 1000);
  }

  console.log(`[Rate Limit Check] count=${count}, limit=${limit}, allowed=${allowed}, remaining=${remaining}, timestamps=${timestamps.length}`);

  return {
    allowed,
    remaining,
    resetAt,
    limit
  };
}

/**
 * Increment rate limit counter after successful generation
 * Returns the cookie value to set (for anonymous users) or null
 */
export async function incrementRateLimit(
  userId: string | null,
  isPremium: boolean
): Promise<string | null> {
  if (!userId && !isPremium) {
    // Anonymous user - add timestamp to cookie
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    const cookieStore = await cookies();
    const generationsCookie = cookieStore.get(GENERATIONS_COOKIE);

    let timestamps: number[] = [];
    if (generationsCookie?.value) {
      try {
        const parsed = JSON.parse(generationsCookie.value);
        // Filter to only recent timestamps
        timestamps = parsed.filter((t: number) => t > oneHourAgo);
      } catch {
        timestamps = [];
      }
    }

    // Add current timestamp
    timestamps.push(now);

    const cookieValue = JSON.stringify(timestamps);
    console.log(`[Rate Limit Increment] Added timestamp, new count=${timestamps.length}`);

    return cookieValue;
  }

  // For authenticated users, the audio_items table insert automatically counts as usage
  return null;
}
