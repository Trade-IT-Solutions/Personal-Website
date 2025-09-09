

import React from "react";

import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Buttoncontact.module.css";

const Button = ({
  className = "",
  icon = "None",
  size = "Small",
  style = "Default",
  buttonAlignSelf,
  button,
  onClick, // Handles form submission
  type = "button", // Allows specifying button type (default is "button")
}) => {
  const buttonStyle = useMemo(() => {
    return {
      alignSelf: buttonAlignSelf,
    };
  }, [buttonAlignSelf]);

  return (
    <button
      className={[styles.button1, className].join(" ")}
      data-icon={icon}
      data-size={size}
      data-style={style}
      style={buttonStyle}
      onClick={onClick} // Handles button click event
      type={type} // Specifies button type (can be "submit" for forms)
    >
      <span className={styles.button}>{button}</span>
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  button: PropTypes.string.isRequired,
  icon: PropTypes.string, // Fixed incorrect type
  size: PropTypes.string, // Fixed incorrect type
  style: PropTypes.string, // Fixed incorrect type
  buttonAlignSelf: PropTypes.string,
  onClick: PropTypes.func, // Allows handling clicks
  type: PropTypes.string, // Allows setting button type (e.g., "submit")
};

export default Button;
