const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for global access
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://personal-website-us3x.onrender.com',
  'https://www.kellyohgee.info',
  'https://kellyohgee.info',
  'https://www.kellyohgee.com',
  'https://kellyohgee.com'
];

// In production, allow requests from the main domain and any subdomain
const isProduction = process.env.NODE_ENV === 'production';
const allowedDomains = ['kellyohgee.info', 'kellyohgee.com'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Always allow localhost in development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // In production, allow main domains and subdomains
    if (isProduction) {
      try {
        const url = new URL(origin);
        // Allow exact matches
        if (allowedOrigins.indexOf(origin) !== -1) {
          return callback(null, true);
        }
        // Allow all configured domains and their www subdomains
        for (const domain of allowedDomains) {
          if (url.hostname === domain || url.hostname === `www.${domain}`) {
            return callback(null, true);
          }
        }
      } catch (e) {
        // Invalid origin URL
      }
    }
    
    // Check against allowed origins list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // In development, be more permissive
    if (!isProduction) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Security headers middleware
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Strict Transport Security (HTTPS only)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Content Security Policy - Tightened for better security
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.google.com https://www.gstatic.com https://apis.google.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com; " +
    "font-src 'self' https://fonts.gstatic.com https://fonts.cdnfonts.com data:; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://www.googleapis.com https://api.twitter.com https://graph.instagram.com https://graph.facebook.com https://api.tiktok.com https://www.tikhub.io https://*.rapidapi.com https://*.p.rapidapi.com https://personal-website-backend-e74k.onrender.com; " +
    "frame-src 'self' https://www.youtube.com https://youtube.com https://www.google.com; " +
    "media-src 'self' https://www.youtube.com; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "upgrade-insecure-requests;"
  );
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()');
  // Additional security headers
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  // Note: Cross-Origin policies removed to allow frontend access
  next();
});

// Set SendGrid API Key
if (process.env.SENDGRID_API_KEY) {
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('SendGrid API Key configured');
} else {
  console.warn('WARNING: SENDGRID_API_KEY not found in environment variables');
}

