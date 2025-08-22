import PropTypes from "prop-types";
import styles from "./Label.module.css";
import React from "react";

const Label = ({ className = "", style = "Default", label }) => {
  return (
    <div className={[styles.label1, className].join(" ")} data-style={style}>
      <div className={styles.label}>{label}</div>
    </div>
  );
};

Label.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,

  /** Variant props */
  style: PropTypes.number,
};

export default Label;
