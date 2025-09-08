import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Main from "../components/MainABOUT.jsx";
import Footer from "../components/Footer.js";
import SectionCTA from "../components/SectionCTA.js";
import styles from "./About.module.css";
import Navbar from "../components/navigation/Navbar";


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
