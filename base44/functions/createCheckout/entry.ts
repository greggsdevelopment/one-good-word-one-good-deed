/**
 * createCheckout
 *
 * Builds a Stripe Checkout Session from a cart. Prices come from catalog.ts on
 * this server, never from the request body. The previous version of this file
 * read `unit_amount` straight off the client payload, which let anyone name
 * their own price. That is fixed here.
 *
 * Request  (POST, JSON):
 *   { items: [{ id: string, size?: string, quantity?: number }], email?: string }
 * Response (200):
 *   { url: string, order_number: string }
 * Errors return { error: <code>, message: string } with a 4xx/5xx status.
 *
 * There is also a probe:
 *   POST { probe: true }  ->  200 { enabled: boolean }
 * The checkout page calls it to find out whether card payment is actually live
 * before deciding which UI to show. Base44 secrets are backend only, so the
 * browser has no other way to know, and this keeps the switch in exactly one
 * place instead of two that can drift apart.
 *
 * Required secrets on the Base44 app:
 *   STRIPE_SECRET_KEY        - Stripe API key (sk_test_... or sk_live_...)
 *   STRIPE_CHECKOUT_ENABLED  - the string "true" to turn card payment on
 */

import Stripe from 'npm:stripe@14.21.0';
import {
  ALLOWED_RETURN_HOST_SUFFIXES,
  CATALOG,
  DEFAULT_RETURN_ORIGIN,
  MAX_LINES_PER_ORDER,
  MAX_QUANTITY_PER_LINE,
  SHIPPING_FLAT_CENTS,
} from './catalog.ts';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...CORS_HEADERS },
  });
}

/**
 * Base44 exposes secrets through the `base44:runtime` module on newer runtimes
 * and through Deno.env on older ones. Try both so this works either way.
 */
async function getSecret(name: string): Promise<string | undefined> {
  try {
    const runtime = await import('base44:runtime');
    const value = runtime?.secrets?.get?.(name);
    if (value) return String(value);
  } catch {
    // base44:runtime not available on this runtime; fall through to Deno.env
  }
  try {
    return Deno.env.get(name) ?? undefined;
  } catch {
    return undefined;
  }
}

/** Only let Stripe return the shopper to a host we recognise. */
function safeReturnOrigin(req: Request): string {
  const candidate = req.headers.get('origin') || '';
  try {
    const url = new URL(candidate);
    const host = url.hostname.toLowerCase();
    const allowed = ALLOWED_RETURN_HOST_SUFFIXES.some(
      (suffix) => host === suffix || host.endsWith(`.${suffix}`),
    );
    if (allowed) return url.origin;
  } catch {
    // not a valid URL
  }
  return DEFAULT_RETURN_ORIGIN;
}

function makeOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const noise = Math.floor(Math.random() * 46656)
    .toString(36)
    .toUpperCase()
    .padStart(3, '0');
  return `OGW-${stamp}-${noise}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return json({ error: 'method_not_allowed', message: 'Use POST.' }, 405);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    // An empty body is fine for the probe; anything else fails validation below.
    payload = {};
  }

  const enabled = (await getSecret('STRIPE_CHECKOUT_ENABLED')) === 'true';
  const secretKey = await getSecret('STRIPE_SECRET_KEY');

  // Probe. Answer before the guards below so the page can render the right UI
  // instead of showing a pay button that is guaranteed to fail.
  if (payload?.probe === true) {
    return json({ enabled: enabled && Boolean(secretKey) });
  }

  if (!enabled) {
    return json(
      {
        error: 'checkout_disabled',
        message: 'Card payment is not switched on yet. Order by email instead.',
      },
      503,
    );
  }

  if (!secretKey) {
    return json(
      {
        error: 'stripe_not_configured',
        message: 'STRIPE_SECRET_KEY is not set on this app.',
      },
      503,
    );
  }

  const rawItems = payload?.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return json({ error: 'no_items', message: 'Your cart is empty.' }, 400);
  }
  if (rawItems.length > MAX_LINES_PER_ORDER) {
    return json(
      { error: 'too_many_items', message: 'That cart has too many separate items.' },
      400,
    );
  }

  const lineItems: unknown[] = [];
  const orderLines: Array<{ id: string; s: string; q: number }> = [];

  for (const raw of rawItems) {
    const id = typeof (raw as Record<string, unknown>)?.id === 'string'
      ? String((raw as Record<string, unknown>).id)
      : '';

    if (!Object.prototype.hasOwnProperty.call(CATALOG, id)) {
      return json(
        { error: 'unknown_product', message: `We do not sell "${id}".` },
        400,
      );
    }
    const entry = CATALOG[id];

    const rawQty = (raw as Record<string, unknown>)?.quantity;
    const quantity = Math.trunc(Number(rawQty ?? 1));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_LINE) {
      return json(
        {
          error: 'invalid_quantity',
          message: `Quantity must be between 1 and ${MAX_QUANTITY_PER_LINE}.`,
        },
        400,
      );
    }

    const rawSize = (raw as Record<string, unknown>)?.size;
    const size = typeof rawSize === 'string' ? rawSize.trim().slice(0, 20) : '';

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: size ? `${entry.name} (${size})` : entry.name },
        unit_amount: entry.price_cents,
      },
      quantity,
    });
    orderLines.push({ id, s: size, q: quantity });
  }

  const origin = safeReturnOrigin(req);
  const orderNumber = makeOrderNumber();

  // Stripe caps a metadata value at 500 characters. Keep the cart compact and
  // trim rather than fail; the webhook can always re-read the real line items
  // from the session if this ever gets truncated.
  const itemsJson = JSON.stringify(orderLines);
  const itemsMeta = itemsJson.length <= 480 ? itemsJson : itemsJson.slice(0, 480);

  const rawEmail = payload?.email;
  const customerEmail =
    typeof rawEmail === 'string' && rawEmail.includes('@') && rawEmail.length <= 200
      ? rawEmail.trim()
      : undefined;

  try {
    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      client_reference_id: orderNumber,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      shipping_address_collection: { allowed_countries: ['US'] },
      phone_number_collection: { enabled: true },
      ...(SHIPPING_FLAT_CENTS > 0
        ? {
            shipping_options: [
              {
                shipping_rate_data: {
                  type: 'fixed_amount',
                  fixed_amount: { amount: SHIPPING_FLAT_CENTS, currency: 'usd' },
                  display_name: 'Standard shipping',
                },
              },
            ],
          }
        : {}),
      success_url: `${origin}/checkout?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?checkout=canceled`,
      metadata: {
        ogwogd_order_number: orderNumber,
        ogwogd_items: itemsMeta,
        ogwogd_items_truncated: itemsJson.length > 480 ? 'true' : 'false',
      },
    });

    if (!session.url) {
      return json(
        { error: 'stripe_no_url', message: 'Stripe did not return a checkout URL.' },
        502,
      );
    }

    return json({ url: session.url, order_number: orderNumber });
  } catch (error) {
    console.error('createCheckout failed', error);
    // Do not leak Stripe's internal message to the browser.
    return json(
      {
        error: 'stripe_error',
        message: 'We could not start checkout. Please try again or order by email.',
      },
      502,
    );
  }
});
