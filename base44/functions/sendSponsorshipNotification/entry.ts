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
    const base44 = createClientFromRequest(req);

    // Auth gate: only admins may trigger notifications
    let _user;
    try {
      _user = await base44.auth.me();
    } catch (e) {
      _user = null;
    }
    if (!_user || _user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sponsorshipId = body.sponsorship_id;

    if (typeof sponsorshipId !== 'string' || sponsorshipId.trim() === '' || sponsorshipId.length > 64) {
      return Response.json({ error: 'Invalid sponsorship_id' }, { status: 400 });
    }

    let record;
    try {
      const matches = await base44.asServiceRole.entities.SponsorshipApplication.filter({ id: sponsorshipId });
      record = matches && matches[0];
    } catch {
      return Response.json({ error: 'Sponsorship application not found' }, { status: 404 });
    }
    if (!record) {
      return Response.json({ error: 'Sponsorship application not found' }, { status: 404 });
    }

    if (record.notification_sent_at) {
      return Response.json({ success: true, message: 'Notification already sent' }, { status: 200 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const to = 'greggsdevelopment@gmail.com';
    const subject = `New Sponsorship Application - ${safeHeader(record.business_name || 'Unknown Business')}`;

    // Empty fields are skipped. Filter on null rather than Boolean so the
    // blank spacer lines survive.
    const emailBody = [
      'A new sponsorship application has been submitted.',
      '',
      record.business_name ? `Business Name: ${record.business_name}` : null,
      record.contact_person ? `Contact Person: ${record.contact_person}` : null,
      record.email ? `Email: ${record.email}` : null,
      record.phone ? `Phone: ${record.phone}` : null,
      record.website ? `Website: ${record.website}` : null,
      record.city ? `City: ${record.city}` : null,
      record.sponsorship_level ? `Sponsorship Level: ${record.sponsorship_level}` : null,
      record.funding_focus ? `Funding Focus: ${record.funding_focus}` : null,
      record.school_of_interest ? `School of Interest: ${record.school_of_interest}` : null,
      record.in_kind ? `In-Kind: ${record.in_kind}` : null,
      record.message ? `Message: ${record.message}` : null,
      '',
      `Submitted: ${record.created_date || new Date().toISOString()}`
    ].filter((line) => line !== null).join('\r\n');

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

    await base44.asServiceRole.entities.SponsorshipApplication.update(sponsorshipId, {
      notification_sent_at: new Date().toISOString()
    });

    return Response.json({ success: true, messageId: result.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}