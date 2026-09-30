import { base44 } from '@/api/base44Client';
import { getHumanToken } from '@/lib/turnstile';

/**
 * Sends a public form through the submitForm backend function. The database
 * no longer accepts form writes from the browser directly, so every public
 * form must use this.
 *
 * Returns { id, reference? } on success; throws an Error whose message is safe
 * to show the visitor on failure.
 */
export async function submitForm(form, data, { honeypot = '', device } = {}) {
  // Runs Cloudflare's bot check first; throws a readable error if it fails.
  const turnstile_token = await getHumanToken(`form-${form}`);
  let response;
  try {
    response = await base44.functions.invoke('submitForm', { form, data, website: honeypot, turnstile_token, device });
  } catch (err) {
    const payload = err?.response?.data || err?.data || {};
    const error = new Error(
      payload.message ||
        'Something went wrong sending that. Please try again, or email greggsdevelopment@gmail.com.',
    );
    error.field = payload.field || null;
    error.code = payload.error || 'failed';
    throw error;
  }
  const result = response?.data ?? response;
  if (!result?.success) {
    const error = new Error(result?.message || 'Something went wrong sending that. Please try again.');
    error.field = result?.field || null;
    throw error;
  }
  return result;
}
