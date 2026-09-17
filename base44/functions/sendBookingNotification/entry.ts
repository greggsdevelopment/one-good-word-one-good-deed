import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

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
    const b = body.booking || {};

    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const to = 'greggsdevelopment@gmail.com';
    const subject = `New School Booking Request — ${b.school_name || 'Unknown School'}`;

    const lines = [
      'A new school booking request has been submitted.',
      '',
      `School: ${b.school_name || 'Not provided'}`,
      b.district ? `District: ${b.district}` : null,
      b.school_type ? `School Type: ${b.school_type}` : null,
      b.grade_band ? `Grade Band: ${b.grade_band}` : null,
      b.num_students != null ? `Number of Students: ${b.num_students}` : null,
      b.package_type ? `Package: ${b.package_type}` : null,
      b.target_term ? `Target Term: ${b.target_term}` : null,
      b.preferred_date ? `Preferred Date: ${b.preferred_date}` : null,
      b.date_window_1 ? `Date Option 1: ${b.date_window_1}` : null,
      b.date_window_2 ? `Date Option 2: ${b.date_window_2}` : null,
      b.date_window_3 ? `Date Option 3: ${b.date_window_3}` : null,
      b.payment_route ? `Payment Route: ${b.payment_route}` : null,
      b.po_number ? `PO Number: ${b.po_number}` : null,
      b.quoted_total != null ? `Quoted Total: $${b.quoted_total}` : null,
      '',
      'Contact:',
      b.contact_name ? `  Name: ${b.contact_name}` : null,
      b.contact_role ? `  Role: ${b.contact_role}` : null,
      b.principal_name ? `  Principal: ${b.principal_name}` : null,
      b.email ? `  Email: ${b.email}` : null,
      b.phone ? `  Phone: ${b.phone}` : null,
      '',
      'Message:',
      b.message || '(none provided)',
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
    return Response.json({ success: true, messageId: result.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}