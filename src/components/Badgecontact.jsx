import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Badgecontact.module.css";
import React from "react";

const Badge = ({
  className = "",
  size = "XSmall",
  style = "Default",
  badgePosition,
  badgeTop,
  badgeLeft,
  badgeWidth,
  badgeHeight,
  pharrowUpRightLight,
}) => {
  const badgeStyle = useMemo(() => {
    return {
      position: badgePosition,
      top: badgeTop,
      left: badgeLeft,
      width: badgeWidth,
      height: badgeHeight,
    };
  }, [badgePosition, badgeTop, badgeLeft, badgeWidth, badgeHeight]);

  return (
    <div
      className={[styles.root, className].join(" ")}
      data-size={size}
      data-style={style}
      style={badgeStyle}
    >
      <img
        className={styles.pharrowUpRightLightIcon}
        alt=""
        src={pharrowUpRightLight}
      />
    </div>
  );
};

Badge.propTypes = {
  className: PropTypes.string,
  pharrowUpRightLight: PropTypes.string,

  
  size: PropTypes.string,
  style: PropTypes.number,

  
  badgePosition: PropTypes.string,
  badgeTop: PropTypes.string,
  badgeLeft: PropTypes.string,
  badgeWidth: PropTypes.string,
  badgeHeight: PropTypes.string,
};

export default Badge;
