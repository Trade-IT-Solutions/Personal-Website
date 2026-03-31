const Stripe = require('stripe');
const { google } = require('googleapis');
const { DateTime } = require('luxon');
const axios = require('axios');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

const DURATION_MINUTES = [15, 30, 60];

const PRICE_BY_DURATION = {
  15: process.env.STRIPE_PRICE_15_MIN || 'price_1TH5RaEoPlVeWCJv8npkipNQ',
  30: process.env.STRIPE_PRICE_30_MIN || 'price_1TH5PaEoPlVeWCJvGsiOY79X',
  60: process.env.STRIPE_PRICE_60_MIN || 'price_1TH5QVEoPlVeWCJveHKq584U',
};

const BOOKING_TZ = process.env.BOOKING_TIMEZONE || 'America/New_York';
const SLOT_STEP_MIN = 15;
const BOOKING_START_HOUR = parseInt(process.env.BOOKING_START_HOUR || '9', 10);
const BOOKING_END_HOUR = parseInt(process.env.BOOKING_END_HOUR || '17', 10);
const MIN_LEAD_HOURS = parseInt(process.env.BOOKING_MIN_LEAD_HOURS || '4', 10);
const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://www.kellyohgee.com').replace(/\/$/, '');

/** Stripe Checkout Session metadata: each value max 500 characters */
const MAX_BOOKING_METADATA_DESC = 480;
const MAX_BOOKING_PHONE_LEN = 32;

function sanitizeBookingPhone(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw.replace(/[^\d+\s().-]/g, '').trim().slice(0, MAX_BOOKING_PHONE_LEN);
}

function sanitizeBookingDescription(raw) {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, MAX_BOOKING_METADATA_DESC);
}

let stripeClient = null;
function getStripe() {
  if (!stripeClient && process.env.STRIPE_SECRET_KEY) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

let processedWebhookEvents = new Set();
const MAX_PROCESSED = 500;

/** sessionId -> fulfillment payload (survives webhook retries without duplicate Meet) */
const fulfillmentResultsBySession = new Map();
const MAX_FULFILLMENT_CACHE = 200;

function markProcessed(eventId) {
  if (processedWebhookEvents.size >= MAX_PROCESSED) {
    processedWebhookEvents = new Set();
  }
  processedWebhookEvents.add(eventId);
}

function cacheFulfillment(sessionId, payload) {
  if (fulfillmentResultsBySession.size >= MAX_FULFILLMENT_CACHE) {
    const firstKey = fulfillmentResultsBySession.keys().next().value;
    fulfillmentResultsBySession.delete(firstKey);
  }
  fulfillmentResultsBySession.set(sessionId, payload);
}

function getCalendarId() {
  return process.env.GOOGLE_CALENDAR_ID || 'primary';
}

/**
 * Workspace domain-wide delegation: use the same scope(s) authorized in
 * Admin → Security → API controls → Domain-wide delegation (e.g. calendar only).
 */
const GOOGLE_CALENDAR_SCOPES = ['https://www.googleapis.com/auth/calendar'];

let warnedMissingImpersonate = false;

function getGoogleAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let key = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !key) return null;
  if (key.includes('\\n')) {
    key = key.replace(/\\n/g, '\n');
  }

  const subject = process.env.GOOGLE_CALENDAR_IMPERSONATE?.trim() || null;
  if (!subject && !warnedMissingImpersonate) {
    warnedMissingImpersonate = true;
    console.warn(
      'booking: GOOGLE_CALENDAR_IMPERSONATE is not set. ' +
        'For Workspace domain-wide delegation, set it to Kelly\'s Workspace email. ' +
        'Without it, API calls run as the service account (needs calendar sharing).'
    );
  }

  return new google.auth.JWT(
    email,
    null,
    key,
    GOOGLE_CALENDAR_SCOPES,
    subject
  );
}

