import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./Community.module.css";

// Backend API URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://personal-website-backend-e74k.onrender.com'
  : 'http://localhost:5000';

const CACHE_EXPIRY_TIME = 12 * 60 * 60 * 1000; // 12 hours

const Community = ({ className = "" }) => {
  const [youtubeSubscribers, setYoutubeSubscribers] = useState("Loading...");
  const [instagramFollowers, setInstagramFollowers] = useState("Loading...");
  const [twitterFollowers, setTwitterFollowers] = useState("Loading...");
  const [tiktokFollowers, setTiktokFollowers] = useState("Loading...");

  // Helper functions for caching
  const isCacheValid = (key) => {
    const cachedData = JSON.parse(localStorage.getItem(key));
    return cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY_TIME;
  };

  const storeCache = (key, data) => {
    localStorage.setItem(
      key,
      JSON.stringify({ value: data, timestamp: Date.now() })
    );
  };

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
        const subscriberCount = data.items[0]?.statistics?.subscriberCount;

        if (subscriberCount) {
          const formattedCount =
            subscriberCount >= 1000
              ? `${(subscriberCount / 1000).toFixed(1).replace(/\.0$/, "")}k+`
              : subscriberCount;
          setYoutubeSubscribers(formattedCount);
          storeCache(cacheKey, formattedCount);
        } else {
          setYoutubeSubscribers("N/A");
        }
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
          setInstagramFollowers("168.4k"); // Fallback to previous value
        }
      } catch (error) {
        console.error("Failed to fetch Instagram followers:", error);
        setInstagramFollowers("168.4k"); // Fallback to previous value
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
          setTwitterFollowers("36.4k"); // Fallback to previous value
        }
      } catch (error) {
        console.error("Failed to fetch Twitter followers:", error);
        setTwitterFollowers("36.4k"); // Fallback to previous value
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
          setTiktokFollowers("223.2k"); // Fallback to previous value
        }
      } catch (error) {
        console.error("Failed to fetch TikTok followers:", error);
        setTiktokFollowers("223.2k"); // Fallback to previous value
      }
    };

    // Fetch all follower counts
    fetchYoutubeSubscribers();
    fetchInstagramFollowers();
    fetchTwitterFollowers();
    fetchTiktokFollowers();
  }, []);

  return (
    <section className={[styles.community, className].join(" ")}>
      <div className={styles.container}>
        <div className={styles.socialLinks}>
          <div className={styles.instagramParent}>
            {/* Instagram */}
            <div className={styles.instagram}>
              <div className={styles.rectangleParent}>
                <div className={styles.frameChild} />
                <a
                  href="https://www.instagram.com/kellyohgee"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className={styles.instagramIcon}
                    loading="lazy"
                    alt="Instagram"
                    src="/instagram1.svg"
                  />
                </a>
              </div>
              <div className={styles.kWrapper}>
                <div className={styles.k}>{instagramFollowers}</div>
              </div>
            </div>
  
            {/* Twitter */}
            <div className={styles.instagram}>
              <div className={styles.rectangleParent}>
                <div className={styles.frameChild} />
                <a
                  href="https://twitter.com/kellyohgee"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className={styles.twitterIcon}
                    loading="lazy"
                    alt="Twitter"
                    src="/twitter1.svg"
                  />
                </a>
              </div>
              <div className={styles.kContainer}>
                <div className={styles.k1}>{twitterFollowers}</div>
              </div>
            </div>
          </div>
  
          {/* TikTok */}
          <div className={styles.tiktokParent}>
            <div className={styles.tiktok}>
              <div className={styles.rectangleParent}>
                <div className={styles.frameChild} />
                <a
                  href="https://www.tiktok.com/@kellyohgee"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className={styles.tiktokIcon}
                    loading="lazy"
                    alt="TikTok"
                    src="/tiktok.svg"
                  />
                </a>
              </div>
              <div className={styles.kFrame}>
                <div className={styles.k}>{tiktokFollowers}</div>
              </div>
            </div>
          </div>
  
          {/* YouTube */}
          <div className={styles.youtubeParent}>
            <div className={styles.youtube}>
              <div className={styles.rectangleParent}>
                <div className={styles.frameChild} />
                <a
                  href="https://www.youtube.com/@kellyohgee"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className={styles.twitterIcon}
                    loading="lazy"
                    alt="YouTube"
                    src="/youtube2.svg"
                  />
                </a>
              </div>
              <div className={styles.kFrame}>
                <div className={styles.k}>{youtubeSubscribers}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Community.propTypes = {
  className: PropTypes.string,
};

export default Community;