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
      
      // Set a fallback video ID to ensure something displays
      const fallbackVideoId = "dQw4w9WgXcQ";
      
      try {
        // Using uploads playlist approach instead of search API
        // Step 1: Get the channel's uploads playlist ID (costs only 1 unit)
        console.log("Fetching channel uploads playlist...");
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?key=AIzaSyD_6EZIO3Zr5wTmYCSLq0Kw_8jLmDXOpDc&id=UCM84WjkyLm1_sa17G8DYzRg&part=contentDetails&maxResults=1`
        );
        
        if (!channelResponse.ok) {
          throw new Error(`Channel API responded with status: ${channelResponse.status}`);
        }
        
        const channelData = await channelResponse.json();
        console.log("Channel API Response:", channelData);
        
        if (!channelData.items || channelData.items.length === 0) {
          throw new Error("Channel not found");
        }
        
        // Extract the uploads playlist ID
        const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;
        
        if (!uploadsPlaylistId) {
          throw new Error("Uploads playlist not found");
        }
        
        console.log("Uploads playlist ID:", uploadsPlaylistId);
        
        // Step 2: Get the latest video from the uploads playlist (costs only 1 unit)
        const playlistResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyD_6EZIO3Zr5wTmYCSLq0Kw_8jLmDXOpDc&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=1`
        );
        
        if (!playlistResponse.ok) {
          throw new Error(`Playlist API responded with status: ${playlistResponse.status}`);
        }
        
        const playlistData = await playlistResponse.json();
        console.log("Playlist API Response:", playlistData);
        
        if (!playlistData.items || playlistData.items.length === 0) {
          throw new Error("No videos found in uploads playlist");
        }
        
        // Extract the video ID from the playlist item
        const videoId = playlistData.items[0]?.snippet?.resourceId?.videoId;
        
        if (!videoId) {
          throw new Error("Video ID not found in playlist response");
        }
        
        console.log("Latest Video ID:", videoId);
        setLatestVideoId(videoId);
        
        // Cache the video ID and timestamp
        localStorage.setItem(cacheKey, videoId);
        localStorage.setItem(cacheTimeKey, Date.now().toString());
      } catch (error) {
        console.error("Failed to fetch the latest video:", error);
        
        // Use hardcoded fallback if necessary - try the channel ID from Main.js first
        try {
          const fallbackChannelResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=AIzaSyD_6EZIO3Zr5wTmYCSLq0Kw_8jLmDXOpDc&channelId=UCezPMn09jcmgJ8Lo_JD-iEg&part=snippet,id&order=date&maxResults=1&type=video`
          );
          
          if (fallbackChannelResponse.ok) {
            const fallbackData = await fallbackChannelResponse.json();
            const fallbackVideoId = fallbackData.items?.[0]?.id?.videoId;
            
            if (fallbackVideoId) {
              console.log("Using video from alternative channel:", fallbackVideoId);
              setLatestVideoId(fallbackVideoId);
              localStorage.setItem(cacheKey, fallbackVideoId);
              localStorage.setItem(cacheTimeKey, Date.now().toString());
              return;
            }
          }
        } catch (fallbackError) {
          console.error("Fallback channel attempt failed:", fallbackError);
        }
        
        // If everything else fails, use the hardcoded fallback
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
              src={`https://www.youtube.com/embed/${latestVideoId}?rel=0&enablejsapi=1&autoplay=${
                shouldPlay ? 1 : 0
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