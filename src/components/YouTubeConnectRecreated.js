import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./YouTubeConnectRecreated.module.css";
import Badge from "./Badge.js";

const YouTubeConnectRecreated = ({ className = "" }) => {
  const [latestVideoId, setLatestVideoId] = useState("");
  const [shouldPlay, setShouldPlay] = useState(false);
  const videoRef = useRef(null);
  const observerRef = useRef(null);

  const onGridContainerClick = useCallback(() => {
    window.location.href = "https://www.youtube.com/@kellyohgee";
  }, []);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      // Implement caching to reduce API calls
      const cacheKey = "yt_latest_video_connect";
      const cacheTimeKey = "yt_latest_video_connect_time";
      const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

      const cachedVideo = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(cacheTimeKey);

      // Use cached video if available and not expired
      if (cachedVideo && cachedTime && Date.now() - parseInt(cachedTime) < twelveHours) {
        console.log("Using cached video ID:", cachedVideo);
        setLatestVideoId(cachedVideo);
        return;
      }

      // Backend API URL
      const API_URL = process.env.NODE_ENV === 'production' 
        ? 'https://personal-website-backend-e74k.onrender.com'
        : 'http://localhost:5000';

      try {
        const response = await fetch(`${API_URL}/api/youtube-latest-video`);
        const data = await response.json();

        if (data.success && data.videoId) {
          console.log("Latest Video ID:", data.videoId);
          setLatestVideoId(data.videoId);
          localStorage.setItem(cacheKey, data.videoId);
        localStorage.setItem(cacheTimeKey, Date.now().toString());
        } else {
          console.error("Failed to fetch latest video:", data.message);
          // Don't set a fallback video - let it show loading state
        }
      } catch (error) {
        console.error("Failed to fetch the latest video:", error);
        // Don't set a fallback video - let it show loading state
      }
    };

    fetchLatestVideo();
  }, []);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShouldPlay(entry.isIntersecting);
        });
      },
      {
        threshold: 0.5,
        root: null,
        rootMargin: "0px",
      }
    );

    if (videoRef.current) {
      observerRef.current.observe(videoRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [latestVideoId]);

  return (
    <section className={[styles.youtubeConnectRecreated, className].join(" ")}>
      <div className={styles.connectWithKellyOnYoutubeWrapper}>
        <h3 className={styles.connectWithKelly}>
          Connect with Kelly on YouTube!
        </h3>
      </div>
      <div className={styles.videoContainer} onClick={onGridContainerClick}>
        <div className={styles.imageWrapper}>
          {latestVideoId ? (
            <iframe
              ref={videoRef}
              className={styles.imageIcon}
              src={`https://www.youtube.com/embed/${latestVideoId}?rel=0&enablejsapi=1&autoplay=${shouldPlay ? 1 : 0
                }&controls=1&showinfo=0&mute=1`}
              title="Latest Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <p>Loading latest ...</p>
          )}
          <div className={styles.videoOverlay}>
            <h2 className={styles.lamboSurprise}>Latest Video</h2>
            <div className={styles.youtubeVideo}>CLICK HERE!</div>
          </div>
          <Badge size={1} style={1} pharrowUpRightLight="pending" />
        </div>
      </div>
    </section>
  );
};

YouTubeConnectRecreated.propTypes = {
  className: PropTypes.string,
};

export default YouTubeConnectRecreated;