import React from "react";
import Main from "../components/MainABOUT.jsx";
import Footer from "../components/Footer.js";
import SectionCTA from "../components/SectionCTA.js";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.about}>
      <Main />
      <SectionCTA />
      <Footer />
    </div>
  );
};

export default About;
