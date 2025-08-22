import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Main from "../components/MainABOUT.jsx";
import Footer from "../components/Footer.js";
import SectionCTA from "../components/SectionCTA.js";
import styles from "./About.module.css";

import { FiHome, FiUser, FiMail } from "react-icons/fi"; // Import icons for nav

const About = () => {
  const [isScrolling, setIsScrolling] = useState(true); // Always visible initially
  let scrollTimeout = null;

  // Detect scrolling and hide/show navbar accordingly
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      
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

  return (
    <div className={styles.about}>
      {/* Top Navigation Bar - Only Visible on Mobile with Auto-Hide */}
      <nav className={`${styles.topNav} ${isScrolling ? styles.show : styles.hide}`}>
        <Link to="/" className={styles.topNavItem}>
          <FiHome size={20} />
          <span>Home</span>
        </Link>
        <Link to="/about" className={styles.topNavItem}>
          <FiUser size={20} />
          <span>About</span>
        </Link>
        <Link to="/contact" className={styles.topNavItem}>
          <FiMail size={20} />
          <span>Contact</span>
        </Link>
      </nav>

      {/* Regular Top Navbar - Hidden on Mobile */}
      <header className={styles.header}>
        <Link to="/" className={styles.logoContainer}>
          <img 
            className={styles.kellyLogo1}  
            alt="Kelly Logo" 
            src="/kelly-logo-11@2x.png" 
            loading="lazy"
          />
        </Link>
        <nav className={styles.navbarRight}>
          <div className={styles.navbarMenu}>
            <Link to="/contact" className={styles.connect}>Connect</Link>
            <Link to="/about" className={styles.work}>About</Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <Main />

      {/* "Let's Talk" Section CTA */}
      <SectionCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;