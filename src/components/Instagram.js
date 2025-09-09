import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Instagram.module.css";
import React from "react";


const Instagram = ({ className = "", instagramLeft, instagram, k }) => {
  const instagramStyle = useMemo(() => {
    return {
      left: instagramLeft,
    };
  }, [instagramLeft]);

  return (
    <div
      className={[styles.instagram, className].join(" ")}
      style={instagramStyle}
    >
      <div className={styles.iconBackgrounds} />
      <img
        className={styles.instagramIcon}
        loading="lazy"
        alt=""
        src={instagram}
      />
      <div className={styles.k}>{k}</div>
    </div>
  );
};

Instagram.propTypes = {
  className: PropTypes.string,
  instagram: PropTypes.string,
  k: PropTypes.string,

  /** Style props */
  instagramLeft: PropTypes.string,
};

export default Instagram;
