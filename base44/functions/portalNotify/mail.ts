/** Sends plain-text email from the connected Gmail account. */

export function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function safeHeader(value: unknown): string {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim().slice(0, 150);
}

const EMAIL = /^[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]{2,}$/;
export const isEmail = (v: unknown) => typeof v === 'string' && EMAIL.test(v.trim());

export async function sendMail(base44: any, opts: { to: string | string[]; subject: string; text: string; replyTo?: string }) {
  const to = (Array.isArray(opts.to) ? opts.to : [opts.to]).map((x) => String(x).trim()).filter(isEmail).slice(0, 20);
  if (!to.length) return;
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const reply = opts.replyTo && isEmail(opts.replyTo) ? safeHeader(opts.replyTo) : '';
  const raw = base64UrlEncode(
    `To: ${to.map(safeHeader).join(', ')}\r\n` +
      `Subject: ${safeHeader(opts.subject)}\r\n` +
      (reply ? `Reply-To: ${reply}\r\n` : '') +
      'Content-Type: text/plain; charset=UTF-8\r\nMIME-Version: 1.0\r\n\r\n' +
      opts.text,
  );
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) throw new Error(`Gmail ${res.status}: ${await res.text()}`);
}
