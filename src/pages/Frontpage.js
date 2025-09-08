import React, { useState, useEffect, Suspense, lazy } from "react";
import { Link } from "react-router-dom";

// Import MobileView component
import MobileView from "./MobileView";

// Import frontpage desktop styles
import styles from "./Frontpage.module.css";

// Lazy load desktop components
const SectionHero = lazy(() => import("../components/SectionHero.js"));
const SectionStats = lazy(() => import("../components/SectionStats.js"));
const SectionServices = lazy(() => import("../components/SectionServices.js"));
const SectionServices1 = lazy(() =>
  import("../components/SectionServices1.js")
);
const SectionWork = lazy(() => import("../components/SectionWork.js"));
const SectionProcess = lazy(() => import("../components/SectionProcess.js"));
const SectionProcess1 = lazy(() => import("../components/SectionProcess1.js"));
const SectionAbout = lazy(() => import("../components/SectionAbout.js"));
const SectionCTA = lazy(() => import("../components/SectionCTA.js"));
const Footer = lazy(() => import("../components/Footer.js"));
// const Navbar = lazy(() => import("../components/navigation/Navbar.jsx"));
import Navbar from "../components/navigation/Navbar.jsx";

const Frontpage = () => {
  // State to track mobile viewport
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [, setIsScrolling] = useState(true);
  let scrollTimeout = null;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show bottom nav on scroll, hide after delay
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      // Clear previous timeout
      clearTimeout(scrollTimeout);

      // Hide navbar after 2 seconds of no scrolling
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Ensure all images and fonts are fully loaded before hiding preloader
  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setLoading(false), 500); // Remove preloader after fade-out
      }, 300); // Small delay to ensure everything renders properly
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  if (isMobile) {
    return (
      <div className="minimal-frame">
        <MobileView />
      </div>
    );
  }

  return (
    <div className="minimal-frame">
      <div
        className={styles.wrapper}
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {loading ? (
          // ✅ Preloader that waits until everything is fully loaded
          <div
            className={`${styles.preloader} ${fadeOut ? styles.fadeOut : ""}`}
          >
            <img
              src="/kelly-logo-11@2x.png"
              alt="Loading..."
              className={styles.preloaderLogo}
            />
          </div>
        ) : (
          <div className={styles.frontpage}>
            <main className={styles.mainContent}>
              <Suspense
                fallback={<div className={styles.loading}>Loading...</div>}
              >
                <div className={styles.container}>
                  <SectionHero />
                </div>
                <div className={styles.container}>
                  <SectionStats />
                </div>
                <div className={styles.container}>
                  <SectionServices />
                </div>
                <div className={styles.container}>
                  <SectionServices1 />
                </div>
                <div className={styles.container}>
                  <SectionWork />
                </div>
                <div className={styles.container}>
                  <SectionProcess />
                </div>
                <div className={styles.container}>
                  <SectionProcess1 />
                </div>
                <div className={styles.container}>
                  <SectionAbout />
                </div>
                <div className={styles.container}>
                  <SectionCTA />
                </div>
              </Suspense>
            </main>

            <Suspense
              fallback={<div className={styles.loading}>Loading Footer...</div>}
            >
              <Footer />
            </Suspense>

            {/* ✅ Bottom Navbar that appears on scroll and hides when idle */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Frontpage;
