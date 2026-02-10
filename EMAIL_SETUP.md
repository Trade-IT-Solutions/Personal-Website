# Email & PDF Download Setup Guide

## Current Status

✅ **Backend code is ready** - PDF email functionality fully implemented
✅ **PDFs exist** - Both PDF files are in `backend/pdfs/`
  - `kellys-wam-method.pdf`
  - `read-markets-like-story.pdf`
✅ **Frontend integrated** - Resources page calls the API correctly
❓ **SendGrid configured?** - Need to verify environment variables

## Setup SendGrid (100% FREE - No Credit Card for 100 emails/day)

### Step 1: Create SendGrid Account (FREE)

1. Go to [SendGrid.com](https://signup.sendgrid.com/)
2. Sign up for a **FREE account** (100 emails/day forever, no credit card)
3. Verify your email address
4. Complete the onboarding (skip payment - stay on free tier)

### Step 2: Create API Key

1. In SendGrid dashboard, go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name it: `Kelly Website`
4. Choose **"Full Access"** (or minimum: Mail Send permissions)
5. Click **"Create & View"**
6. **COPY THE KEY NOW** (you can't see it again!)
   - Format: `SG.xxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy`

### Step 3: Verify Sender Email (REQUIRED)

SendGrid requires you to verify the email you'll send from:

**Option A: Single Sender Verification (Easiest - FREE)**
1. Go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in your details:
   - From Name: `Kelly Ohgee`
   - From Email: Your verified email (e.g., `contact@kellyohgee.com` or personal email)
   - Reply To: Same or different email
   - Address, City, etc. (required by SendGrid)
4. Click **"Create"**
5. Check your email and click the verification link
6. ✅ You're ready to send!

**Option B: Domain Authentication (Professional - FREE but requires DNS access)**
1. Go to **Settings** → **Sender Authentication**
2. Click **"Authenticate Your Domain"**
3. Follow steps to add DNS records to your domain
4. Verify domain ownership
5. More reliable for high-volume sending

### Step 4: Add Environment Variables to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your **backend service** (personal-website-backend-e74k)
3. Go to **Environment** tab
4. Click **"Add Environment Variable"** and add these:

```
SENDGRID_API_KEY=SG.your_actual_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=contact@kellyohgee.com
FROM_NAME=Kelly Ohgee
ADMIN_EMAIL=your_admin_email@example.com
```

**Important:**
- `SENDGRID_FROM_EMAIL` must match the verified email from Step 3
- `ADMIN_EMAIL` is where you receive notifications about downloads

5. Click **"Save Changes"** - Render will auto-redeploy (2-3 minutes)

## Test the Email Functionality

### Method 1: Test via Website

Once deployed:
1. Go to https://kellyohgee.com/resources
2. Click on either resource card
3. Fill out the form with YOUR email
4. Submit
5. Check your inbox (and spam folder!)
6. You should receive:
   - ✅ Email with PDF attached
   - ✅ Admin notification to your ADMIN_EMAIL

### Method 2: Test via API (Advanced)

```bash
# Test the endpoint directly
curl -X POST https://personal-website-backend-e74k.onrender.com/api/send-resource \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your_test_email@example.com",
    "phone": "1234567890",
    "countryCode": "+1",
    "resourceType": "wam",
    "emailTemplate": {
      "subject": "Your Free Resource from Kelly Ohgee",
      "text": "Thank you for downloading!",
      "html": "<p>Thank you for downloading!</p>"
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Kelly's WAM Method has been sent to your_test_email@example.com"
}
```

### Method 3: Check Health Status

```bash
curl https://personal-website-backend-e74k.onrender.com/api/health
```

Should show:
```json
{
  "status": "OK",
  "message": "Server is running",
  "sendgridConfigured": true,
  ...
}
```

If `sendgridConfigured: false`, the API key isn't set correctly.

## Troubleshooting

### "SendGrid API key not configured"
- Check that `SENDGRID_API_KEY` is set in Render Environment Variables
- Make sure there are no extra spaces in the key
- Redeploy the backend after adding variables

### "Failed to send email"
- Check that `SENDGRID_FROM_EMAIL` matches your verified sender
- Verify your SendGrid sender email (Step 3)
- Check SendGrid Activity Feed for error details: https://app.sendgrid.com/email_activity

### "Email not received"
- Check spam/junk folder
- Verify email address is correct
- Check SendGrid Activity Feed to see if email was sent
- Make sure you're not over the 100 emails/day limit (free tier)

### CORS Error (from earlier)
✅ Already fixed! Backend now accepts requests from kellyohgee.com

## Email Templates

The system sends two emails per download:

### 1. User Email (with PDF)
- To: User's submitted email
- From: Your verified SendGrid email
- Subject: Custom per resource
- Attachment: Requested PDF
- Content: Custom HTML template from frontend

### 2. Admin Notification
- To: Your ADMIN_EMAIL
- From: Your verified SendGrid email
- Subject: "New Resource Download: [Resource Name]"
- Content: User details (name, email, phone, resource, timestamp)
- No attachment

## SendGrid Free Tier Limits

✅ **100 emails per day** (forever free)
✅ **No credit card required**
✅ **Full API access**
✅ **Email Activity Feed (30 days)**
✅ **Single Sender Verification**

**If you need more:**
- Essentials Plan: $19.95/month (up to 50K emails)
- Pro Plan: $89.95/month (up to 100K emails)

For your website, 100/day is probably plenty. That's:
- Up to 50 resource downloads per day (2 emails each)
- ~1,500 downloads per month
- ~18,000 downloads per year

## Security Notes

✅ **API key is secure** - Stored in Render environment variables (not in code)
✅ **PDFs are server-side** - Not exposed to frontend
✅ **Rate limiting** - Consider adding if you get spam
✅ **Email validation** - Backend validates required fields

## Quick Checklist

Before testing, make sure:
- [ ] SendGrid account created (free)
- [ ] API key generated and copied
- [ ] Sender email verified in SendGrid
- [ ] Environment variables added to Render:
  - [ ] SENDGRID_API_KEY
  - [ ] SENDGRID_FROM_EMAIL (matches verified sender)
  - [ ] FROM_NAME
  - [ ] ADMIN_EMAIL
- [ ] Backend redeployed (automatic after saving env vars)
- [ ] Test email sent successfully

Once all checked, your PDF downloads will work perfectly! 🎉
