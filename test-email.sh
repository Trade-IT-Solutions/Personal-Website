#!/bin/bash

# Test Email & PDF Download Functionality
# Usage: ./test-email.sh your_email@example.com

EMAIL=${1:-"test@example.com"}
API_URL="https://personal-website-backend-e74k.onrender.com"

echo "================================================"
echo "Testing Kelly Ohgee Website Email Functionality"
echo "================================================"
echo ""

# Test 1: Health Check
echo "1. Checking API health and SendGrid configuration..."
HEALTH=$(curl -s "$API_URL/api/health")
echo "$HEALTH" | jq '.'

SENDGRID_CONFIGURED=$(echo "$HEALTH" | jq -r '.sendgridConfigured')
if [ "$SENDGRID_CONFIGURED" = "true" ]; then
    echo "✅ SendGrid is configured"
else
    echo "❌ SendGrid is NOT configured"
    echo ""
    echo "Please set up SendGrid environment variables:"
    echo "- SENDGRID_API_KEY"
    echo "- SENDGRID_FROM_EMAIL"
    echo "- ADMIN_EMAIL"
    echo ""
    echo "See EMAIL_SETUP.md for instructions"
    exit 1
fi

echo ""

# Test 2: Send WAM Method PDF
echo "2. Testing WAM Method PDF email to: $EMAIL"
WAM_RESPONSE=$(curl -s -X POST "$API_URL/api/send-resource" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"$EMAIL\",
    \"phone\": \"1234567890\",
    \"countryCode\": \"+1\",
    \"resourceType\": \"wam\",
    \"emailTemplate\": {
      \"subject\": \"Your Free Resource: Kelly's WAM Method\",
      \"text\": \"Thank you for downloading Kelly's WAM Method!\",
      \"html\": \"<h2>Thank you!</h2><p>Your resource is attached.</p>\"
    }
  }")

echo "$WAM_RESPONSE" | jq '.'

WAM_SUCCESS=$(echo "$WAM_RESPONSE" | jq -r '.success')
if [ "$WAM_SUCCESS" = "true" ]; then
    echo "✅ WAM Method email sent successfully"
else
    echo "❌ WAM Method email failed"
    echo "Error: $(echo "$WAM_RESPONSE" | jq -r '.message')"
fi

echo ""
sleep 2

# Test 3: Send Markets Story PDF
echo "3. Testing Markets Story PDF email to: $EMAIL"
MARKETS_RESPONSE=$(curl -s -X POST "$API_URL/api/send-resource" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"$EMAIL\",
    \"phone\": \"1234567890\",
    \"countryCode\": \"+1\",
    \"resourceType\": \"markets\",
    \"emailTemplate\": {
      \"subject\": \"Your Free Resource: Read the Markets Like a Story\",
      \"text\": \"Thank you for downloading How to Read the Markets Like a Story!\",
      \"html\": \"<h2>Thank you!</h2><p>Your resource is attached.</p>\"
    }
  }")

echo "$MARKETS_RESPONSE" | jq '.'

MARKETS_SUCCESS=$(echo "$MARKETS_RESPONSE" | jq -r '.success')
if [ "$MARKETS_SUCCESS" = "true" ]; then
    echo "✅ Markets Story email sent successfully"
else
    echo "❌ Markets Story email failed"
    echo "Error: $(echo "$MARKETS_RESPONSE" | jq -r '.message')"
fi

echo ""
echo "================================================"
echo "Test Summary"
echo "================================================"

if [ "$SENDGRID_CONFIGURED" = "true" ] && [ "$WAM_SUCCESS" = "true" ] && [ "$MARKETS_SUCCESS" = "true" ]; then
    echo "✅ All tests passed!"
    echo ""
    echo "Check your email inbox: $EMAIL"
    echo "You should receive 2 emails with PDF attachments."
    echo ""
    echo "Also check your admin email for notifications."
else
    echo "❌ Some tests failed. Check the output above for details."
    echo ""
    echo "Common issues:"
    echo "1. SendGrid API key not set in Render"
    echo "2. Sender email not verified in SendGrid"
    echo "3. SENDGRID_FROM_EMAIL doesn't match verified sender"
    echo ""
    echo "See EMAIL_SETUP.md for setup instructions."
fi

echo "================================================"
