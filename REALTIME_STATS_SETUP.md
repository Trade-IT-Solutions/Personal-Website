# Real-Time Social Media Stats Setup

## Current Status
✅ **Fallback values are working** - Shows accurate hardcoded counts:
- Instagram: 174K+
- Twitter: 36.1K+  
- TikTok: 224K+
- YouTube: 447K+

❌ **Real-time updates** - Requires API keys (not configured yet)

## Easiest Solution: RapidAPI (One Key for All)

### Step 1: Get RapidAPI Key (FREE)

1. Go to [RapidAPI](https://rapidapi.com/auth/sign-up)
2. Sign up for a free account
3. Go to [My Apps](https://rapidapi.com/developer/apps)
4. Copy your **API Key**

### Step 2: Subscribe to APIs (FREE Tiers Available)

Subscribe to these APIs (all have free tiers):

1. **Instagram**: [Instagram Scraper API2](https://rapidapi.com/social-api1-instagram/api/instagram-scraper-api2)
   - Click "Subscribe to Test"
   - Choose "Basic" (Free - 500 requests/month)

2. **Twitter/X**: [Twitter API45](https://rapidapi.com/bonaventure/api/twitter-api45)
   - Click "Subscribe to Test"
   - Choose "Basic" (Free - 500 requests/month)

3. **TikTok**: [TikTok Scraper2](https://rapidapi.com/social-api1-tiktok/api/tiktok-scraper2)
   - Click "Subscribe to Test"  
   - Choose "Basic" (Free - 500 requests/month)

### Step 3: Add to Render Environment Variables

Go to your Render dashboard:
1. Select your backend service (personal-website-backend)
2. Go to **Environment** tab
3. Add this variable:

```
RAPIDAPI_KEY=your_rapidapi_key_here
```

4. Click **Save Changes** - Render will automatically redeploy

### Step 4: Verify It's Working

After deployment (2-3 minutes), test the endpoints:

```bash
# Test Instagram
curl https://personal-website-backend-e74k.onrender.com/api/instagram-followers

# Test Twitter
curl https://personal-website-backend-e74k.onrender.com/api/twitter-followers

# Test TikTok
curl https://personal-website-backend-e74k.onrender.com/api/tiktok-followers

# Check all at once
curl https://personal-website-backend-e74k.onrender.com/api/social-followers
```

You should see `"cached": false` in the response, meaning it fetched real-time data.

## Alternative: Official APIs (More Reliable, More Setup)

If you want more reliable data, use official APIs:

### Twitter/X Official API
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Get your **Bearer Token**
4. Add to Render: `TWITTER_BEARER_TOKEN=your_token`

### Instagram Official API
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an app
3. Add Instagram Graph API
4. Get **Access Token** (requires Business Account)
5. Add to Render: `INSTAGRAM_ACCESS_TOKEN=your_token`

### TikTok
Official TikTok API is not publicly available for follower counts.
Use RapidAPI or keep hardcoded values.

## How It Works

1. **First Request**: Fetches real-time data from API
2. **Cached**: Stores result for 12 hours
3. **Subsequent Requests**: Returns cached data (faster, saves API calls)
4. **After 12 Hours**: Fetches fresh data again

## Cost Estimate

**RapidAPI Free Tiers:**
- 500 requests/month per API
- With 12-hour caching: ~1,460 page views/month per platform
- **Total**: ~4,380 free page views/month across all platforms

**Upgrade** if you need more:
- Basic Plan: $10/month (~50,000 requests)
- Pro Plan: $50/month (~500,000 requests)

## Current YouTube API

YouTube is already configured in your `.env` file:
```
YOUTUBE_API_KEY=AIzaSyD_6EZIO3Zr5wTmYCSLq0Kw_8jLmDXOpDc
YOUTUBE_CHANNEL_ID=UCM84WjkyLm1_sa17G8DYzRg
```

Make sure this is also added to Render Environment Variables.

## What Happens Without API Keys

If no API keys are configured:
- ✅ Website still works perfectly
- ✅ Shows accurate hardcoded follower counts
- ❌ Numbers won't update automatically
- ❌ You'll need to manually update fallback values in `backend/server.js`

## Need Help?

Check API configuration status:
```bash
curl https://personal-website-backend-e74k.onrender.com/api/health
```

This shows which APIs are configured and ready to use.
