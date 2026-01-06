# Social Media API Setup Guide

This guide explains how to configure API keys for real-time Instagram, Twitter, and TikTok follower counts.

## Required Environment Variables

Add these variables to your `.env` file in the `backend` directory:

### Instagram API

**Option 1: Instagram Graph API (Recommended for Business Accounts)**
```
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
```

To get an Instagram Access Token:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add Instagram Basic Display or Instagram Graph API product
4. Generate an access token with `instagram_basic` and `pages_read_engagement` permissions
5. For follower count, you need an Instagram Business Account connected to a Facebook Page

**Option 2: RapidAPI (Third-party service)**
```
RAPIDAPI_KEY=your_rapidapi_key
```

To get a RapidAPI key:
1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to an Instagram scraper API (e.g., "Instagram Scraper API2")
3. Copy your API key from the dashboard

### Twitter API

**Option 1: Twitter API v2 (Recommended)**
```
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
```

To get a Twitter Bearer Token:
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new project and app
3. Generate a Bearer Token in the "Keys and tokens" section
4. Make sure your app has read permissions

**Option 2: RapidAPI (Third-party service)**
```
RAPIDAPI_KEY=your_rapidapi_key
```

To get a RapidAPI key:
1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to a Twitter API (e.g., "Twitter API45")
3. Copy your API key from the dashboard

### TikTok API

**Option 1: TikHub.io API**
```
TIKHUB_API_KEY=your_tikhub_api_key
```

To get a TikHub API key:
1. Sign up at [TikHub.io](https://www.tikhub.io/)
2. Generate an API key from your dashboard
3. Subscribe to a plan if required

**Option 2: RapidAPI (Third-party service)**
```
RAPIDAPI_KEY=your_rapidapi_key
```

To get a RapidAPI key:
1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to a TikTok scraper API (e.g., "TikTok Scraper2")
3. Copy your API key from the dashboard

### YouTube API

**Required for Latest Video Feature**
```
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_channel_id
```

To get a YouTube API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "YouTube Data API v3"
4. Create credentials (API Key)
5. Restrict the API key to YouTube Data API v3 for security
6. Get your Channel ID from your YouTube channel's "About" page URL

## Example .env File

```env
# SendGrid (existing)
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=your_email@example.com
FROM_NAME=Kelly Ohgee
ADMIN_EMAIL=admin@example.com

# YouTube (required for latest video feature)
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=UCM84WjkyLm1_sa17G8DYzRg

# Instagram (choose one method)
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
# OR
RAPIDAPI_KEY=your_rapidapi_key

# Twitter (choose one method)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
# OR use RAPIDAPI_KEY (same as above)

# TikTok (choose one method)
TIKHUB_API_KEY=your_tikhub_key
# OR use RAPIDAPI_KEY (same as above)
```

## API Endpoints

Once configured, the following endpoints are available:

- `GET /api/instagram-followers` - Get Instagram follower count
- `GET /api/twitter-followers` - Get Twitter follower count
- `GET /api/tiktok-followers` - Get TikTok follower count
- `GET /api/youtube-latest-video` - Get latest YouTube video ID
- `GET /api/social-followers` - Get all follower counts at once
- `GET /api/health` - Check API configuration status

## Caching

Follower counts are cached for 12 hours to:
- Reduce API rate limit usage
- Improve response times
- Lower costs

The cache is stored in-memory on the server and will reset when the server restarts.

## Rate Limits

Each API provider has different rate limits:
- **Instagram Graph API**: Varies by app tier
- **Twitter API v2**: 300 requests per 15 minutes (free tier)
- **TikTok APIs**: Varies by provider and plan

The 12-hour cache helps stay within these limits.

## Troubleshooting

### "Failed to fetch followers" error
- Check that your API keys are correctly set in `.env`
- Verify your API keys are valid and not expired
- Check API provider status pages
- Review server logs for specific error messages

### "No valid API configuration found" error
- Ensure at least one API method is configured for each platform
- Restart the server after adding new environment variables
- Check that `.env` file is in the `backend` directory

### Cached values not updating
- Cache expires after 12 hours
- Restart the server to clear cache immediately
- Check the `cached` field in API responses

## Notes

- The system will fallback to hardcoded values if API calls fail
- You can use different API providers for different platforms
- RapidAPI can be used for all three platforms with a single key
- For production, consider using environment variables from your hosting provider
