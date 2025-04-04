import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import styles from "./SectionStats.module.css";

const CACHE_EXPIRY_TIME = 12 * 60 * 60 * 1000; // 12 hours
 // 1 hour in milliseconds

const SectionStats = ({ className = "" }) => {
  const [youtubeSubscribers, setYoutubeSubscribers] = useState("Loading...");
  const [instagramFollowers, setInstagramFollowers] = useState("Loading...");
  const [twitterFollowers, setTwitterFollowers] = useState("Loading...");

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

  // Fetch YouTube Subscribers
  useEffect(() => {
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
            : subscriberCount;

        setYoutubeSubscribers(formattedCount);
        storeCache(cacheKey, formattedCount);
      } catch (error) {
        console.error("Failed to fetch YouTube subscribers:", error);
        setYoutubeSubscribers("Error");
      }
    };

    fetchYoutubeSubscribers();
  }, []);

  // Fetch Instagram Followers
  useEffect(() => {
    const fetchInstagramFollowers = async () => {
      const cacheKey = "instagramFollowers";
      const formatNumber = (num) => {
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B+";
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M+";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "k+";
        return num.toString();
      };

      if (isCacheValid(cacheKey)) {
        setInstagramFollowers(getCachedData(cacheKey));
        return;
      }

      try {
        const response = await fetch(
          "https://rocketapi-for-developers.p.rapidapi.com/instagram/user/get_info",
          {
            method: "POST",
            headers: {
              "x-rapidapi-key": "70e512e8bdmshaaffc4d5a9623d3p16477cjsnd7d34b12bfd6",
              "x-rapidapi-host": "rocketapi-for-developers.p.rapidapi.com",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: "kellyohgee" }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const count = data?.response?.body?.data?.user?.edge_followed_by?.count;

        if (count !== undefined) {
          const formatted = formatNumber(count);
          setInstagramFollowers(formatted);
          storeCache(cacheKey, formatted);
        } else {
          console.error("Instagram follower count not found.");
          setInstagramFollowers("N/A");
        }
      } catch (error) {
        console.error("Failed to fetch Instagram followers:", error);
        setInstagramFollowers("Error");
      }
    };

    fetchInstagramFollowers();
  }, []);

  // Fetch Twitter Followers
  useEffect(() => {
    const fetchTwitterFollowers = async () => {
      const cacheKey = "twitterFollowers";
      if (isCacheValid(cacheKey)) {
        setTwitterFollowers(getCachedData(cacheKey));
        return;
      }

      try {
        const url = `https://${process.env.REACT_APP_TWITTER_API_HOST}/${process.env.REACT_APP_TWITTER_USERNAME}/profile`;
        const headers = {
          "x-rapidapi-key": process.env.REACT_APP_TWITTER_API_KEY,
          "x-rapidapi-host": process.env.REACT_APP_TWITTER_API_HOST,
        };

        const response = await fetch(url, { method: "GET", headers });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const followerCount = data?.followersCount || 0;

        const formattedCount =
          followerCount >= 1000000
            ? `${(followerCount / 1000000).toFixed(1).replace(/\.0$/, "")}M+`
            : followerCount >= 1000
            ? `${(followerCount / 1000).toFixed(1).replace(/\.0$/, "")}k+`
            : followerCount;

        setTwitterFollowers(formattedCount);
        storeCache(cacheKey, formattedCount);
      } catch (error) {
        console.error("Error fetching Twitter followers:", error);
        setTwitterFollowers("Error");
      }
    };

    fetchTwitterFollowers();
  }, []);

  return (
    <section className={[styles.sectionStats, className].join(" ")}>
      <div className={styles.socialIcons}>
        <a href="https://www.instagram.com/kellyohgee" target="_blank" rel="noopener noreferrer">
          <img src="/instagram.svg" alt="Instagram" />
          <span>{instagramFollowers}</span>
        </a>
        <a href="https://twitter.com/kellyohgee" target="_blank" rel="noopener noreferrer">
          <img src="/twitter.svg" alt="Twitter" />
          <span>{twitterFollowers}</span>
        </a>
        <a href="https://www.youtube.com/kellyohgee" target="_blank" rel="noopener noreferrer">
          <img src="/youtube.svg" alt="YouTube" />
          <span>{youtubeSubscribers}</span>
        </a>
        <a href="https://www.tiktok.com/@kellyohgee" target="_blank" rel="noopener noreferrer">
          <img src="/tiktok.svg" alt="TikTok" />
          <span>224K+</span>
        </a>
      </div>
    </section>
  );
};

SectionStats.propTypes = {
  className: PropTypes.string,
};

export default SectionStats;