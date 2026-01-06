# Quick Fix for Safari SSL Issue

## The Problem
Safari shows "can't establish a secure connection" but works on mobile data.

## Most Likely Cause
Cloudflare SSL/TLS settings need to be configured correctly for Safari's strict validation.

## Immediate Fix (5 minutes)

### Step 1: Login to Cloudflare
1. Go to https://dash.cloudflare.com
2. Select your domain: **kellyohgee.info**

### Step 2: Update SSL/TLS Settings
1. Click **SSL/TLS** in the left sidebar
2. Go to **Overview** tab
3. Set **SSL/TLS encryption mode** to: **"Full (strict)"**
   - This ensures Cloudflare validates your origin certificate properly

### Step 3: Enable HTTPS Redirects
1. Still in **SSL/TLS**
2. Go to **Edge Certificates** tab
3. Enable these settings:
   - ✅ **Always Use HTTPS** (ON)
   - ✅ **Automatic HTTPS Rewrites** (ON)
   - ✅ **Minimum TLS Version**: 1.2 (or 1.3)

### Step 4: Verify Both Domains
1. Go to **SSL/TLS** → **Edge Certificates**
2. Ensure both `kellyohgee.info` and `www.kellyohgee.info` are listed
3. Both should show "Active Certificate"

### Step 5: Clear Cloudflare Cache (Optional)
1. Go to **Caching** → **Configuration**
2. Click **Purge Everything**
3. Wait 30 seconds

## Why This Fixes It

Safari is stricter than other browsers about:
- Certificate chain completeness
- SSL/TLS version requirements
- Mixed content (HTTP on HTTPS pages)

Cloudflare's "Full (strict)" mode ensures:
- ✅ Complete certificate chain is presented
- ✅ Proper SSL handshake
- ✅ Safari-compatible certificate validation

## Test After Fix

1. **Clear Safari cache**:
   - Safari → Preferences → Privacy → Manage Website Data
   - Remove kellyohgee.info
   - Close and reopen Safari

2. **Test the site**:
   - Go to https://kellyohgee.info
   - Should load without SSL errors

3. **Verify SSL**:
   - Click the lock icon in Safari's address bar
   - Should show "Valid Certificate"

## If Still Not Working

### Check Network
- Try different WiFi network
- Try mobile hotspot
- Safari might be blocking due to network-level SSL inspection

### Safari-Specific
1. **Reset Safari SSL state**:
   - Safari → Preferences → Advanced
   - Check "Show Develop menu in menu bar"
   - Develop → Empty Caches
   - Quit Safari completely

2. **Check System Date**:
   - System Preferences → Date & Time
   - Ensure date/time is correct
   - Safari validates certificates against system time

### Verify Certificate
Run this command to check certificate:
```bash
openssl s_client -connect kellyohgee.info:443 -servername kellyohgee.info < /dev/null 2>&1 | grep "Verify return code"
```

Should show: `Verify return code: 0 (ok)`

## Expected Result

After these changes:
- ✅ Safari can connect without errors
- ✅ Works on WiFi and mobile data
- ✅ No SSL warnings
- ✅ Valid certificate shown in Safari

## Contact

If issues persist after these steps:
1. Check Cloudflare SSL/TLS dashboard for warnings
2. Contact Cloudflare support
3. Verify origin server SSL configuration
