import React, { useState, useEffect, useRef } from "react";
import Badge from "./BadgeABOUT.jsx";
import PropTypes from "prop-types";
import "./MainABOUT.css";

const Main = ({ className = "" }) => {
  const [latestVideoId, setLatestVideoId] = useState("");
  const [shouldPlay, setShouldPlay] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      const cacheKey = "yt_latest_video_main";
      const cacheTimeKey = "yt_latest_video_main_time";
      const twelveHours = 12 * 60 * 60 * 1000;

      const cachedVideo = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(cacheTimeKey);

      if (
        cachedVideo &&
        cachedTime &&
        Date.now() - parseInt(cachedTime) < twelveHours
      ) {
        setLatestVideoId(cachedVideo);
        return;
      }

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=AIzaSyD_6EZIO3Zr5wTmYCSLq0Kw_8jLmDXOpDc&channelId=UCezPMn09jcmgJ8Lo_JD-iEg&part=snippet,id&order=date&maxResults=1`
        );

        if (!response.ok) throw new Error(`API error ${response.status}`);

        const data = await response.json();
        const videoId = data.items?.[0]?.id?.videoId;

        if (videoId) {
          setLatestVideoId(videoId);
          localStorage.setItem(cacheKey, videoId);
          localStorage.setItem(cacheTimeKey, Date.now());
        }
      } catch (error) {
        console.error("YouTube fetch failed:", error);
        setLatestVideoId("dQw4w9WgXcQ"); // Optional fallback
      }
    };

    fetchLatestVideo();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShouldPlay(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`main ${className}`}>
      <img
        className="grid-icon"
        loading="lazy"
        alt=""
        src="/IMG_5643.png"
        style={{ marginTop: "100px" }}
      />
      <div className="right-column">
        <div className="profile">
          <div className="grid">
            <div className="grid1">
              <h1 className="kelly-ohgee">
                <p className="kelly">Kelly </p>
                <p className="kelly">Ohgee</p>
              </h1>
              <h2
                className="my-mission-is"
                style={{
                  lineHeight: "1.6",
                  wordSpacing: "-3px", // Reduce space between words
                }}
              >
                My mission is to revolutionize the way we perceive education,
                empowering future generations to thrive. Your growth, your
                progress, and your achievement, my concern.
              </h2>
            </div>
            <div className="grid2">
              <Badge
                size="Default"
                style="Default"
                pharrowDownLight="/pharrowdownlight.svg"
              />
              <div className="about-me">About Me</div>
            </div>
          </div>
        </div>

        {/* ✅ Video Section Stays in right-column ✅ */}
        <div className="image-wrapper">
          {latestVideoId ? (
            <div className="youtube-container">
              <iframe
                ref={videoRef}
                className="image-icon"
                src={`https://www.youtube.com/embed/${latestVideoId}?rel=0&enablejsapi=1&autoplay=${
                  shouldPlay ? 1 : 0
                }&controls=1&showinfo=0&mute=1`}
                title="Latest Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <p>Loading latest video...</p>
          )}
        </div>
      </div>

      {/* ✅ Cards Moved Below Video ✅ */}
      <div className="cards">
        <h2 className="about-me">More About Kelly</h2>
        <div className="small-card-grid">
          <div className="card small-card">
            <h2>Background</h2>
            <p>
              Kelly Ohgee, is a 23-year-old entrepreneur, philanthropist, life
              speaker, and social media personality. Born on March 1, 2002, she
              has Nigerian heritage and is one of four siblings. Her mission
              centers on empowering individuals to unlock their full potential,
              a passion that permeates her diverse endeavors.
            </p>
          </div>

          <div className="card small-card">
            <h2>Career Beginnings</h2>
            <p>
              Kelly's professional journey commenced in the trading industry,
              where she quickly established herself as strategic in the
              financial world. After famously gaining success in the stock
              markets, she leveraged her success to found Cash Capital
              Investment Group, a pioneering e-learning platform that empowered
              over 50,000 aspiring traders to master proven strategies, increase
              their financial literacy, and build wealth with purpose. As the
              platform evolved, Kelly expanded it into TradeIT, a dynamic EdTech
              company dedicated to transforming how individuals learn, grow, and
              build wealth. Under her leadership, TradeIT now stands at the
              intersection of innovation, education, and financial empowerment
              to equip people to create generational impact and lead lives of
              purpose.
            </p>
          </div>

          <div className="card small-card">
            <h2>Personal Development</h2>
            <p>
              Driven by a mission to create lasting impact, Kelly has emerged as
              a respected authority in both the trading world and the broader
              realm of financial education. Expanding her focus beyond the
              charts, she champions a holistic approach that integrates personal
              development with financial empowerment. As the founder of a
              transformational educational platform, Kelly cultivates a
              high-performance community where individuals learn diverse
              wealth-building strategies, master the principles of stewardship,
              and form meaningful, growth-centered connections. She emphasizes
              that true financial success isn’t measured by personal indulgence,
              but by how wealth is used to empower others, create opportunities,
              and drive purpose-driven change to ultimately contribute to a more
              equitable and inspired world.
            </p>
          </div>

          <div className="card small-card">
            <h2>Vision and Impact</h2>
            <p>
              Kelly has reached and inspired millions through her transformative
              content across platforms like Instagram and YouTube, becoming a
              trusted voice in financial literacy, personal growth, and
              intentional living. Her vision is to reshape how people engage
              with education to foster a culture of resilience, intentionality,
              and purpose-driven wealth. More than just helping individuals make
              money, Kelly empowers them to use their resources as a force for
              good—to serve others, uplift communities, and create meaningful,
              lasting change. She remains deeply committed to building a world
              where financial success is measured not by what we keep, but by
              what we give, and where personal growth leads to collective
              impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Main.propTypes = {
  className: PropTypes.string,
};

export default Main;
