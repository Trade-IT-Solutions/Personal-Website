#!/usr/bin/env bash
# For local full-stack booking tests: forwards Stripe webhooks to your API.
# Requires: brew install stripe/stripe-cli/stripe, and STRIPE_SECRET_KEY (sk_test_...) in the environment.
#
# 1. Copy the "whsec_..." line Stripe CLI prints on startup into backend/.env as STRIPE_WEBHOOK_SECRET
#    (or export it) so it matches THIS listen session — then restart the backend if it was already running.
# 2. Start backend with PUBLIC_SITE_URL so Stripe returns users to local CRA after pay, e.g.:
#      PUBLIC_SITE_URL=http://localhost:3000 PORT=5010 STRIPE_SECRET_KEY=sk_test_... npm run dev
# 3. From repo root: npm start  (set REACT_APP_API_URL=http://localhost:5010 in .env if API is not on 5000)
# 4. Run this script in another terminal, then complete checkout on /talk-with-kelly with test card 4242…
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PORT="${PORT:-5010}"
FORWARD="${STRIPE_FORWARD_WEBHOOK_URL:-http://127.0.0.1:${PORT}/api/stripe/webhook}"

if [[ -z "${STRIPE_SECRET_KEY:-}" ]]; then
  echo "Export STRIPE_SECRET_KEY (sk_test_...) first, same key the backend uses."
  exit 1
fi

echo "Forwarding Stripe test webhooks → $FORWARD"
echo "Update STRIPE_WEBHOOK_SECRET to the whsec_ value printed below, then keep backend running."
stripe listen --api-key "$STRIPE_SECRET_KEY" --forward-to "$FORWARD"
