import React from "react";
import PropTypes from "prop-types";
import styles from "./FooterLinks.module.css";

const FooterLinks = ({ className = "" }) => {
  // Let's say you want 6 sets: +++ LOGO +++ LOGO ... ending with +++
  const sets = 6;

  return (
    <section className={[styles.footerLinks, className].join(" ")}>
      <div className={styles.letsTalk}>
        {Array.from({ length: sets }).map((_, i) => (
          <React.Fragment key={i}>
            <div className={styles.prompt}>+++</div>
            <img
              src="/kelly-logo-11@2x.png"
              alt="Logo"
              className={styles.logoImage}
            />
          </React.Fragment>
        ))}
        <div className={styles.prompt}>+++</div> {/* Final +++ */}
      </div>
    </section>
  );
};

FooterLinks.propTypes = {
  className: PropTypes.string,
};

export default FooterLinks;

