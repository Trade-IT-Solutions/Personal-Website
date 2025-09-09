import React from "react";
import PropTypes from "prop-types";
import styles from "./SectionServices.module.css";

const SectionServices = ({ className = "" }) => {
  return (
    <section className={[styles.sectionServices, className].join(" ")}>
      <a
        className={styles.tradeitPill}
        href="https://www.tradeitsolutions.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Join TradeIT, the First University Style Education System for Trading
        <p className={styles.smallerPart}>TradeIT is on a mission to revolutionize financial education as a whole and provide solutions to the scarce understanding of the finance world.
        </p>
      </a>
      <div className={styles.join}>
        <div className={styles.join1}>
          <div className={styles.grid}>
            <div className={styles.div}></div>
            <h1 className={styles.joinTheOhgee}>
              Join The Ohgee family household
            </h1>
          </div>
          <div className={styles.grid1}>
            <h2 className={styles.getAccessTo}>
              {`Stay connected with Kelly! Get access to exclusive education, behind-the-scenes, a strong community, and more!`}
            </h2>
          </div>
          <div className={styles.buttonText}>
            <a
              className={styles.about}
              href="https://patreon.com/kellyohgee"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* I&apos;m Ready to Join */} I Want To Join
            </a>
          </div>
          <div className={styles.imageBox}>
            <img
              className={styles.ohgeeImage}
              src="/OHGEELOGO.png"
              alt="Ohgee Family"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

SectionServices.propTypes = {
  className: PropTypes.string,
};

export default SectionServices;