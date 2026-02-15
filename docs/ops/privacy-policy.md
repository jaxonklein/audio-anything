# Privacy Policy - Audio Anything

**Last Updated:** February 15, 2026

## 1. Introduction

This Privacy Policy explains how Audio Anything ("we," "us," "our") collects, uses, and protects your information when you use our Service.

By using Audio Anything, you consent to the data practices described in this policy.

## 2. Information We Collect

### 2.1 Information You Provide

**Account Information (Premium Users Only):**
- OAuth provider information (name, email, profile photo from Google/Apple/X/Facebook/GitHub)
- Payment information processed by Stripe (we do not store credit card details)

**Content You Submit:**
- URLs you submit for audio generation
- Article titles and metadata extracted from submitted URLs

### 2.2 Automatically Collected Information

**Usage Data:**
- URLs submitted and generation timestamps
- Audio playback data (play/pause events, playback position, completion percentage)
- Rate limit consumption (requests per hour)
- Audio regeneration requests and voice selections

**Technical Data:**
- IP address (for rate limiting and abuse prevention)
- Browser type and version
- Device type (mobile/desktop)
- Operating system
- Timestamps of service access

**Cookies and Local Storage:**
- **Free Tier Cookie:** Stores a session identifier to track link expiry (1-hour lifespan) and rate limits
- **Playback Position Cookie:** Stores playback progress for active audio (expires with link)
- **Authentication Token:** OAuth session token for logged-in users
- **Analytics Cookies:** PostHog analytics tracking (see Section 2.3)

### 2.3 Analytics

We use PostHog (self-hosted) to collect anonymized usage analytics:
- Page views and navigation patterns
- Feature usage (voice selection, speed control, regeneration)
- Conversion funnel data (URL submission → playback → upgrade)
- Error events and performance metrics

Analytics data is anonymized and aggregated. We do not sell this data to third parties.

## 3. How We Use Your Information

### 3.1 To Provide the Service
- Extract content from submitted URLs
- Generate audio using text-to-speech
- Save playback positions for your audio library (premium users)
- Manage your subscription and billing

### 3.2 To Improve the Service
- Analyze usage patterns to improve features
- Debug errors and optimize performance
- Monitor service health and uptime

### 3.3 To Enforce Policies
- Prevent abuse and enforce rate limits
- Detect and block malicious activity
- Enforce our Terms of Service

### 3.4 To Communicate With You
- Send subscription-related emails (payment confirmations, expiration notices)
- Respond to support requests
- Send product updates (with option to opt out)

## 4. Data Sharing and Disclosure

### 4.1 Third-Party Service Providers

We share data with the following third parties to operate the Service:

**Stripe (Payment Processing):**
- Payment information (credit card, billing address)
- Email address
- Subscription status
- See [Stripe's Privacy Policy](https://stripe.com/privacy)

**OAuth Providers (Authentication):**
- Google, Apple, X (Twitter), Facebook, GitHub
- We receive: name, email, profile photo (as permitted by each provider)
- See each provider's respective privacy policy

**Anthropic Claude (Content Extraction):**
- Submitted URLs and extracted article text (processed server-side)
- No persistent storage of article content
- See [Anthropic's Privacy Policy](https://www.anthropic.com/privacy)

**Hosting Providers:**
- Vercel (frontend/API hosting)
- Hetzner (TTS server)
- Supabase (database)
- These providers have access to data stored on their infrastructure

### 4.2 Legal Requirements

We may disclose your information if required by law or in response to:
- Court orders or subpoenas
- Legitimate law enforcement requests
- Protection of our rights or safety
- Prevention of fraud or abuse

### 4.3 Business Transfers

If we are acquired or merge with another company, your information may be transferred to the new entity.

### 4.4 What We Do NOT Do

- We do NOT sell your personal information
- We do NOT share your data with advertisers
- We do NOT use your submitted content for training AI models (beyond immediate processing)

## 5. Data Retention

### 5.1 Free Tier Users
- Submitted URLs and generated audio: deleted after 1-hour link expiry
- IP address and rate limit data: retained for 24 hours
- Analytics data: retained indefinitely in anonymized form

### 5.2 Premium Users
- Account information: retained while your account is active
- Library items: retained until you delete them or cancel your subscription
- Playback positions: retained with library items
- After account deletion: all personal data deleted within 30 days

### 5.3 Payment Data
- Stored by Stripe, not by us
- Retained per Stripe's retention policy

## 6. Your Rights and Choices

### 6.1 Access and Correction
- Premium users can view and update account information in settings
- Contact us to request a copy of your data

### 6.2 Deletion
- Free tier: data auto-deletes after 1 hour
- Premium users: delete library items individually or delete entire account in settings
- Request full data deletion by contacting support

### 6.3 Opt-Out Options
- **Marketing emails:** Unsubscribe link in all marketing emails
- **Analytics:** Browser "Do Not Track" signals are respected
- **Cookies:** Clear cookies in your browser (may impact functionality)

### 6.4 Data Portability
- Premium users can export their library (URL list) from account settings
- Request a full data export by contacting support

## 7. Security

We implement reasonable security measures to protect your information:
- HTTPS encryption for all data in transit
- Encrypted storage for sensitive data at rest
- Secure OAuth authentication
- Payment processing via PCI-compliant Stripe
- Regular security audits and updates

However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.

## 8. Children's Privacy

Audio Anything is not intended for users under 13 years of age. We do not knowingly collect information from children under 13.

If we discover we have collected information from a child under 13, we will delete it immediately.

## 9. International Users

Our Service is hosted in the United States (US-East region). If you access the Service from outside this region, your information may be transferred to and processed in this region.

By using the Service, you consent to such transfers.

**GDPR (European Users):**
If you are in the EU/EEA, you have additional rights under GDPR:
- Right to access your data
- Right to rectification (correction)
- Right to erasure ("right to be forgotten")
- Right to restrict processing
- Right to data portability
- Right to object to processing
- Right to withdraw consent

To exercise these rights, contact us via the in-app chat widget.

**CCPA (California Users):**
California residents have the right to:
- Know what personal information is collected
- Request deletion of personal information
- Opt out of sale (we do not sell personal information)

## 10. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of significant changes by:
- Posting the new policy on this page
- Updating the "Last Updated" date
- Sending an email to premium users (for material changes)

Continued use of the Service after changes constitutes acceptance.

## 11. Contact Us

For privacy questions or to exercise your rights, contact us via the in-app chat widget.

---

**Note:** This document should be reviewed by legal counsel before public launch, especially for GDPR/CCPA compliance.
