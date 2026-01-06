# WiFi SSL Issue - Works on Mobile Data, Not WiFi

## The Problem
- ✅ Render shows "Certificate Issued" (green badges)
- ✅ Works on mobile data in USA
- ❌ Doesn't work on WiFi (Safari can't establish secure connection)

## Root Cause
This is a **WiFi network issue**, not a website problem. Common causes:

1. **WiFi Network SSL Inspection/Proxy**
   - Corporate/school WiFi often intercepts SSL
   - Firewall/proxy certificates not trusted by Safari
   - Network-level SSL inspection

2. **DNS Issues on WiFi**
   - WiFi router using different DNS servers
   - DNS cache issues
   - Router blocking certain domains

3. **WiFi Firewall/Security**
   - Router blocking HTTPS connections
   - Port 443 blocked
   - Security software interfering

4. **Certificate Chain Issues**
   - WiFi network's proxy certificate not in Safari's trust store
   - Corporate certificates not installed

## Solutions

### Solution 1: Change WiFi DNS (Easiest)
Use public DNS servers instead of router's default:

**On Mac:**
1. System Preferences → Network
2. Select your WiFi connection
3. Click "Advanced" → "DNS" tab
4. Click "+" and add:
   - `8.8.8.8` (Google DNS)
   - `8.8.4.4` (Google DNS backup)
   - `1.1.1.1` (Cloudflare DNS)
5. Click "OK" → "Apply"
6. Restart Safari

**On iPhone/iPad:**
1. Settings → Wi-Fi
2. Tap the "i" next to your WiFi network
3. Scroll to "Configure DNS"
4. Select "Manual"
5. Add servers: `8.8.8.8`, `1.1.1.1`
6. Save and reconnect

### Solution 2: Bypass WiFi Proxy (If Corporate/School WiFi)
1. **Check if proxy is enabled:**
   - System Preferences → Network → WiFi → Advanced → Proxies
   - If any proxies are checked, try unchecking them
   - Note: This might break other network access

2. **Use mobile hotspot instead:**
   - If on corporate/school WiFi, use personal mobile hotspot
   - This bypasses network-level SSL inspection

### Solution 3: Clear Safari SSL Cache
Safari might have cached a bad certificate from WiFi:

1. **Safari → Preferences → Privacy**
2. Click "Manage Website Data"
3. Search for "kellyohgee"
4. Click "Remove"
5. **Safari → Develop → Empty Caches**
   - (Enable Develop menu: Safari → Preferences → Advanced → Show Develop menu)
6. Quit Safari completely
7. Reconnect to WiFi and try again

### Solution 4: Check System Date/Time
Safari validates certificates against system time:

1. **System Preferences → Date & Time**
2. Ensure "Set date and time automatically" is checked
3. Or manually set correct date/time
4. Restart Safari

### Solution 5: Try Different WiFi Network
Test if it's specific to your WiFi:

1. Try a different WiFi network (coffee shop, friend's house)
2. If it works on other WiFi → issue is with your specific WiFi
3. If it doesn't work on any WiFi → different issue

### Solution 6: Router Settings (If You Control Router)
If you own/admin the WiFi router:

1. **Disable SSL Inspection** (if enabled):
   - Router admin panel → Security → SSL Inspection
   - Disable if present

2. **Change Router DNS**:
   - Router settings → DNS
   - Set to: `8.8.8.8` and `1.1.1.1`
   - Save and restart router

3. **Check Firewall Rules**:
   - Ensure port 443 (HTTPS) is not blocked
   - Allow outbound HTTPS connections

## Why It Works on Mobile Data

Mobile data:
- ✅ Bypasses WiFi network restrictions
- ✅ Uses carrier's DNS (usually reliable)
- ✅ No SSL inspection/proxy
- ✅ Direct connection to internet

WiFi:
- ❌ May have SSL inspection
- ❌ May use router's DNS (could be problematic)
- ❌ May have firewall rules
- ❌ May intercept SSL connections

## Quick Test

To confirm it's WiFi-specific:

1. **On WiFi**: Try https://kellyohgee.info → Fails
2. **Switch to mobile data**: Try https://kellyohgee.info → Works
3. **This confirms**: WiFi network is the issue

## Recommended Fix Order

1. ✅ **Change DNS to 8.8.8.8** (easiest, often fixes it)
2. ✅ **Clear Safari cache** (removes bad cached certificates)
3. ✅ **Check system date/time** (Safari requirement)
4. ✅ **Try different WiFi** (isolate the issue)
5. ✅ **Check router settings** (if you control it)

## For Users Experiencing This

If users report this issue, tell them:

1. **Try mobile data first** (confirms site works)
2. **Change WiFi DNS to 8.8.8.8**
3. **Clear Safari cache**
4. **If on corporate WiFi**: Contact IT (they may need to whitelist domain)

## Verification

After applying fixes:

```bash
# Test DNS resolution
nslookup kellyohgee.info

# Test SSL connection
curl -vI https://kellyohgee.info
```

## Expected Result

After fixing WiFi DNS:
- ✅ Safari connects on WiFi
- ✅ Works on mobile data (still works)
- ✅ No SSL errors
- ✅ Valid certificate shown

## Important Notes

- **This is NOT a website problem** - site is working correctly
- **Render certificates are valid** - green badges confirm this
- **Issue is WiFi network configuration** - DNS or SSL inspection
- **Mobile data works** - confirms site is fine
