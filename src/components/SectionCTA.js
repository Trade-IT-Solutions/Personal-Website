import React from "react";
import PropTypes from "prop-types";
import styles from "./SectionCTA.module.css";

const SectionCTA = ({ className = "" }) => {
  const repeatCount = 12; // Number of "Let's talk" + "+++" pairs

  return (
    <section className={[styles.sectionCta, className].join(" ")}>
      <div className={styles.sectionBanner}>
        <div className={styles.line} />
        <div className={styles.grid}>
          {Array.from({ length: repeatCount }).map((_, index) => (
            <React.Fragment key={index}>
              <div className={styles.bannerWord}>+++</div>
              <img
                src="/kelly-logo-11@2x.png"
                alt="Let's Talk"
                className={styles.logoImage}
              />
            </React.Fragment>
          ))}
          <div className={styles.bannerWord}>+++</div> {/* Final +++ */}
        </div>
        <div className={styles.line} />
      </div>
    </section>
  );
};

SectionCTA.propTypes = {
  className: PropTypes.string,
};

export default SectionCTA;
