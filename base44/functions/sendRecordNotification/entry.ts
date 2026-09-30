/**
 * sendRecordNotification
 *
 * One notification sender for every public form that did not already email
 * the team. Called by the "<Entity> Notification Email" workflows on create.
 *
 * Request: { entity: 'ContactMessage' | 'NewsletterSubscriber' |
 *            'ResourceSuggestion' | 'Order', record_id: string }
 *
 * Same rules as the older per-form senders: admin-only trigger, the record is
 * re-read server side (never trusted from the request), headers are sanitized,
 * and notification_sent_at makes it send at most once. Replying to the email
 * goes to the person who filled out the form when they gave an address.
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const NOTIFY_TO = 'greggsdevelopment@gmail.com';

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function safeHeader(value: unknown): string {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);
}

const line = (label: string, value: unknown) =>
  value === undefined || value === null || String(value).trim() === '' ? null : `${label}: ${value}`;

function orderItems(raw: unknown): string[] {
  let items: any[] = [];
  try {
    items = typeof raw === 'string' ? JSON.parse(raw) : Array.isArray(raw) ? raw : [];
  } catch {
    return [`Items: ${String(raw ?? '')}`];
  }
  if (!Array.isArray(items) || items.length === 0) return [];
  return [
    'Items:',
    ...items.map((i: any) => {
      const name = i?.name || i?.title || i?.product_name || i?.id || 'Item';
      const size = i?.size ? ` (${i.size})` : '';
      const qty = i?.quantity ?? i?.qty ?? 1;
      return `  ${qty} x ${name}${size}`;
    }),
  ];
}

type Config = {
  subject: (r: any) => string;
  body: (r: any) => (string | null)[];
  replyTo?: (r: any) => string | undefined;
};

const CONFIG: Record<string, Config> = {
  ContactMessage: {
    subject: (r) =>
      r.subject === 'Prayer Request'
        ? `New Prayer Request - ${r.name || 'Anonymous'}`
        : `New Contact Message - ${r.name || 'Unknown'}${r.subject ? `: ${r.subject}` : ''}`,
    body: (r) => [
      r.subject === 'Prayer Request' ? 'A prayer request came in through ogwogd.org/resources.' : 'A new message came in through the ogwogd.org contact form.',
      '',
      line('Name', r.name),
      line('Email', r.email),
      line('Subject', r.subject),
      '',
      r.message ? String(r.message) : null,
    ],
    replyTo: (r) => r.email,
  },
  NewsletterSubscriber: {
    subject: (r) => `New Newsletter Signup - ${r.email || ''}`,
    body: (r) => ['Someone joined the ogwogd.org newsletter list.', '', line('Email', r.email)],
    replyTo: (r) => r.email,
  },
  ResourceSuggestion: {
    subject: (r) => `New Resource Suggestion - ${r.name || 'Unnamed'}`,
    body: (r) => [
      'Someone suggested a resource for ogwogd.org/resources. Review it before adding it.',
      '',
      line('Resource', r.name),
      line('Category', r.category),
      line('Phone', r.phone),
      line('Website', r.website),
      line('Notes', r.notes),
    ],
  },
  Order: {
    subject: (r) => `New Shop Order ${r.order_number || ''} - $${Number(r.total || 0).toFixed(2)}`,
    body: (r) => [
      'A paid order came in through the ogwogd.org shop. Time to ship it.',
      '',
      line('Order', r.order_number),
      line('Customer', r.customer_name),
      line('Email', r.email),
      line('Ship to', [r.address, r.city, [r.state, r.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ')),
      '',
      ...orderItems(r.items),
      '',
      line('Total', r.total != null ? `$${Number(r.total).toFixed(2)}` : null),
      line('Payment', r.payment_status),
    ],
    replyTo: (r) => r.email,
  },
};

export default async function (req: Request) {
  try {
    const body = await req.json();
    const base44 = createClientFromRequest(req);

    // Auth gate: only admins (and the workflows that run as the app) may trigger notifications
    let user: any = null;
    try {
      user = await base44.auth.me();
    } catch {
      user = null;
    }
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entity = String(body?.entity || '');
    const recordId = body?.record_id;
    const config = CONFIG[entity];
    if (!config) return Response.json({ error: 'Unknown entity' }, { status: 400 });
    if (typeof recordId !== 'string' || recordId.trim() === '' || recordId.length > 64) {
      return Response.json({ error: 'Invalid record_id' }, { status: 400 });
    }

    const entities = base44.asServiceRole.entities as any;
    let record: any;
    try {
      const matches = await entities[entity].filter({ id: recordId });
      record = matches && matches[0];
    } catch {
      record = null;
    }
    if (!record) return Response.json({ error: 'Record not found' }, { status: 404 });
    if (record.notification_sent_at) {
      return Response.json({ success: true, message: 'Notification already sent' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const replyTo = config.replyTo?.(record);
    const validReply = replyTo && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(replyTo)) ? safeHeader(replyTo) : '';
    const text = [...config.body(record), '', `Submitted: ${record.created_date || new Date().toISOString()}`]
      .filter((l) => l !== null)
      .join('\r\n');

    const raw = base64UrlEncode(
      `To: ${NOTIFY_TO}\r\n` +
        `Subject: ${safeHeader(config.subject(record))}\r\n` +
        (validReply ? `Reply-To: ${validReply}\r\n` : '') +
        'Content-Type: text/plain; charset=UTF-8\r\n' +
        'MIME-Version: 1.0\r\n' +
        '\r\n' +
        text,
    );

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });
    if (!response.ok) {
      return Response.json({ error: `Gmail API error: ${await response.text()}` }, { status: 500 });
    }
    const result = await response.json();

    try {
      await entities[entity].update(recordId, { notification_sent_at: new Date().toISOString() });
    } catch {
      // the email went out; a missing timestamp is not worth failing over
    }

    return Response.json({ success: true, messageId: result.id });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
