

import PropTypes from "prop-types";
import styles from "./SectionHero.module.css";
import React from "react";

const SectionHero = ({ className = "" }) => {
  return (
    <section className={[styles.sectionHero, className].join(" ")}>
      <div className={styles.imageWrapper}>
        {/* Background Image */}
        <img className={styles.imageIcon} alt="Hero section background" src="/image@2x.jpeg" />

        {/* Background Blur */}
        <div className={styles.donnaPrice} />

        {/* Text Content */}
        <div className={styles.textContent}>
          <h1 className={styles.empoweringGenerations}>Empowering Generations</h1>
          <h2 className={styles.myMissionIs}>
            My mission is to revolutionize the way we perceive education, empowering future
            generations to thrive. Your growth, your progress, and your achievement, my concern.
          </h2>
        </div>
      </div>
    </section>
  );
};

SectionHero.propTypes = {
  className: PropTypes.string,
};

export default SectionHero;