async function getCalendarApi() {
  const auth = getGoogleAuth();
  if (!auth) return null;
  await auth.authorize();
  return google.calendar({ version: 'v3', auth });
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

async function fetchBusyIntervals(dayStart, dayEnd) {
  const calendar = await getCalendarApi();
  if (!calendar) return [];

  const calId = getCalendarId();
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toUTC().toISO(),
      timeMax: dayEnd.toUTC().toISO(),
      items: [{ id: calId }],
    },
  });

  const busy = res.data.calendars?.[calId]?.busy || [];
  return busy.map((b) => ({
    start: new Date(b.start).getTime(),
    end: new Date(b.end).getTime(),
  }));
}

function slotOverlapsBusy(slotStartMs, slotEndMs, busyIntervals) {
  return busyIntervals.some((b) =>
    rangesOverlap(slotStartMs, slotEndMs, b.start, b.end)
  );
}

function parseDuration(value) {
  const n = parseInt(value, 10);
  if (!DURATION_MINUTES.includes(n)) return null;
  return n;
}

async function getSlots(req, res) {
  try {
    const dateStr = req.query.date;
    const durationMinutes = parseDuration(req.query.durationMinutes || req.query.duration);
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing date (YYYY-MM-DD)' });
    }
    if (!durationMinutes) {
      return res.status(400).json({ success: false, message: 'durationMinutes must be 15, 30, or 60' });
    }

    let day = DateTime.fromISO(dateStr, { zone: BOOKING_TZ }).startOf('day');
    if (!day.isValid) {
      return res.status(400).json({ success: false, message: 'Invalid date' });
    }

    const now = DateTime.now().setZone(BOOKING_TZ);
    const minStart = now.plus({ hours: MIN_LEAD_HOURS });

    const dayStart = day;
    const dayEnd = day.plus({ days: 1 });

    let busyIntervals = [];
    try {
      busyIntervals = await fetchBusyIntervals(dayStart, dayEnd);
    } catch (e) {
      console.warn('booking slots: freebusy failed, showing unfiltered slots', e.message);
    }

    const slots = [];
    let cursor = day.set({ hour: BOOKING_START_HOUR, minute: 0, second: 0, millisecond: 0 });
    const dayEndBoundary = day.set({ hour: BOOKING_END_HOUR, minute: 0, second: 0, millisecond: 0 });

    while (cursor < dayEndBoundary) {
      const slotStart = cursor;
      const slotEnd = cursor.plus({ minutes: durationMinutes });
      if (slotEnd > dayEndBoundary) break;

      const slotStartMs = slotStart.toMillis();
      const slotEndMs = slotEnd.toMillis();

      if (slotStart >= minStart && !slotOverlapsBusy(slotStartMs, slotEndMs, busyIntervals)) {
        slots.push({
          start: slotStart.toUTC().toISO(),
          label: slotStart.toFormat('h:mm a'),
        });
      }
      cursor = cursor.plus({ minutes: SLOT_STEP_MIN });
    }

    return res.json({
      success: true,
      timezone: BOOKING_TZ,
      slots,
      calendarConfigured: !!getGoogleAuth(),
    });
  } catch (err) {
    console.error('getSlots error:', err);
    return res.status(500).json({
      success: false,
      message: 'Could not load availability',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}

const checkoutAttempts = new Map();
const CHECKOUT_WINDOW_MS = 15 * 60 * 1000;
const CHECKOUT_MAX = 8;

function rateLimitBookingCheckout(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  for (const [key, data] of checkoutAttempts.entries()) {
    if (now - data.start > CHECKOUT_WINDOW_MS) checkoutAttempts.delete(key);
  }
  const rec = checkoutAttempts.get(ip) || { count: 0, start: now };
  if (now - rec.start > CHECKOUT_WINDOW_MS) {
    rec.count = 0;
    rec.start = now;
  }
  rec.count += 1;
  checkoutAttempts.set(ip, rec);
  if (rec.count > CHECKOUT_MAX) {
    return res.status(429).json({ success: false, message: 'Too many checkout attempts. Try again later.' });
  }
  next();
}

async function createCheckoutSession(req, res) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({ success: false, message: 'Payments are not configured.' });
    }

    const {
      durationMinutes: durRaw,
      slotStart,
      email,
      name,
      phone,
      description: descriptionRaw,
    } = req.body;

    const durationMinutes = parseDuration(durRaw);
    if (!durationMinutes || !slotStart) {
      return res.status(400).json({ success: false, message: 'durationMinutes and slotStart are required' });
    }

    const customerEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) || customerEmail.length > 254) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    const customerName = typeof name === 'string' ? name.trim().slice(0, 200) : '';
    const customerPhone = sanitizeBookingPhone(phone);
    const bookingDescription = sanitizeBookingDescription(descriptionRaw);

    const startMs = Date.parse(slotStart);
    if (Number.isNaN(startMs)) {
      return res.status(400).json({ success: false, message: 'Invalid slotStart' });
    }
    const endMs = startMs + durationMinutes * 60 * 1000;
    const startDt = DateTime.fromMillis(startMs, { zone: 'utc' }).setZone(BOOKING_TZ);
    const now = DateTime.now().setZone(BOOKING_TZ);
    if (startDt < now.plus({ hours: MIN_LEAD_HOURS })) {
      return res.status(400).json({ success: false, message: 'This time is no longer available. Pick another slot.' });
    }

    const priceId = PRICE_BY_DURATION[durationMinutes];
    if (!priceId) {
      return res.status(400).json({ success: false, message: 'Invalid duration' });
    }

    if (getGoogleAuth()) {
      try {
        const busy = await fetchBusyIntervals(
          startDt.startOf('day'),
          startDt.endOf('day').plus({ days: 1 })
        );
        if (slotOverlapsBusy(startMs, endMs, busy)) {
          return res.status(409).json({ success: false, message: 'That slot was just taken. Please choose another.' });
        }
      } catch (e) {
        console.warn('createCheckout: freebusy check failed', e.message);
      }
    }

    const sessionMetadata = {
      durationMinutes: String(durationMinutes),
      slotStart: new Date(startMs).toISOString(),
      customerEmail,
      customerName,
    };
    if (customerPhone) sessionMetadata.customerPhone = customerPhone;
    if (bookingDescription) sessionMetadata.bookingDescription = bookingDescription;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: sessionMetadata,
      success_url: `${SITE_URL}/talk-with-kelly?session_id={CHECKOUT_SESSION_ID}&booking=success`,
      cancel_url: `${SITE_URL}/talk-with-kelly?booking=cancelled`,
    });

    return res.json({ success: true, url: session.url });
  } catch (err) {
    console.error('createCheckoutSession error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Could not start checkout',
    });
  }
}