// Email sending endpoint
app.post('/api/send-resource', async (req, res) => {
  try {
    // Check if SendGrid is configured before processing
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
      console.error('SendGrid not configured - missing API key or FROM email');
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured. Please contact support at contact@kellyohgee.com',
        error: 'SENDGRID_API_KEY or SENDGRID_FROM_EMAIL not set'
      });
    }

    const { name, email, phone, countryCode, resourceType, emailTemplate } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !resourceType || !emailTemplate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Determine which PDF to send
    let pdfFileName, pdfPath, resourceTitle;
    
    if (resourceType === 'wam') {
      pdfFileName = 'kellys-wam-method.pdf';
      pdfPath = path.join(__dirname, 'pdfs', pdfFileName);
      resourceTitle = "Kelly's WAM Method";
    } else if (resourceType === 'markets') {
      pdfFileName = 'read-markets-like-story.pdf';
      pdfPath = path.join(__dirname, 'pdfs', pdfFileName);
      resourceTitle = 'How to Read the Markets Like a Story';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource type'
      });
    }

    // Check if PDF exists
    if (!fs.existsSync(pdfPath)) {
      console.error(`PDF not found: ${pdfPath}`);
      console.error(`Looking for PDF at: ${pdfPath}`);
      console.error(`Current directory: ${__dirname}`);
      console.error(`PDFs directory exists: ${fs.existsSync(path.join(__dirname, 'pdfs'))}`);
      
      return res.status(404).json({
        success: false,
        message: 'Resource file not found. Please contact support.',
        error: 'PDF file missing'
      });
    }

    // Read PDF and convert to base64
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBuffer.toString('base64');

    // Prepare email to user
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.FROM_NAME || 'Kelly Ohgee'
      },
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
      attachments: [
        {
          content: pdfBase64,
          filename: pdfFileName,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };

    // Send email to user
    try {
    await sgMail.send(msg);
      console.log(`Email sent successfully to ${email} with PDF: ${pdfFileName}`);
    } catch (sendError) {
      console.error('Failed to send email to user:', sendError);
      // Re-throw to be caught by outer catch block
      throw sendError;
    }

    // Send admin notification (don't fail if this fails)
    try {
    const adminNotification = {
      to: process.env.ADMIN_EMAIL || process.env.SENDGRID_FROM_EMAIL,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: 'Kelly Website'
      },
      subject: `New Resource Download: ${resourceTitle}`,
      text: `New resource request:\n\nName: ${name}\nEmail: ${email}\nPhone: ${countryCode} ${phone}\nResource: ${resourceTitle}\nTime: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #22201D;">New Resource Download</h2>
          <p><strong>Resource:</strong> ${resourceTitle}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${countryCode} ${phone}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    await sgMail.send(adminNotification);
      console.log(`Admin notification sent to ${process.env.ADMIN_EMAIL || process.env.SENDGRID_FROM_EMAIL}`);
    } catch (adminError) {
      // Log but don't fail the request if admin notification fails
      console.error('Failed to send admin notification:', adminError);
      console.log('User email was sent successfully, but admin notification failed');
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: `${resourceTitle} has been sent to ${email}`
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('SendGrid error details:', JSON.stringify(error.response.body, null, 2));
      console.error('SendGrid error status:', error.response.status);
    }
    
    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key is not configured!');
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured. Please contact support.',
        error: 'SENDGRID_API_KEY not set'
      });
    }
    
    // Check if sender email is configured
    if (!process.env.SENDGRID_FROM_EMAIL) {
      console.error('SendGrid FROM email is not configured!');
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured. Please contact support.',
        error: 'SENDGRID_FROM_EMAIL not set'
      });
    }
    
    // Provide more helpful error messages based on SendGrid response
    let errorMessage = 'Failed to send email. Please try again later.';
    if (error.response?.body?.errors) {
      const sendGridError = error.response.body.errors[0];
      if (sendGridError.message) {
        errorMessage = `Email error: ${sendGridError.message}`;
        
        // Check for common SendGrid errors
        if (sendGridError.message.includes('sender email') || sendGridError.message.includes('verified')) {
          errorMessage = 'Sender email is not verified in SendGrid. Please verify contact@kellyohgee.info in your SendGrid account.';
        } else if (sendGridError.message.includes('API key') || sendGridError.message.includes('unauthorized')) {
          errorMessage = 'SendGrid API key is invalid or expired. Please check your API key configuration.';
        } else if (sendGridError.message.includes('rate limit')) {
          errorMessage = 'Email sending rate limit exceeded. Please try again later.';
        }
      }
      
      // Log full error details for debugging
      console.error('SendGrid error code:', sendGridError.field || 'unknown');
      console.error('SendGrid error message:', sendGridError.message);
    } else if (error.message) {
      console.error('SendGrid error (no response body):', error.message);
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// In-memory cache for follower counts and YouTube videos (12 hour expiry)
const followerCache = {
  instagram: { value: null, timestamp: 0 },
  twitter: { value: null, timestamp: 0 },
  tiktok: { value: null, timestamp: 0 },
  youtubeVideo: null,
  youtubeVideoTime: 0
};

const CACHE_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours

// Helper function to format follower count
const formatFollowerCount = (count) => {
  if (!count || count === 0) return '0';
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M+`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k+`;
  }
  return count.toString();
};

// Helper function to check cache validity
const isCacheValid = (platform) => {
  const cached = followerCache[platform];
  return cached && cached.value && (Date.now() - cached.timestamp < CACHE_EXPIRY);
};

// Helper function for API requests with timeout and global error handling
const makeApiRequest = async (url, options = {}, timeout = 15000) => {
  try {
    const response = await axios.get(url, {
      ...options,
      timeout: timeout,
      // Add headers for global compatibility
      headers: {
        'Accept': 'application/json',
        'Accept-Language': '*',
        'User-Agent': 'Mozilla/5.0 (compatible; KellyWebsite/1.0)',
        ...options.headers
      },
      // Add retry configuration for better global reliability
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Don't throw on 4xx errors
      }
    });
    return response;
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Request timeout - service may be unavailable in your region');
    }
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Service unavailable - may be restricted in your region');
    }
    throw error;
  }
};

// Instagram Follower Count Endpoint
app.get('/api/instagram-followers', async (req, res) => {
  try {
    // Check cache first
    if (isCacheValid('instagram')) {
      return res.json({
        success: true,
        followers: followerCache.instagram.value,
        cached: true
      });
    }

    // Option 1: Instagram Graph API (requires access token)
    if (process.env.INSTAGRAM_ACCESS_TOKEN) {
      try {
        const response = await makeApiRequest(
          `https://graph.instagram.com/me?fields=username,account_type&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
        );
        
        // Get user ID first
        const userId = response.data.id;
        
        // Get insights (requires Instagram Business Account)
        const insightsResponse = await makeApiRequest(
          `https://graph.facebook.com/v18.0/${userId}?fields=followers_count&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
        );
        
        const count = insightsResponse.data.followers_count;
        const formatted = formatFollowerCount(count);
        
        followerCache.instagram = { value: formatted, timestamp: Date.now() };
        
        return res.json({
          success: true,
          followers: formatted,
          cached: false
        });
      } catch (error) {
        console.error('Instagram Graph API error:', error.message);
        // Fall through to alternative method
      }
    }

    // Option 2: Third-party API (RapidAPI or similar)
    if (process.env.RAPIDAPI_KEY) {
      try {
        const response = await makeApiRequest(
          'https://instagram-scraper-api2.p.rapidapi.com/userinfo/kellyohgee',
          {
            headers: {
              'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com'
            }
          }
        );
        
        const count = response.data?.data?.follower_count || 0;
        const formatted = formatFollowerCount(count);
        
        followerCache.instagram = { value: formatted, timestamp: Date.now() };
        
        return res.json({
          success: true,
          followers: formatted,
          cached: false
        });
      } catch (error) {
        console.error('RapidAPI Instagram error:', error.message);
      }
    }

    // Fallback: Use accurate hardcoded value (185K from Instagram)
    const fallbackValue = '185K';
    followerCache.instagram = { value: fallbackValue, timestamp: Date.now() };
    
    return res.json({
      success: true,
      followers: fallbackValue,
      cached: false,
      note: 'Using fallback value. Configure API keys for real-time updates.'
    });

  } catch (error) {
    console.error('Instagram followers error:', error);
    const fallbackValue = '185K';
    res.status(200).json({
      success: true,
      followers: fallbackValue,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Twitter Follower Count Endpoint
app.get('/api/twitter-followers', async (req, res) => {
  try {
    // Check cache first
    if (isCacheValid('twitter')) {
      return res.json({
        success: true,
        followers: followerCache.twitter.value,
        cached: true
      });
    }

    // Twitter API v2
    if (process.env.TWITTER_BEARER_TOKEN) {
      try {
        const response = await makeApiRequest(
          'https://api.twitter.com/2/users/by/username/kellyohgee?user.fields=public_metrics',
          {
            headers: {
              'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
            }
          }
        );
        
        const count = response.data?.data?.public_metrics?.followers_count || 0;
        const formatted = formatFollowerCount(count);
        
        followerCache.twitter = { value: formatted, timestamp: Date.now() };
        
        return res.json({
          success: true,
          followers: formatted,
          cached: false
        });
      } catch (error) {
        console.error('Twitter API error:', error.response?.data || error.message);
      }
    }

    // Alternative: Third-party API
    if (process.env.RAPIDAPI_KEY) {
      try {
        const response = await makeApiRequest(
          'https://twitter-api45.p.rapidapi.com/user.php?username=kellyohgee',
          {
            headers: {
              'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'twitter-api45.p.rapidapi.com'
            }
          }
        );
        
        const count = response.data?.followers_count || 0;
        const formatted = formatFollowerCount(count);
        
        followerCache.twitter = { value: formatted, timestamp: Date.now() };
        
        return res.json({
          success: true,
          followers: formatted,
          cached: false
        });
      } catch (error) {
        console.error('RapidAPI Twitter error:', error.message);
      }
    }

    // Fallback: Use accurate hardcoded value (35.7K from X/Twitter)
    const fallbackValue = '35.7K';
    followerCache.twitter = { value: fallbackValue, timestamp: Date.now() };
    
    return res.json({
      success: true,
      followers: fallbackValue,
      cached: false,
      note: 'Using fallback value. Configure API keys for real-time updates.'
    });

  } catch (error) {
    console.error('Twitter followers error:', error);
    const fallbackValue = '35.7K';
    res.status(200).json({
      success: true,
      followers: fallbackValue,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// TikTok Follower Count Endpoint
app.get('/api/tiktok-followers', async (req, res) => {
  try {
    // Check cache first
    if (isCacheValid('tiktok')) {
      return res.json({
        success: true,
        followers: followerCache.tiktok.value,
        cached: true
      });
    }

    // TikHub.io API
    if (process.env.TIKHUB_API_KEY) {
      try {
        const response = await makeApiRequest(
          'https://www.tikhub.io/api/v1/user/info',
          {
            params: {
              username: 'kellyohgee'
            },
            headers: {
              'Authorization': `Bearer ${process.env.TIKHUB_API_KEY}`
            }
          }
        );
        
        const count = response.data?.data?.follower_count || 0;
        const formatted = formatFollowerCount(count);
        
        followerCache.tiktok = { value: formatted, timestamp: Date.now() };
        
        return res.json({
          success: true,
          followers: formatted,
          cached: false
        });
      } catch (error) {
        console.error('TikHub API error:', error.response?.data || error.message);
      }
    }

    // Alternative: RapidAPI TikTok
    if (process.env.RAPIDAPI_KEY) {
      try {
        const response = await makeApiRequest(
          'https://tiktok-scraper2.p.rapidapi.com/user/info',
          {
            params: {
              username: 'kellyohgee'
            },
            headers: {
              'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'tiktok-scraper2.p.rapidapi.com'
            }
          }
        );
        
        const count = response.data?.data?.userInfo?.stats?.followerCount || 0;
        const formatted = formatFollowerCount(count);
        
        followerCache.tiktok = { value: formatted, timestamp: Date.now() };
        
        return res.json({
          success: true,
          followers: formatted,
          cached: false
        });
      } catch (error) {
        console.error('RapidAPI TikTok error:', error.message);
      }
    }

    // Fallback: Use accurate hardcoded value (226K from TikTok)
    const fallbackValue = '226K';
    followerCache.tiktok = { value: fallbackValue, timestamp: Date.now() };
    
    return res.json({
      success: true,
      followers: fallbackValue,
      cached: false,
      note: 'Using fallback value. Configure API keys for real-time updates.'
    });

  } catch (error) {
    console.error('TikTok followers error:', error);
    const fallbackValue = '226K';
    res.status(200).json({
      success: true,
      followers: fallbackValue,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// YouTube Subscribers Endpoint
app.get('/api/youtube-subscribers', async (req, res) => {
  try {
    // Check cache first
    if (isCacheValid('youtube')) {
      return res.json({
        success: true,
        subscribers: followerCache.youtube.value,
        cached: true
      });
    }

    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCM84WjkyLm1_sa17G8DYzRg';

    if (!API_KEY) {
      // Fallback: Use accurate hardcoded value (447K from YouTube)
      const fallbackValue = '447K';
      followerCache.youtube = { value: fallbackValue, timestamp: Date.now() };
      
      return res.json({
        success: true,
        subscribers: fallbackValue,
        cached: false,
        note: 'Using fallback value. Configure API keys for real-time updates.'
      });
    }

    try {
      const response = await makeApiRequest(
        `https://www.googleapis.com/youtube/v3/channels`,
        {
          params: {
            part: 'statistics',
            id: CHANNEL_ID,
            key: API_KEY
          }
        }
      );

      const subscriberCount = response.data.items?.[0]?.statistics?.subscriberCount || 0;
      const formatted = formatFollowerCount(subscriberCount);
      
      followerCache.youtube = { value: formatted, timestamp: Date.now() };
      
      return res.json({
        success: true,
        subscribers: formatted,
        cached: false
      });

    } catch (error) {
      console.error('YouTube API error:', error.message);
      // Fallback to hardcoded value
      const fallbackValue = '447K';
      followerCache.youtube = { value: fallbackValue, timestamp: Date.now() };
      
      return res.json({
        success: true,
        subscribers: fallbackValue,
        cached: false,
        note: 'Using fallback value due to API error.'
      });
    }

  } catch (error) {
    console.error('YouTube subscribers error:', error);
    const fallbackValue = '447K';
    res.status(200).json({
      success: true,
      subscribers: fallbackValue,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// YouTube Latest Video Endpoint
app.get('/api/youtube-latest-video', async (req, res) => {
  try {
    const cacheKey = 'youtubeLatestVideo';
    const cacheTimeKey = 'youtubeLatestVideoTime';
    const twelveHours = 12 * 60 * 60 * 1000;

    // Check cache
    const cachedVideo = followerCache.youtubeVideo || null;
    const cachedTime = followerCache.youtubeVideoTime || 0;
    
    if (cachedVideo && (Date.now() - cachedTime < twelveHours)) {
      return res.json({
        success: true,
        videoId: cachedVideo,
        cached: true
      });
    }

    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCM84WjkyLm1_sa17G8DYzRg';

    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'YouTube API key not configured'
      });
    }

    try {
      // Step 1: Get the channel's uploads playlist ID
      const channelResponse = await makeApiRequest(
        `https://www.googleapis.com/youtube/v3/channels`,
        {
          params: {
            key: API_KEY,
            id: CHANNEL_ID,
            part: 'contentDetails',
            maxResults: 1
          }
        }
      );

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      const uploadsPlaylistId = channelResponse.data.items[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        throw new Error('Uploads playlist not found');
      }

      // Step 2: Get the latest video from the uploads playlist
      const playlistResponse = await makeApiRequest(
        `https://www.googleapis.com/youtube/v3/playlistItems`,
        {
          params: {
            key: API_KEY,
            playlistId: uploadsPlaylistId,
            part: 'snippet',
            maxResults: 1
          }
        }
      );

      if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
        throw new Error('No videos found');
      }

      const videoId = playlistResponse.data.items[0]?.snippet?.resourceId?.videoId;

      if (!videoId) {
        throw new Error('Video ID not found');
      }

      // Cache the result
      followerCache.youtubeVideo = videoId;
      followerCache.youtubeVideoTime = Date.now();

      res.json({
        success: true,
        videoId: videoId,
        cached: false
      });

    } catch (error) {
      console.error('YouTube API error:', error.message);
      
      // Fallback to search method
      try {
        const searchResponse = await makeApiRequest(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              key: API_KEY,
              channelId: CHANNEL_ID,
              part: 'snippet,id',
              order: 'date',
              maxResults: 1,
              type: 'video'
            }
          }
        );

        if (searchResponse.data.items && searchResponse.data.items.length > 0) {
          const videoId = searchResponse.data.items[0]?.id?.videoId;
          
          if (videoId) {
            followerCache.youtubeVideo = videoId;
            followerCache.youtubeVideoTime = Date.now();
            
            return res.json({
              success: true,
              videoId: videoId,
              cached: false
            });
          }
        }
      } catch (searchError) {
        console.error('YouTube search fallback error:', searchError.message);
      }

      res.status(500).json({
        success: false,
        message: 'Failed to fetch latest YouTube video',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

  } catch (error) {
    console.error('YouTube latest video error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest YouTube video',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Combined endpoint to get all follower counts at once
app.get('/api/social-followers', async (req, res) => {
  try {
    const results = {
      instagram: null,
      twitter: null,
      tiktok: null
    };

    // Fetch all in parallel using internal endpoints
    // Use localhost for internal calls to avoid issues with req.protocol
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `https://${req.get('host')}`
      : `http://localhost:${PORT}`;
    
    const [instagramRes, twitterRes, tiktokRes] = await Promise.allSettled([
      axios.get(`${baseUrl}/api/instagram-followers`).catch(() => ({ data: { success: false } })),
      axios.get(`${baseUrl}/api/twitter-followers`).catch(() => ({ data: { success: false } })),
      axios.get(`${baseUrl}/api/tiktok-followers`).catch(() => ({ data: { success: false } }))
    ]);

    if (instagramRes.status === 'fulfilled' && instagramRes.value.data?.success) {
      results.instagram = instagramRes.value.data.followers;
    }

    if (twitterRes.status === 'fulfilled' && twitterRes.value.data?.success) {
      results.twitter = twitterRes.value.data.followers;
    }

    if (tiktokRes.status === 'fulfilled' && tiktokRes.value.data?.success) {
      results.tiktok = tiktokRes.value.data.followers;
    }

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Social followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch social followers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    sendgridConfigured: !!process.env.SENDGRID_API_KEY,
    instagramConfigured: !!process.env.INSTAGRAM_ACCESS_TOKEN || !!process.env.RAPIDAPI_KEY,
    twitterConfigured: !!process.env.TWITTER_BEARER_TOKEN || !!process.env.RAPIDAPI_KEY,
    tiktokConfigured: !!process.env.TIKHUB_API_KEY || !!process.env.RAPIDAPI_KEY
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`SendGrid API Key configured: ${!!process.env.SENDGRID_API_KEY}`);
});
