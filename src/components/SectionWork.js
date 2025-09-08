import React, { useState, useEffect, useRef, useCallback } from "react";
import Badge from "./Badge.js";
import PropTypes from "prop-types";
import styles from "./SectionWork.module.css";

const SectionWork = ({ className = "" }) => {
  const [latestVideoId, setLatestVideoId] = useState("");
  const [shouldPlay, setShouldPlay] = useState(false);
  const videoRef = useRef(null);
  const observerRef = useRef(null);

  const onGridContainerClick = useCallback(() => {
    window.location.href = "https://www.youtube.com/@kellyohgee";
  }, []);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      const cacheKey = "yt_latest_video_sectionWork";
      const cacheTimeKey = "yt_latest_video_sectionWork_time";
      const twelveHours = 12 * 60 * 60 * 1000;

      const cachedVideo = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(cacheTimeKey);

      if (cachedVideo && cachedTime && Date.now() - parseInt(cachedTime) < twelveHours) {
        setLatestVideoId(cachedVideo);
        return;
      }

      // Fallback video in case of API failure
      const fallbackVideoId = "dQw4w9WgXcQ";

      try {
        // Using a more efficient method: channels + playlistItems (costs 2 units instead of 100)
        // Step 1: Get the channel's uploads playlist ID
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?key=AIzaSyD_6EZIO3Zr5wTmYCSLq0Kw_8jLmDXOpDc&id=UCM84WjkyLm1_sa17G8DYzRg&part=contentDetails&maxResults=1`
        );

        if (!channelResponse.ok) {
          throw new Error(`Channel API responded with status: ${channelResponse.status}`);
        }

        const channelData = await channelResponse.json();

        if (!channelData.items || channelData.items.length === 0) {
          throw new Error("Channel not found");
        }

        // Extract the uploads playlist ID
        const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;

        if (!uploadsPlaylistId) {
          throw new Error("Uploads playlist not found");
        }

        // Step 2: Get the latest video from the uploads playlist
        const playlistResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyD_6EZIO3Zr5wTmYCSLq0Kw_8jLmDXOpDc&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=1`
        );

        if (!playlistResponse.ok) {
          throw new Error(`Playlist API responded with status: ${playlistResponse.status}`);
        }

        const playlistData = await playlistResponse.json();

        if (!playlistData.items || playlistData.items.length === 0) {
          throw new Error("No videos found in uploads playlist");
        }

        // Extract the video ID from the playlist item
        const videoId = playlistData.items[0]?.snippet?.resourceId?.videoId;

        if (!videoId) {
          throw new Error("Video ID not found in playlist response");
        }

        setLatestVideoId(videoId);
        localStorage.setItem(cacheKey, videoId);
        localStorage.setItem(cacheTimeKey, Date.now().toString());
      } catch (error) {
        console.error("YouTube fetch failed:", error);

        // Fallback to original search method if channels+playlists approach fails
        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=AIzaSyD_6EZIO3Zr5wTmYCSLq0Kw_8jLmDXOpDc&channelId=UCM84WjkyLm1_sa17G8DYzRg&part=snippet,id&order=date&maxResults=1&type=video`
          );

          if (!response.ok) throw new Error(`API error ${response.status}`);

          const data = await response.json();
          const videoId = data.items?.[0]?.id?.videoId;

          if (videoId) {
            setLatestVideoId(videoId);
            localStorage.setItem(cacheKey, videoId);
            localStorage.setItem(cacheTimeKey, Date.now().toString());
            return;
          }
        } catch (searchError) {
          console.error("Search method also failed:", searchError);
        }

        // If all else fails, use fallback video
        setLatestVideoId(fallbackVideoId);
        localStorage.setItem(cacheKey, fallbackVideoId);
        localStorage.setItem(cacheTimeKey, Date.now().toString());
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
    <section className={`${styles.sectionWork} ${className}`}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <h1 className={styles.connectWithKelly}>Connect with Kelly on YouTube!</h1>
        </div>
        <div className={styles.grid1}>
          <div className={styles.grid2}>
            <div className={styles.grid3} onClick={onGridContainerClick}>
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
                  <p className={styles.loadingText}>Loading latest video...</p>
                )}
                <div className={styles.grid4}>
                  <h2 className={styles.lamboSurprise}>Latest Video</h2>
                  <div className={styles.youtubeVideo}>CLICK HERE!</div>
                </div>
                <Badge size={1} style={1} pharrowUpRightLight="pending" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

SectionWork.propTypes = {
  className: PropTypes.string,
};

export default SectionWork;