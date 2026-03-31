/**
 * Sends a signed Stripe webhook (checkout.session.completed) to the local backend
 * to exercise: Google Meet creation, SendGrid email, Slack notification.
 *
 * Usage (from backend/):
 *   node scripts/simulate-booking-webhook.js
 *   node scripts/simulate-booking-webhook.js --email=you@yourdomain.com
 *
 * Requires backend/.env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, Google + SendGrid + Slack as needed.
 * Uses sk_test_* recommended; live keys work but will behave like production.
 *
 * Start the API first: npm run dev   (or npm start)
 */
const path = require('path');
const axios = require('axios');
const Stripe = require('stripe');

const backendRoot = path.join(__dirname, '..');
const repoRoot = path.join(__dirname, '..', '..');
require('dotenv').config({ path: path.join(repoRoot, '.env') });
require('dotenv').config({ path: path.join(backendRoot, '.env') });

const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripeSecret =
  process.env.STRIPE_SECRET_KEY || 'sk_test_webhook_simulation_only_dummy_key';
const port = process.env.PORT || 5000;
const baseUrl = process.env.TEST_WEBHOOK_BASE || `http://127.0.0.1:${port}`;

function parseArg(name) {
  const prefixed = process.argv.find((a) => a.startsWith(`${name}=`));
  if (prefixed) return prefixed.split('=').slice(1).join('=');
  const idx = process.argv.indexOf(name);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
}

async function main() {
  if (!whSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET (must match the running server).');
    process.exit(1);
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn(
      'STRIPE_SECRET_KEY not set — using a dummy key only to generate the signature.\n' +
        'The server still needs any valid-format sk_test_ or sk_live_ key in env for webhook verification to run.'
    );
  }

  const stripe = new Stripe(stripeSecret);
  const customerEmail =
    parseArg('--email') || process.env.TEST_BOOKING_EMAIL || 'booking-sim@example.com';
  const durationMinutes = parseArg('--minutes') || '30';
  const leadHours = Math.max(
    parseInt(process.env.BOOKING_MIN_LEAD_HOURS || '4', 10) + 2,
    6
  );
  const slotStart = new Date(
    Date.now() + leadHours * 60 * 60 * 1000
  ).toISOString();

  const session = {
    id: `cs_test_sim_${Date.now()}`,
    object: 'checkout.session',
    payment_status: 'paid',
    customer_email: customerEmail,
    customer_details: { email: customerEmail },
    metadata: {
      durationMinutes: String(durationMinutes),
      slotStart,
      customerEmail,
      customerName: 'Stripe webhook simulation',
      customerPhone: '+1 555-0100',
      bookingDescription: 'Test note for Slack — simulate phone + description in metadata.',
    },
  };

  const event = {
    id: `evt_test_sim_${Date.now()}`,
    object: 'event',
    api_version: '2024-11-20.acacia',
    created: Math.floor(Date.now() / 1000),
    livemode: stripeSecret.startsWith('sk_live_'),
    pending_webhooks: 1,
    type: 'checkout.session.completed',
    data: { object: session },
  };

  const payloadString = JSON.stringify(event);
  const stripeSignature = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: whSecret,
  });

  const url = `${baseUrl}/api/stripe/webhook`;
  console.log('POST', url);
  console.log('Session', session.id, '|', durationMinutes, 'min |', customerEmail);
  console.log('slotStart', slotStart);

  try {
    const res = await axios.post(url, payloadString, {
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': stripeSignature,
      },
      maxBodyLength: Infinity,
      validateStatus: () => true,
    });

    console.log('HTTP', res.status, res.data);

    if (res.status >= 400) {
      console.error('\nIf 400: check Stripe-Signature / STRIPE_WEBHOOK_SECRET matches this .env.');
      console.error('If 500: read server logs (Calendar, SendGrid, or Slack errors).');
      process.exit(1);
    }
  } catch (e) {
    console.error(e.message);
    console.error('\nIs the backend running on', baseUrl, '?');
    process.exit(1);
  }
}

main();
