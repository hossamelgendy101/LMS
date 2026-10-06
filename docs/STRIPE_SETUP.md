# Stripe Payment Integration Setup

## 1. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up or log in
3. Get your API keys from Developers → API keys
4. For testing, use the test keys (pk_test_*, sk_test_*)

## 2. Configure Environment Variables

Add to your `.env` file:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 3. Setup Stripe Webhook (Local Development)

Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe
```

Login and forward webhooks:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret and add it to `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 4. Test Payment

Use Stripe test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires 3D Secure**: `4000 0025 0000 3155`

Use any future date for expiry, any 3 digits for CVC, and any ZIP code.

## 5. Production Setup

1. Switch to live keys in Stripe Dashboard
2. Update `.env` with live keys
3. Setup webhook endpoint in Stripe Dashboard:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Deploy and test with a small real payment

## Payment Flow

1. User clicks "Buy Now" on course page
2. Redirected to `/checkout?courseId=xxx`
3. Checkout page creates PaymentIntent via `/api/payments/create-intent`
4. User enters card details via Stripe Elements
5. Payment confirmed → webhook processes enrollment
6. User redirected to success page

## Coupon System

Coupons are managed in the database. Use the seed data or create new ones:
- `WELCOME50` - 50% off
- `SUMMER25` - 25% off

Coupons support:
- Percentage or fixed amount discounts
- Usage limits
- Minimum purchase requirements
- Course-specific or global
- Date range validity
