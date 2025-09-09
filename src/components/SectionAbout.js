import Badge from "./Badge.js";
import PropTypes from "prop-types";
import styles from "./SectionAbout.module.css";
import React from "react";

const SectionAbout = ({ className = "" }) => {
  return (
    <section className={[styles.sectionAbout, className].join(" ")}>
      <div className={styles.imageWrapper}>
        <img className={styles.imageIcon} alt="" src="/image@2x.jpeg" />
        <img
          className={styles.imageIcon1}
          loading="lazy"
          alt=""
          src="/image@2x.jpeg"
        />
        <div className={styles.photoOverlay} />
        <img
          className={styles.kellyOhgee} 
          alt="Kelly Ohgee Logo" 
          src="/kelly-logo-1@2x.png"
        />
        <div className={styles.socials}>
          <div className={styles.grid}>
            <div className={styles.grid1}>
              <div className={styles.grid2}>
                <Badge
                  size="Default"
                  style="Default"
                  badgePosition="unset"
                  badgeTop="unset"
                  badgeLeft="unset"
                  badgeWidth="46px"
                  badgeHeight="46px"
                  pharrowUpRightLight="/phtwitterlogolight.svg"
                />
                <Badge
                  size="Default"
                  style="Default"
                  badgePosition="unset"
                  badgeTop="unset"
                  badgeLeft="unset"
                  badgeWidth="46px"
                  badgeHeight="46px"
                  pharrowUpRightLight="/phinstagramlogolight.svg"
                />
                <Badge
                  size="Default"
                  style="Default"
                  badgePosition="unset"
                  badgeTop="unset"
                  badgeLeft="unset"
                  badgeWidth="46px"
                  badgeHeight="46px"
                  pharrowUpRightLight="/phdribbblelogolight.svg"
                />
                <Badge
                  size="Default"
                  style="Default"
                  badgePosition="unset"
                  badgeTop="unset"
                  badgeLeft="unset"
                  badgeWidth="46px"
                  badgeHeight="46px"
                  pharrowUpRightLight="/phbehancelogolight.svg"
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.aBrandThatContainer}>
          <p className={styles.aBrandThat}>{`A brand that leaves `}</p>
          <p className={styles.aLastingImpression}>
            <i className={styles.aLastingImpression1}>a lasting impression!</i>
          </p>
        </div>
        <h2 className={styles.myMissionIs}>
          My mission is to revolutionize the way we perceive education,
          empowering future generations to thrive. Your growth, your progress,
          and your achievement, my concern.
        </h2>
      </div>
    </section>
  );
};

SectionAbout.propTypes = {
  className: PropTypes.string,
};

export default SectionAbout;
