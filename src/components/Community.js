import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./Community.module.css";

const Community = ({ className = "" }) => {
  const [youtubeSubscribers, setYoutubeSubscribers] = useState("Loading...");
  const [instagramFollowers, setInstagramFollowers] = useState("Loading...");
  const [twitterFollowers, setTwitterFollowers] = useState("Loading...");
  const tiktokFollowers = "224k+";

  // Fetch YouTube Subscribers
  useEffect(() => {
    const fetchYoutubeSubscribers = async () => {
      try {
        const API_KEY = "AIzaSyD_6EZIO3Zr5wTmYCSLq0Kw_8jLmDXOpDc"; // Replace with your API key
        const CHANNEL_ID = "UCM84WjkyLm1_sa17G8DYzRg"; // Replace with YouTube channel ID
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
        } else {
          setYoutubeSubscribers("N/A");
        }
      } catch (error) {
        console.error("Failed to fetch YouTube subscribers:", error);
        setYoutubeSubscribers("Error");
      }
    };

    fetchYoutubeSubscribers();
  }, []);

  // Fetch Instagram Followers (Corrected API Request)
   useEffect(() => {
     const fetchInstagramFollowers = async () => {
       const cacheKey = "instagramFollowers";
       const CACHE_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour
   
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
      try {
        const url =
          "https://twitter-followers.p.rapidapi.com/kellyohgee/profile"; // Correct endpoint for specific user
        const headers = {
          "x-rapidapi-key": "70e512e8bdmshaaffc4d5a9623d3p16477cjsnd7d34b12bfd6",
          "x-rapidapi-host": "twitter-followers.p.rapidapi.com",
        };

        const response = await fetch(url, { method: "GET", headers });

        if (!response.ok) {
          const errorDetails = await response.text();
          console.error("API Response Error Details:", errorDetails);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Twitter API Response:", data); // Log response for debugging

        // Parse follower count
        const followerCount = data?.followersCount || 0;

        if (followerCount) {
          const formattedCount =
            followerCount >= 1000000
              ? `${(followerCount / 1000000).toFixed(1).replace(/\.0$/, "")}M+`
              : followerCount >= 1000
              ? `${(followerCount / 1000).toFixed(1).replace(/\.0$/, "")}k+`
              : followerCount;
          setTwitterFollowers(formattedCount);
        } else {
          setTwitterFollowers("N/A");
        }
      } catch (error) {
        console.error("Error fetching Twitter followers:", error);
        setTwitterFollowers("Error");
      }
    };

    fetchTwitterFollowers();
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
