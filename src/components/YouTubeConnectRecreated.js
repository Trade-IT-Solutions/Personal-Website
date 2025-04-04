

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
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=AIzaSyD_6EZIO3Zr5wTmYCSLq0Kw_8jLmDXOpDc&channelId=UCM84WjkyLm1_sa17G8DYzRg&part=snippet,id&order=date&maxResults=1`
        );
        const data = await response.json();
        const videoId = data.items[0]?.id?.videoId;
        setLatestVideoId(videoId);
      } catch (error) {
        console.error("Failed to fetch the latest video:", error);
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
      {/* <div className={styles.seeAllWrapper} onClick={onGridContainerClick}>
        <div className={styles.seeAll}>See all</div>
      </div> */}

      <div className={styles.videoContainer} onClick={onGridContainerClick}>
        <div className={styles.imageWrapper}>
          {latestVideoId ? (
            <iframe
              ref={videoRef}
              className={styles.imageIcon}
              src={`https://www.youtube.com/embed/${latestVideoId}?rel=0&enablejsapi=1&autoplay=${
                shouldPlay ? 1 : 0
              }&controls=1&showinfo=0&mute=1`}
              title="Latest Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <p>Loading latest video...</p>
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

