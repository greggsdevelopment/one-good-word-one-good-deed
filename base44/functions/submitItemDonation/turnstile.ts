/**
 * Cloudflare Turnstile verification, shared by the public endpoints
 * (submitForm, submitItemDonation, createCheckout, supportChat, reportContent). Each function folder keeps
 * its own copy because Base44 functions cannot import from each other.
 *
 * Secrets on the Base44 app:
 *   TURNSTILE_SECRET_KEY  - from the Cloudflare Turnstile widget. When set,
 *                           every request must carry a valid, unused token.
 *   TURNSTILE_SITE_KEY    - the public half, served to the browser by the
 *                           publicConfig function.
 *
 * Until TURNSTILE_SECRET_KEY is set the check is skipped (and logged), so
 * publishing before the keys exist does not take the forms down.
 */

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Where a real token can come from: the live domain and Base44 previews.
const ALLOWED_HOSTS = ['ogwogd.org', 'www.ogwogd.org'];
const ALLOWED_SUFFIXES = ['.base44.app'];

// Cloudflare's published test secrets. Their tokens report hostname example.com.
const TEST_SECRET = /^[123]x0+AA$/;

async function readSecret(name: string): Promise<string | undefined> {
  try {
    // @ts-ignore base44:runtime exists on newer Base44 runtimes
    const runtime = await import('base44:runtime');
    const v = runtime?.secrets?.get?.(name);
    if (v) return String(v);
  } catch {
    // older runtime; fall back to env
  }
  try {
    return Deno.env.get(name) ?? undefined;
  } catch {
    return undefined;
  }
}

function clientIp(req: Request): string | undefined {
  const direct = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip');
  if (direct) return direct.trim();
  const fwd = req.headers.get('x-forwarded-for');
  return fwd ? fwd.split(',')[0].trim() : undefined;
}

export type HumanCheck = { ok: true; skipped?: boolean } | { ok: false; status: number; body: Record<string, unknown> };

const FAIL_MESSAGE = 'We could not confirm you are a person. Please refresh the page and try again.';

export async function verifyHuman(req: Request, token: unknown, expectedAction: string): Promise<HumanCheck> {
  const secret = await readSecret('TURNSTILE_SECRET_KEY');
  if (!secret) {
    console.warn(`turnstile: TURNSTILE_SECRET_KEY not set, skipping bot check for ${expectedAction}`);
    return { ok: true, skipped: true };
  }

  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return { ok: false, status: 403, body: { error: 'bot_check_failed', message: FAIL_MESSAGE } };
  }

  let result: any = null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(SITEVERIFY, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: clientIp(req), idempotency_key: crypto.randomUUID() }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    result = await res.json();
  } catch (err) {
    // Fail closed: if Cloudflare cannot vouch for the request, it does not go through.
    console.error('turnstile: siteverify unreachable', err);
    return { ok: false, status: 503, body: { error: 'bot_check_unavailable', message: 'Our spam check is not responding. Please try again in a minute.' } };
  }

  if (!result?.success) {
    console.warn('turnstile: rejected', expectedAction, result?.['error-codes']);
    return { ok: false, status: 403, body: { error: 'bot_check_failed', message: FAIL_MESSAGE } };
  }

  if (!TEST_SECRET.test(secret)) {
    const host = String(result.hostname || '').toLowerCase();
    const hostOk = ALLOWED_HOSTS.includes(host) || ALLOWED_SUFFIXES.some((s) => host.endsWith(s));
    if (!hostOk) {
      console.warn('turnstile: token from unexpected host', host);
      return { ok: false, status: 403, body: { error: 'bot_check_failed', message: FAIL_MESSAGE } };
    }
    if (result.action && result.action !== expectedAction) {
      console.warn('turnstile: token minted for a different action', result.action, 'expected', expectedAction);
      return { ok: false, status: 403, body: { error: 'bot_check_failed', message: FAIL_MESSAGE } };
    }
  }

  return { ok: true };
}