async function sendBookingEmails(
  customerEmail,
  customerName,
  meetLink,
  startIso,
  endIso,
  durationMinutes,
  customerPhone = '',
  bookingDescription = ''
) {
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    console.warn('SendGrid not configured; skipping booking email');
    return;
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const startLocal = DateTime.fromISO(startIso, { zone: 'utc' }).setZone(BOOKING_TZ);
  const endLocal = DateTime.fromISO(endIso, { zone: 'utc' }).setZone(BOOKING_TZ);
  const when = `${startLocal.toFormat('FFFF')} – ${endLocal.toFormat('t')} (${BOOKING_TZ})`;

  const safeName = customerName || 'there';
  const phoneBlock = customerPhone
    ? `<p><strong>Phone:</strong> ${escapeHtml(customerPhone)}</p>`
    : '';
  const noteBlock = bookingDescription
    ? `<p><strong>Your notes:</strong> ${escapeHtml(bookingDescription)}</p>`
    : '';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; background: #f6f3ee; color: #222;">
      <h1 style="color: #22201D;">You're booked — Talk with Kelly</h1>
      <p>Hi ${escapeHtml(safeName)},</p>
      <p>Thanks for booking a <strong>${durationMinutes}-minute</strong> session. Here are your details:</p>
      <p><strong>When:</strong> ${escapeHtml(when)}</p>
      ${phoneBlock}
      ${noteBlock}
      <p><strong>Google Meet:</strong> <a href="${escapeHtml(meetLink)}">${escapeHtml(meetLink)}</a></p>
      <p>If you need to reschedule, reply to this email.</p>
      <p>— Kelly Ohgee</p>
    </div>`;

  const textExtras = [
    customerPhone ? `Phone: ${customerPhone}` : null,
    bookingDescription ? `Notes: ${bookingDescription}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  await sgMail.send({
    to: customerEmail,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: process.env.FROM_NAME || 'Kelly Ohgee',
    },
    subject: 'Your Talk with Kelly — Google Meet link',
    text:
      `Hi ${safeName},\n\nYou're booked for a ${durationMinutes}-minute session.\nWhen: ${when}\n` +
      (textExtras ? `${textExtras}\n` : '') +
      `Meet: ${meetLink}\n\n— Kelly`,
    html,
  });

  const adminTo = process.env.ADMIN_EMAIL || process.env.SENDGRID_FROM_EMAIL;
  if (adminTo) {
    await sgMail.send({
      to: adminTo,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: 'Kelly Website',
      },
      subject: `New paid booking: ${customerEmail}`,
      text:
        `New Talk with Kelly booking\n` +
        `Customer: ${customerName || '—'}\nEmail: ${customerEmail}\n` +
        (customerPhone ? `Phone: ${customerPhone}\n` : '') +
        (bookingDescription ? `Description: ${bookingDescription}\n` : '') +
        `Duration: ${durationMinutes} min\nWhen: ${when}\nMeet: ${meetLink}`,
    });
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function notifySlackBooking(payload) {
  const url = process.env.SLACK_BOOKING_WEBHOOK_URL;
  if (!url) return;
  try {
    const phoneLine = payload.customerPhone
      ? `• Phone: ${payload.customerPhone}\n`
      : '';
    const descLine = payload.bookingDescription
      ? `• *Notes:* ${payload.bookingDescription}\n`
      : '';
    await axios.post(url, {
      text:
        `*New Talk with Kelly (paid)*\n` +
        `• ${payload.customerName || '—'} <${payload.customerEmail}>\n` +
        phoneLine +
        descLine +
        `• ${payload.durationMinutes} min\n` +
        `• ${payload.when}\n` +
        `• Meet: ${payload.meetLink}\n` +
        `• Stripe session: \`${payload.sessionId}\``,
    }, { timeout: 10000 });
  } catch (e) {
    console.error('Slack webhook failed:', e.message);
  }
}

