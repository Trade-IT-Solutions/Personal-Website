

import Badge from "./Badge.js";
import PropTypes from "prop-types";
import styles from "./Footer.module.css";
import React from "react";

const Footer = ({ className = "" }) => {
  return (
    <footer className={[styles.footer, className].join(" ")}>
      <div className={styles.container}>

        {/* Social Media Links - All in One Row */}
        <div className={styles.grid1}>
          <a href="https://www.instagram.com/kellyohgee/?hl=en" target="_blank" rel="noopener noreferrer">
            <Badge
              size="Small"
              style="Default"
              badgePosition="unset"
              badgeTop="unset"
              badgeLeft="unset"
              badgeWidth="38px"
              badgeHeight="38px"
              pharrowUpRightLight="/phinstagramlogolight-1.svg"
            />
          </a>
          <a href="https://x.com/kellyohgee" target="_blank" rel="noopener noreferrer">
            <Badge
              size="Small"
              style="Default"
              badgePosition="unset"
              badgeTop="unset"
              badgeLeft="unset"
              badgeWidth="38px"
              badgeHeight="38px"
              pharrowUpRightLight="/phtwitterlogolight-1.svg"
            />
          </a>
          <a href="https://www.youtube.com/@kellyohgee" target="_blank" rel="noopener noreferrer">
            <Badge
              size="Small"
              style="Default"
              badgePosition="unset"
              badgeTop="unset"
              badgeLeft="unset"
              badgeWidth="38px"
              badgeHeight="38px"
              pharrowUpRightLight="/phyoutubelogo.svg"
            />
          </a>
          <a href="https://www.tiktok.com/@kellyohgee" target="_blank" rel="noopener noreferrer">
            <Badge
              size="Small"
              style="Default"
              badgePosition="unset"
              badgeTop="unset"
              badgeLeft="unset"
              badgeWidth="38px"
              badgeHeight="38px"
              pharrowUpRightLight="/phtiktoklogolight.svg"
            />
          </a>
        </div>

        {/* Navigation Links - Responsive */}
        <div className={styles.nav}>
          <a href="/" className={styles.socialText}>Home</a>
          <a href="/contact" className={styles.socialText}>Connect</a>
          <a href="/about" className={styles.socialText}>About</a>
          
        </div>

        {/* Footer Bottom Section */}
        <div className={styles.grid6}>
          <div className={styles.madeByPawel}>© Kelly Ohgee 2025</div>
          <div className={styles.grid7}>
            <a href="#" className={styles.socialText}>To Top</a>
            <Badge
              size="Default"
              style="Default"
              badgePosition="unset"
              badgeTop="unset"
              badgeLeft="unset"
              badgeWidth="46px"
              badgeHeight="46px"
              pharrowUpRightLight="/pharrowuplight.svg"
            />
          </div>
        </div>

        {/* Kelly Logo at the Bottom */}
        <div className={styles.logoContainer}>
          <img
            className={styles.kellyLogo}
            src="/kelly-logo-1@2x.png"
            alt="Kelly Logo"
          />
        </div>

      </div>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

export default Footer;
