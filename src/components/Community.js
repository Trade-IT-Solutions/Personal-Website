import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./Community.module.css";

const Community = ({ className = "" }) => {
  const [youtubeSubscribers, setYoutubeSubscribers] = useState("Loading...");
  // Hardcoded values as requested
  const instagramFollowers = "168.4k";
  const twitterFollowers = "36.4k";
  const tiktokFollowers = "223.2k";

  // Fetch YouTube Subscribers (keeping this dynamic as requested)
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