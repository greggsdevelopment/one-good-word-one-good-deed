/**
 * publicConfig
 *
 * Hands the browser the settings it is allowed to know. Today that is only the
 * Cloudflare Turnstile site key, which is public by design (it appears in the
 * page for every visitor). No secrets, no data, nothing written.
 *
 * Response: { turnstile_site_key: string }  (empty string when not configured)
 */

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

async function readSecret(name: string): Promise<string | undefined> {
  try {
    // @ts-ignore base44:runtime exists on newer Base44 runtimes
    const runtime = await import('base44:runtime');
    const v = runtime?.secrets?.get?.(name);
    if (v) return String(v);
  } catch {
    // older runtime
  }
  try {
    return Deno.env.get(name) ?? undefined;
  } catch {
    return undefined;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });
  const siteKey = (await readSecret('TURNSTILE_SITE_KEY')) || '';
  // Only ever a site key: short, alphanumeric. Refuse to echo anything else.
  const safe = /^[0-9A-Za-z_-]{10,64}$/.test(siteKey) ? siteKey : '';
  return new Response(JSON.stringify({ turnstile_site_key: safe }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=300', ...CORS_HEADERS },
  });
});
