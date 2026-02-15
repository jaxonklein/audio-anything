# Stripe Setup Guide - Audio Anything

**Status:** In Progress
**Mode:** Test Mode (for private beta)

## Account Setup

### 1. Create Stripe Account
- Go to https://stripe.com
- Sign up with business email
- Complete account verification (can use test mode before full verification)

### 2. Test Mode Keys
**Location:** Dashboard → Developers → API Keys

Required environment variables:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Create Product & Price

**Product:**
- Name: "Audio Anything Premium"
- Description: "Save up to 100 audio summaries, unlimited generations, permanent access"

**Price:**
- Amount: $4.99 USD
- Billing: Recurring monthly
- Trial period: 7 days
- ID will be: `price_...` (save this as `STRIPE_PRICE_ID` in .env)

### 4. Webhook Configuration

**Endpoint URL:** `https://[vercel-url]/api/webhooks/stripe`

**Events to listen for:**
- `checkout.session.completed` — User completed payment
- `customer.subscription.created` — New subscription created
- `customer.subscription.updated` — Subscription changed (trial ended, canceled, etc.)
- `customer.subscription.deleted` — Subscription ended
- `invoice.payment_succeeded` — Monthly payment succeeded
- `invoice.payment_failed` — Payment failed

**Webhook signing secret:**
- Save as `STRIPE_WEBHOOK_SECRET` in .env
- Format: `whsec_...`

### 5. Customer Portal

**Configuration:**
- Enable "Cancel subscription"
- Enable "Update payment method"
- Enable "View invoices"
- Disable "Update subscription" (we only have one plan)

**Return URL:** `https://[vercel-url]/account/settings`

## Integration Checklist

- [ ] Stripe account created
- [ ] Test mode keys obtained
- [ ] Product created ("Audio Anything Premium")
- [ ] Price created ($4.99/month, 7-day trial)
- [ ] Webhook endpoint configured
- [ ] Webhook secret obtained
- [ ] Customer Portal configured
- [ ] Environment variables added to Vercel
- [ ] Test checkout flow (create test subscription)
- [ ] Test webhook delivery (use Stripe CLI or dashboard)
- [ ] Test Customer Portal (cancel, reactivate)

## Test Cards

Use these in test mode:

**Success:**
- `4242 4242 4242 4242` — Visa, no authentication
- Any future expiry date, any CVC

**Requires authentication:**
- `4000 0025 0000 3155` — Visa, requires 3D Secure

**Declined:**
- `4000 0000 0000 9995` — Always declined

## Environment Variables Summary

Add these to Vercel:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Go-Live Checklist (Post-Beta)

When moving to production:
- [ ] Complete Stripe account verification
- [ ] Switch to live mode keys
- [ ] Recreate product/price in live mode
- [ ] Update webhook endpoint to production URL
- [ ] Update environment variables to live keys
- [ ] Test full flow in live mode with real card
- [ ] Monitor first transactions closely

---

**Note:** For private beta, test mode is sufficient. No real payments will be processed.
