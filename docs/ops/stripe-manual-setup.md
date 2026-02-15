# Stripe Manual Setup Instructions

**Engineer: Follow these steps to get Stripe test mode keys**

## 1. Create Stripe Account

1. Go to https://dashboard.stripe.com/register
2. Sign up with email
3. Skip business verification (test mode works without it)

## 2. Get API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** → starts with `pk_test_`
3. Reveal **Secret key** → starts with `sk_test_`

Add to `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 3. Create Product & Price

1. Go to https://dashboard.stripe.com/test/products
2. Click **+ Add product**
3. Fill in:
   - Name: `Audio Anything Premium`
   - Description: `Save up to 100 audio summaries, unlimited generations, permanent access`
4. Under **Pricing**:
   - Price: `$4.99 USD`
   - Billing period: `Monthly`
   - ✅ Add a free trial: `7 days`
5. Click **Save product**
6. Copy the **Price ID** (starts with `price_`) → add to `.env.local`:
   ```
   STRIPE_PRICE_ID=price_...
   ```

## 4. Configure Webhook

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **+ Add endpoint**
3. Endpoint URL: `https://[YOUR-VERCEL-URL]/api/webhooks/stripe`
   - (Replace `[YOUR-VERCEL-URL]` with actual Vercel deployment URL)
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Click on the endpoint → reveal **Signing secret** (starts with `whsec_`)
7. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## 5. Configure Customer Portal

1. Go to https://dashboard.stripe.com/test/settings/billing/portal
2. Click **Activate test link** (if not already active)
3. Enable:
   - ✅ Cancel subscription
   - ✅ Update payment method
   - ✅ View invoices
4. Disable:
   - ❌ Update subscription (we only have one plan)
5. Save changes

## Summary

You should now have 4 environment variables:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Add these to Vercel project settings once you deploy.

## Testing

Use Stripe test cards:
- Success: `4242 4242 4242 4242` (any future date, any CVC)
- Requires auth: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 9995`
