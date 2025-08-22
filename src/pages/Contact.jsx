import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiUser, FiMail } from "react-icons/fi";
import Container from "../components/Containercontact.jsx";
import Footer1 from "../components/Footer.js";
import SectionCTA from "../components/SectionCTA.js";
import styles from "./Contact.module.css";

const Contact = () => {
  const [isScrolling, setIsScrolling] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  let scrollTimeout = null;

  // Auto-hide top nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
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

  // Disable scroll when overlay is active
  useEffect(() => {
    document.body.style.overflow = showOverlay ? "hidden" : "";
  }, [showOverlay]);

  return (
    <div className={styles.contact}>
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

      <section className={styles.sectionContact}>
        <Container setShowOverlay={setShowOverlay} />

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
      </section>

      <SectionCTA />
      <Footer1 />

      {/* ✅ Full-screen overlay shown only on success */}
      {showOverlay && (
        <div className={styles.messageSentOverlay}>
          <h1 className={styles.messageSentText}>Thank You! Message Sent</h1>
        </div>
      )}
    </div>
  );
};

export default Contact;
