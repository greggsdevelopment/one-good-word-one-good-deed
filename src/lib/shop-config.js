/**
 * Shop configuration.
 *
 * Whether card payment is live is decided by the server, not by anything in
 * this build. Base44 secrets are backend only, so the checkout page asks the
 * createCheckout function directly with { probe: true } and renders the card
 * flow only when it answers { enabled: true }.
 *
 * To turn card payment on, set these secrets on the Base44 app:
 *   STRIPE_CHECKOUT_ENABLED = true
 *   STRIPE_SECRET_KEY       = sk_test_... or sk_live_...
 *   STRIPE_WEBHOOK_SECRET   = whsec_... (used by the stripeWebhook function)
 *
 * No frontend rebuild is needed. Unset any of the first two and the site falls
 * back to the email-an-order flow on its own.
 */

/** Where shop orders and questions go. */
export const ORDER_EMAIL = 'greggsdevelopment@gmail.com';
