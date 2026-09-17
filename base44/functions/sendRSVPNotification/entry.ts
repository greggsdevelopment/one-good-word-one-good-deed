import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Base64url-encode a UTF-8 string for the Gmail API "raw" field.
function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export default async function(req) {
  try {
    const body = await req.json();
    const rsvp = body.rsvp || {};

    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const to = 'greggsdevelopment@gmail.com';
    const subject = 'New RSVP: A Night For Drayke';
    const emailBody = [
      'A new RSVP has been submitted for A Night For Drayke.',
      '',
      `Name: ${rsvp.full_name || 'Not provided'}`,
      `Email: ${rsvp.email || 'Not provided'}`,
      `Phone: ${rsvp.phone || 'Not provided'}`,
      `Adults attending: ${rsvp.adults_attending ?? 'Not provided'}`,
      `Children attending: ${rsvp.children_attending ?? 'Not provided'}`,
      `Message: ${rsvp.message || 'None'}`,
      '',
      `Submitted: ${rsvp.submitted_at || new Date().toISOString()}`
    ].join('\r\n');

    const rawMessage =
      `To: ${to}\r\n` +
      `Subject: ${subject}\r\n` +
      `Content-Type: text/plain; charset=UTF-8\r\n` +
      `MIME-Version: 1.0\r\n` +
      `\r\n` +
      emailBody;

    const raw = base64UrlEncode(rawMessage);

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ error: `Gmail API error: ${errorText}` }, { status: 500 });
    }

    const result = await response.json();
    return Response.json({ success: true, messageId: result.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}