async function createGoogleMeetEvent({
  customerEmail,
  customerName,
  startIso,
  endIso,
  durationMinutes,
  customerPhone = '',
  bookingDescription = '',
}) {
  const calendar = await getCalendarApi();
  if (!calendar) {
    throw new Error('Google Calendar is not configured');
  }

  const requestId = crypto.randomBytes(8).toString('hex');
  const calendarId = getCalendarId();

  const startLocal = DateTime.fromISO(startIso, { zone: 'utc' }).setZone(BOOKING_TZ);
  const endLocal = DateTime.fromISO(endIso, { zone: 'utc' }).setZone(BOOKING_TZ);

  const descParts = [
    'Paid session via website.',
    `Guest: ${customerName || '—'}`,
    `Email: ${customerEmail}`,
  ];
  if (customerPhone) descParts.push(`Phone: ${customerPhone}`);
  if (bookingDescription) descParts.push(`Notes: ${bookingDescription}`);

  const event = {
    summary: `Talk with Kelly (${durationMinutes} min) — ${customerName || customerEmail}`,
    description: descParts.join('\n'),
    start: {
      dateTime: startLocal.toFormat("yyyy-MM-dd'T'HH:mm:ss"),
      timeZone: BOOKING_TZ,
    },
    end: {
      dateTime: endLocal.toFormat("yyyy-MM-dd'T'HH:mm:ss"),
      timeZone: BOOKING_TZ,
    },
    attendees: [{ email: customerEmail }],
    conferenceData: {
      createRequest: {
        requestId,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  const insertRes = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    requestBody: event,
    sendUpdates: 'none',
  });

  const meetLink =
    insertRes.data.hangoutLink ||
    insertRes.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri;

  if (!meetLink) {
    throw new Error('Calendar event created but no Meet link returned');
  }

  return { meetLink, eventId: insertRes.data.id };
}

async function fulfillBookingFromSession(session) {
  const cached = fulfillmentResultsBySession.get(session.id);
  if (cached) {
    try {
      await sendBookingEmails(
        cached.customerEmail,
        cached.customerName,
        cached.meetLink,
        cached.startIso,
        cached.endIso,
        cached.durationMinutes,
        cached.customerPhone,
        cached.bookingDescription
      );
    } catch (e) {
      console.error('Retry: resend booking email failed:', e.message);
    }
    return;
  }

  const meta = session.metadata || {};
  const durationMinutes = parseInt(meta.durationMinutes, 10);
  const slotStart = meta.slotStart;
  const customerEmail = session.customer_email || meta.customerEmail || session.customer_details?.email;
  const customerName = meta.customerName || '';
  const customerPhone = meta.customerPhone || '';
  const bookingDescription = meta.bookingDescription || '';

  if (!DURATION_MINUTES.includes(durationMinutes) || !slotStart || !customerEmail) {
    throw new Error('Incomplete session metadata for booking');
  }

  const startMs = Date.parse(slotStart);
  const endMs = startMs + durationMinutes * 60 * 1000;
  const startIso = new Date(startMs).toISOString();
  const endIso = new Date(endMs).toISOString();

  const startLocal = DateTime.fromMillis(startMs, { zone: 'utc' }).setZone(BOOKING_TZ);
  const endLocal = DateTime.fromMillis(endMs, { zone: 'utc' }).setZone(BOOKING_TZ);
  const when = `${startLocal.toFormat('FFFF')} – ${endLocal.toFormat('t')} (${BOOKING_TZ})`;

  const { meetLink } = await createGoogleMeetEvent({
    customerEmail,
    customerName,
    startIso,
    endIso,
    durationMinutes,
    customerPhone,
    bookingDescription,
  });

  cacheFulfillment(session.id, {
    customerEmail,
    customerName,
    meetLink,
    startIso,
    endIso,
    durationMinutes,
    when,
    customerPhone,
    bookingDescription,
  });

  await sendBookingEmails(
    customerEmail,
    customerName,
    meetLink,
    startIso,
    endIso,
    durationMinutes,
    customerPhone,
    bookingDescription
  );

  await notifySlackBooking({
    customerEmail,
    customerName,
    customerPhone,
    bookingDescription,
    durationMinutes,
    when,
    meetLink,
    sessionId: session.id,
  });
}

async function handleStripeWebhook(req, res) {
  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !whSecret) {
    console.error('Stripe webhook: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
    return res.status(500).send('Webhook not configured');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, whSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (processedWebhookEvents.has(event.id)) {
    return res.json({ received: true, duplicate: true });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    if (session.payment_status === 'paid') {
      try {
        await fulfillBookingFromSession(session);
      } catch (e) {
        console.error('fulfillBookingFromSession failed:', e);
        return res.status(500).json({ error: e.message });
      }
    }
  }

  markProcessed(event.id);
  res.json({ received: true });
}

module.exports = {
  getSlots,
  createCheckoutSession,
  handleStripeWebhook,
  rateLimitBookingCheckout,
  BOOKING_TZ,
};
