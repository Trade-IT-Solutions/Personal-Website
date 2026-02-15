# SMTP/SendGrid Security Measures

## Overview
Your SendGrid email service has been secured against common attack vectors. Here's what has been implemented:

## Security Measures Implemented

### 1. **Rate Limiting** ✅
- **Protection**: Prevents abuse and spam attacks
- **Limit**: 5 requests per 15 minutes per IP address
- **Response**: Returns HTTP 429 (Too Many Requests) with retry time
- **Implementation**: In-memory rate limiting (consider Redis for production scaling)

### 2. **Input Validation** ✅
- **Email Format Validation**: Validates email addresses using regex before sending
- **Email Length Check**: Enforces RFC 5321 maximum length (254 characters)
- **Required Fields**: Validates all required fields are present
- **Resource Type Whitelist**: Only allows 'wam' or 'markets' (prevents path traversal)

### 3. **Input Sanitization** ✅
- **Control Character Removal**: Strips dangerous control characters
- **Length Limits**: Enforces maximum lengths on all inputs:
  - Name: 200 characters
  - Email: 254 characters (RFC standard)
  - Phone: 20 characters
  - Country Code: 5 characters
  - Subject: 200 characters
  - Text Body: 5000 characters
  - HTML Body: 50000 characters
- **HTML Escaping**: Escapes HTML in admin notifications to prevent XSS

### 4. **Email Header Injection Prevention** ✅
- **Sender Email**: Always uses `process.env.SENDGRID_FROM_EMAIL` (never user input)
- **Recipient Email**: Sanitized and validated before use
- **Subject/Content**: All user-provided content is sanitized

### 5. **Email Template Validation** ✅
- **Structure Check**: Validates email template has required fields (subject, text, html)
- **Type Checking**: Ensures HTML is a string and within size limits
- **Content Sanitization**: All template content is sanitized before use

### 6. **Path Traversal Protection** ✅
- **PDF File Whitelist**: Only allows predefined PDF files ('wam' or 'markets')
- **Path Construction**: Uses `path.join()` with `__dirname` to prevent directory traversal
- **File Existence Check**: Verifies PDF exists before attempting to read

## Security Best Practices

### ✅ Already Implemented
1. Environment variables for API keys (not hardcoded)
2. Error handling with detailed logging
3. CORS protection
4. Security headers (X-Frame-Options, CSP, etc.)
5. Input validation and sanitization
6. Rate limiting

### ⚠️ Additional Recommendations

#### 1. **SendGrid Account Security**
- **Enable 2FA** on your SendGrid account
- **Use API Key with Minimal Permissions**: Only grant "Mail Send" permission
- **Rotate API Keys Regularly**: Change API keys every 90 days
- **Monitor SendGrid Activity**: Check SendGrid dashboard for unusual activity
- **Verify Sender Email**: Ensure `contact@kellyohgee.info` is verified in SendGrid

#### 2. **Production Enhancements**
- **Use Redis for Rate Limiting**: Current in-memory store resets on server restart
- **Add CAPTCHA**: Consider adding reCAPTCHA to the frontend form
- **IP Whitelisting**: Optionally whitelist known IPs for admin notifications
- **Email Queue**: For high volume, consider using a queue system (Bull, RabbitMQ)
- **Monitoring**: Set up alerts for failed email attempts or rate limit hits

#### 3. **SendGrid Settings**
- **Domain Authentication**: Set up domain authentication (SPF, DKIM, DMARC) for better deliverability
- **IP Reputation**: Monitor your IP reputation in SendGrid dashboard
- **Bounce/Spam Handling**: Configure webhooks for bounce and spam reports

#### 4. **Logging & Monitoring**
- **Log Failed Attempts**: Already implemented
- **Monitor Rate Limit Hits**: Track when rate limits are triggered
- **Alert on Suspicious Activity**: Set up alerts for unusual patterns

## Attack Vectors Protected Against

### ✅ Protected
- **Email Header Injection**: Sanitized inputs prevent injection
- **Spam/Abuse**: Rate limiting prevents mass email sending
- **XSS in Admin Emails**: HTML escaping prevents script injection
- **Path Traversal**: Whitelist approach prevents file system access
- **Invalid Input**: Validation prevents malformed requests
- **API Key Exposure**: Keys stored in environment variables

### ⚠️ Additional Protections Needed
- **DDoS Attacks**: Consider using Cloudflare or similar service
- **Bot Attacks**: Add CAPTCHA to frontend form
- **Account Takeover**: Enable 2FA on SendGrid account

## Testing Security

### Test Rate Limiting
```bash
# Send 6 requests quickly (5th should succeed, 6th should fail)
for i in {1..6}; do
  curl -X POST https://your-backend-url/api/send-resource \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","phone":"123","countryCode":"+1","resourceType":"wam","emailTemplate":{"subject":"Test","text":"Test","html":"<p>Test</p>"}}'
done
```

### Test Input Validation
```bash
# Test invalid email
curl -X POST https://your-backend-url/api/send-resource \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"invalid-email","phone":"123","countryCode":"+1","resourceType":"wam","emailTemplate":{"subject":"Test","text":"Test","html":"<p>Test</p>"}}'
```

## Current Security Status: **SECURE** ✅

Your email endpoint is now protected against common attack vectors. The main remaining risks are:
1. SendGrid account compromise (mitigate with 2FA)
2. API key exposure (already using environment variables)
3. DDoS attacks (mitigate with Cloudflare or similar)

## Questions?

If you notice any suspicious activity:
1. Check SendGrid dashboard for unusual sends
2. Review server logs for rate limit hits
3. Rotate API keys if compromised
4. Contact SendGrid support if needed
