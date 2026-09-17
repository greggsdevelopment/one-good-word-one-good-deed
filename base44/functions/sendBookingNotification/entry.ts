import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

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
    const bookingId = body.booking_id;

    if (typeof bookingId !== 'string' || bookingId.trim() === '' || bookingId.length > 64) {
      return Response.json({ error: 'Invalid booking_id' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    let record;
    try {
      const matches = await base44.asServiceRole.entities.BookingRequest.filter({ id: bookingId });
      record = matches && matches[0];
    } catch {
      return Response.json({ error: 'Booking request not found' }, { status: 404 });
    }
    if (!record) {
      return Response.json({ error: 'Booking request not found' }, { status: 404 });
    }

    if (record.notification_sent_at) {
      return Response.json({ success: true, message: 'Notification already sent' }, { status: 200 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const to = 'greggsdevelopment@gmail.com';
    const subject = `New School Booking Request - ${safeHeader(record.school_name || 'Unknown School')}`;

    const lines = [
      'A new school booking request has been submitted.',
      '',
      `School: ${record.school_name || 'Not provided'}`,
      record.district ? `District: ${record.district}` : null,
      record.school_type ? `School Type: ${record.school_type}` : null,
      record.grade_band ? `Grade Band: ${record.grade_band}` : null,
      record.num_students != null ? `Number of Students: ${record.num_students}` : null,
      record.package_type ? `Package: ${record.package_type}` : null,
      record.target_term ? `Target Term: ${record.target_term}` : null,
      record.preferred_date ? `Preferred Date: ${record.preferred_date}` : null,
      record.date_window_1 ? `Date Option 1: ${record.date_window_1}` : null,
      record.date_window_2 ? `Date Option 2: ${record.date_window_2}` : null,
      record.date_window_3 ? `Date Option 3: ${record.date_window_3}` : null,
      record.payment_route ? `Payment Route: ${record.payment_route}` : null,
      record.po_number ? `PO Number: ${record.po_number}` : null,
      record.quoted_total != null ? `Quoted Total: $${record.quoted_total}` : null,
      '',
      'Contact:',
      record.contact_name ? `  Name: ${record.contact_name}` : null,
      record.contact_role ? `  Role: ${record.contact_role}` : null,
      record.principal_name ? `  Principal: ${record.principal_name}` : null,
      record.email ? `  Email: ${record.email}` : null,
      record.phone ? `  Phone: ${record.phone}` : null,
      '',
      'Message:',
      record.message || '(none provided)',
      '',
      'Review and follow up in the admin dashboard.'
    ].filter(Boolean);

    const emailBody = lines.join('\r\n');

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

    await base44.asServiceRole.entities.BookingRequest.update(bookingId, {
      notification_sent_at: new Date().toISOString()
    });

    return Response.json({ success: true, messageId: result.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}