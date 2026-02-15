/**
 * Premium Feature Gating
 *
 * Checks if a user has an active premium subscription via Stripe
 */

import { createClient } from '@/lib/supabase';

export interface PremiumStatus {
  isPremium: boolean;
  subscriptionId?: string;
  status?: 'active' | 'trialing' | 'canceled' | 'past_due';
  currentPeriodEnd?: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}

/**
 * Check if user has active premium subscription
 */
export async function checkPremiumStatus(userId: string): Promise<PremiumStatus> {
  if (!userId) {
    return { isPremium: false };
  }

  const supabase = createClient();

  // Check for active subscription in users table
  // (subscription info would be stored after Stripe webhook updates)
  const { data: user, error } = await supabase
    .from('users')
    .select('stripe_subscription_id, stripe_subscription_status, stripe_current_period_end, stripe_trial_end, stripe_cancel_at_period_end')
    .eq('id', userId)
    .single();

  if (error || !user) {
    console.error('Premium status check error:', error);
    return { isPremium: false };
  }

  const isPremium =
    user.stripe_subscription_status === 'active' ||
    user.stripe_subscription_status === 'trialing';

  return {
    isPremium,
    subscriptionId: user.stripe_subscription_id,
    status: user.stripe_subscription_status as 'active' | 'trialing' | 'canceled' | 'past_due',
    currentPeriodEnd: user.stripe_current_period_end ? new Date(user.stripe_current_period_end) : undefined,
    trialEnd: user.stripe_trial_end ? new Date(user.stripe_trial_end) : undefined,
    cancelAtPeriodEnd: user.stripe_cancel_at_period_end || false
  };
}

/**
 * Premium feature limits
 */
export const FEATURES = {
  FREE: {
    generationsPerHour: 3,
    maxWordCount: 5000,
    linkExpiration: 60 * 60 * 1000, // 1 hour in ms
    canSaveToLibrary: false,
    canAccessHistory: false,
    maxLibraryItems: 0,
  },
  PREMIUM: {
    generationsPerMonth: 200,
    maxWordCount: 25000,
    linkExpiration: null, // No expiration
    canSaveToLibrary: true,
    canAccessHistory: true,
    maxLibraryItems: 1000,
  }
};

/**
 * Get feature limits for user tier
 */
export function getFeatureLimits(isPremium: boolean) {
  return isPremium ? FEATURES.PREMIUM : FEATURES.FREE;
}
