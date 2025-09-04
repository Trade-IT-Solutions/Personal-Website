import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiUser, FiMail, FiCalendar } from "react-icons/fi";
import Container from "../components/Containercontact.jsx";
import Footer from "../components/Footer.js";
import SectionCTA from "../components/SectionCTA.js";
import styles from "./Contact.module.css";

const Contact = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  // Disable scroll when overlay is active
  useEffect(() => {
    document.body.style.overflow = showOverlay ? "hidden" : "";
  }, [showOverlay]);

  return (
    <div className={styles.contact}>
      <section className={styles.sectionContact}>
        <Container setShowOverlay={setShowOverlay} />
      </section>

      <SectionCTA />
      <Footer />
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
