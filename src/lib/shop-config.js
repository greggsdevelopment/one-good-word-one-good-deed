/**
 * Shop payment configuration.
 *
 * STRIPE_CHECKOUT_ENABLED only controls which UI the shopper sees. The server
 * enforces its own copy of this switch, so flipping this on without setting
 * STRIPE_SECRET_KEY and STRIPE_CHECKOUT_ENABLED on the Base44 app just makes
 * the pay button fail cleanly and fall back to the email flow.
 *
 * Turn it on by setting VITE_STRIPE_CHECKOUT_ENABLED=true in the build
 * environment. Anything else, including unset, means off.
 */
export const STRIPE_CHECKOUT_ENABLED =
  import.meta.env.VITE_STRIPE_CHECKOUT_ENABLED === 'true';

/** Where shop orders and questions go. */
export const ORDER_EMAIL = 'greggsdevelopment@gmail.com';
