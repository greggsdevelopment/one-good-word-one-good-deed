/**
 * stripeWebhook
 *
 * The only thing that creates Order records. Stripe calls this endpoint after a
 * payment completes, the signature is verified against STRIPE_WEBHOOK_SECRET,
 * and the Order is written with the amount Stripe actually charged. Nothing in
 * the browser can create an order this way, and a shopper who closes the tab
 * right after paying still gets recorded.
 *
 * Endpoint to register in the Stripe dashboard:
 *   https://<your app domain>/functions/stripeWebhook
 * Event to subscribe to:
 *   checkout.session.completed
 *
 * Required secrets on the Base44 app:
 *   STRIPE_SECRET_KEY      - Stripe API key (sk_test_... or sk_live_...)
 *   STRIPE_WEBHOOK_SECRET  - signing secret for this endpoint (whsec_...)
 *
 * Always returns 200 once the signature checks out, even when the event is
 * ignored. Stripe retries anything non-2xx, and retrying an event we chose to
 * skip accomplishes nothing.
 */

import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

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

function cents(value: number | null | undefined): number {
  return Math.round((value ?? 0)) / 100;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  const secretKey = await getSecret('STRIPE_SECRET_KEY');
  const webhookSecret = await getSecret('STRIPE_WEBHOOK_SECRET');
  if (!secretKey || !webhookSecret) {
    console.error('stripeWebhook: STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is not set');
    return json({ error: 'stripe_not_configured' }, 503);
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return json({ error: 'missing_signature' }, 400);
  }

  // Must be the raw body. Do not call req.json() before this.
  const rawBody = await req.text();

  const stripe = new Stripe(secretKey);

  let event: Stripe.Event;
  try {
    // constructEventAsync, not constructEvent: signature verification has to be
    // async on Deno because it uses Web Crypto rather than Node's crypto.
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
      undefined,
    );
  } catch (error) {
    console.error('stripeWebhook: signature verification failed', error);
    return json({ error: 'invalid_signature' }, 400);
  }

  if (event.type !== 'checkout.session.completed') {
    return json({ received: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== 'paid') {
    return json({ received: true, skipped: 'not_paid' });
  }

  try {
    const base44 = createClientFromRequest(req);
    // Stripe is not a logged-in user, so service role is required to write.
    const orders = base44.asServiceRole.entities.Order;

    // Idempotency. Stripe retries on any hiccup and can deliver the same event
    // more than once, so never let one payment become two orders.
    const existing = await orders.filter({ stripe_session_id: session.id });
    if (Array.isArray(existing) && existing.length > 0) {
      return json({ received: true, duplicate: true });
    }

    // Read the real line items back from Stripe rather than trusting metadata.
    let itemsJson = session.metadata?.ogwogd_items ?? '[]';
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
      });
      itemsJson = JSON.stringify(
        lineItems.data.map((line) => ({
          name: line.description ?? '',
          quantity: line.quantity ?? 1,
          unit_price: cents(line.price?.unit_amount),
          line_total: cents(line.amount_total),
        })),
      );
    } catch (error) {
      console.error('stripeWebhook: could not list line items, falling back to metadata', error);
    }

    const details = session.customer_details ?? ({} as Stripe.Checkout.Session.CustomerDetails);
    const shipping =
      (session as unknown as { shipping_details?: { address?: Stripe.Address } })
        .shipping_details?.address ?? details.address ?? ({} as Stripe.Address);

    await orders.create({
      order_number: session.client_reference_id || session.metadata?.ogwogd_order_number || session.id,
      customer_name: details.name || 'Stripe customer',
      email: details.email || session.customer_email || 'unknown@ogwogd.org',
      address: [shipping.line1, shipping.line2].filter(Boolean).join(', '),
      city: shipping.city || '',
      state: shipping.state || '',
      zip: shipping.postal_code || '',
      items: itemsJson,
      total: cents(session.amount_total),
      status: 'pending',
      stripe_session_id: session.id,
      stripe_payment_intent:
        typeof session.payment_intent === 'string' ? session.payment_intent : '',
      payment_status: session.payment_status,
    });

    return json({ received: true, created: true });
  } catch (error) {
    console.error('stripeWebhook: failed to record order', error);
    // 500 here is deliberate: the signature was valid and the payment is real,
    // so we want Stripe to retry until the order lands.
    return json({ error: 'order_write_failed' }, 500);
  }
});
