import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./SectionStats.module.css";

const CACHE_EXPIRY_TIME = 12 * 60 * 60 * 1000; // 12 hours

// Backend API URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://personal-website-backend-e74k.onrender.com'
  : 'http://localhost:5000';

const SectionStats = ({ className = "" }) => {
  const [youtubeSubscribers, setYoutubeSubscribers] = useState("Loading...");
  const [instagramFollowers, setInstagramFollowers] = useState("Loading...");
  const [twitterFollowers, setTwitterFollowers] = useState("Loading...");
  const [tiktokFollowers, setTiktokFollowers] = useState("Loading...");

  // Function to check cache validity
  const isCacheValid = (key) => {
    const cachedData = JSON.parse(localStorage.getItem(key));
    return cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY_TIME;
  };

  // Function to store data in localStorage
  const storeCache = (key, data) => {
    localStorage.setItem(
      key,
      JSON.stringify({ value: data, timestamp: Date.now() })
    );
  };

  // Function to get cached data
  const getCachedData = (key) => {
    const cachedData = JSON.parse(localStorage.getItem(key));
    return cachedData ? cachedData.value : null;
  };

  // Fetch all social media follower counts
  useEffect(() => {
    // Fetch YouTube Subscribers
    const fetchYoutubeSubscribers = async () => {
      const cacheKey = "youtubeSubscribers";
      if (isCacheValid(cacheKey)) {
        setYoutubeSubscribers(getCachedData(cacheKey));
        return;
      }

      try {
        const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
        const CHANNEL_ID = process.env.REACT_APP_YOUTUBE_CHANNEL_ID;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`
        );
        const data = await response.json();
        const subscriberCount = data.items[0]?.statistics?.subscriberCount || 0;

        const formattedCount =
          subscriberCount >= 1000
            ? `${(subscriberCount / 1000).toFixed(1).replace(/\.0$/, "")}k+`
            : subscriberCount.toString();

        setYoutubeSubscribers(formattedCount);
        storeCache(cacheKey, formattedCount);
      } catch (error) {
        console.error("Failed to fetch YouTube subscribers:", error);
        setYoutubeSubscribers("Error");
      }
    };

    // Fetch Instagram Followers
    const fetchInstagramFollowers = async () => {
      const cacheKey = "instagramFollowers";
      if (isCacheValid(cacheKey)) {
        setInstagramFollowers(getCachedData(cacheKey));
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/instagram-followers`);
        const data = await response.json();
        
        if (data.success && data.followers) {
          setInstagramFollowers(data.followers);
          storeCache(cacheKey, data.followers);
        } else {
          setInstagramFollowers("174k+"); // Fallback to previous value
        }
      } catch (error) {
        console.error("Failed to fetch Instagram followers:", error);
        setInstagramFollowers("174k+"); // Fallback to previous value
      }
    };

    // Fetch Twitter Followers
    const fetchTwitterFollowers = async () => {
      const cacheKey = "twitterFollowers";
      if (isCacheValid(cacheKey)) {
        setTwitterFollowers(getCachedData(cacheKey));
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/twitter-followers`);
        const data = await response.json();
        
        if (data.success && data.followers) {
          setTwitterFollowers(data.followers);
          storeCache(cacheKey, data.followers);
        } else {
          setTwitterFollowers("36.1k+"); // Fallback to previous value
        }
      } catch (error) {
        console.error("Failed to fetch Twitter followers:", error);
        setTwitterFollowers("36.1k+"); // Fallback to previous value
      }
    };

    // Fetch TikTok Followers
    const fetchTiktokFollowers = async () => {
      const cacheKey = "tiktokFollowers";
      if (isCacheValid(cacheKey)) {
        setTiktokFollowers(getCachedData(cacheKey));
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/tiktok-followers`);
        const data = await response.json();
        
        if (data.success && data.followers) {
          setTiktokFollowers(data.followers);
          storeCache(cacheKey, data.followers);
        } else {
          setTiktokFollowers("224K+"); // Fallback to previous value
        }
      } catch (error) {
        console.error("Failed to fetch TikTok followers:", error);
        setTiktokFollowers("224K+"); // Fallback to previous value
      }
    };

    // Fetch all follower counts
    fetchYoutubeSubscribers();
    fetchInstagramFollowers();
    fetchTwitterFollowers();
    fetchTiktokFollowers();
  }, []);

  return (
    <section className={[styles.sectionStats, className].join(" ")}>
      <div className={styles.socialIcons}>
        <a
          href="https://www.instagram.com/kellyohgee"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/instagram.svg" alt="Instagram" />
          <span>{instagramFollowers}</span>
        </a>
        <a
          href="https://twitter.com/kellyohgee"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/twitter.svg" alt="Twitter" />
          <span>{twitterFollowers}</span>
        </a>
        <a
          href="https://www.youtube.com/kellyohgee"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/youtube.svg" alt="YouTube" />
          <span>{youtubeSubscribers}</span>
        </a>
        <a
          href="https://www.tiktok.com/@kellyohgee"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/tiktok.svg" alt="TikTok" />
          <span>{tiktokFollowers}</span>
        </a>
      </div>
    </section>
  );
};

SectionStats.propTypes = {
  className: PropTypes.string,
};

export default SectionStats;
