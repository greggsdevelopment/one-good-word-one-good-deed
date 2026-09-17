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

// Sanitize any dynamic value before it lands in an email header.
// Strips carriage returns, line feeds, and all control characters,
// collapses whitespace, and truncates to 150 characters to prevent
// CRLF header injection.
function safeHeader(value) {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);
}

export default async function(req) {
  try {
    const body = await req.json();
    const pledgeId = body.pledge_id;

    if (typeof pledgeId !== 'string' || pledgeId.trim() === '' || pledgeId.length > 64) {
      return Response.json({ error: 'Invalid pledge_id' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    let record;
    try {
      const matches = await base44.asServiceRole.entities.Pledge.filter({ id: pledgeId });
      record = matches && matches[0];
    } catch {
      return Response.json({ error: 'Pledge not found' }, { status: 404 });
    }
    if (!record) {
      return Response.json({ error: 'Pledge not found' }, { status: 404 });
    }

    if (record.notification_sent_at) {
      return Response.json({ success: true, message: 'Notification already sent' }, { status: 200 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const to = 'greggsdevelopment@gmail.com';
    const subject = 'New Pledge Submission - Pledge Wall';
    const name = [record.first_name, record.last_initial].filter(Boolean).join(' ');
    const emailBody = [
      'A new pledge has been submitted on the pledge wall.',
      '',
      `Name: ${name || 'Not provided'}`,
      `City: ${record.city || 'Not provided'}`,
      '',
      'Pledge:',
      record.pledge_statement || '(no statement provided)',
      '',
      'Review and approve it in the admin dashboard.'
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

    await base44.asServiceRole.entities.Pledge.update(pledgeId, {
      notification_sent_at: new Date().toISOString()
    });

    return Response.json({ success: true, messageId: result.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}