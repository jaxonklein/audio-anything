import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { checkPremiumStatus } from '@/lib/premium';

/**
 * GET /api/rate-limit
 * Get current rate limit status for the user
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    // Check if user has premium subscription
    const premiumStatus = userId ? await checkPremiumStatus(userId) : { isPremium: false };
    const isPremium = premiumStatus.isPremium;

    // Get current rate limit status
    const rateLimit = await checkRateLimit(userId, isPremium);

    return NextResponse.json({
      remaining: rateLimit.remaining,
      limit: rateLimit.limit,
      resetAt: rateLimit.resetAt.toISOString(),
      allowed: rateLimit.allowed,
    });
  } catch (error) {
    console.error('Rate limit status error:', error);
    return NextResponse.json(
      { error: 'Failed to check rate limit status' },
      { status: 500 }
    );
  }
}
