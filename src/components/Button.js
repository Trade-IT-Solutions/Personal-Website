import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

const Button = ({
  className = "",
  icon = "None",
  size = "Small",
  style = "Default",
  buttonAlignSelf,
  button,
  buttonHeight,
  buttonWidth,
  showButton,
  buttonPadding,
  buttonFontSize,
}) => {
  const buttonStyle = useMemo(() => {
    return {
      alignSelf: buttonAlignSelf,
      padding: buttonPadding,
    };
  }, [buttonAlignSelf, buttonPadding]);

  const button1Style = useMemo(() => {
    return {
      height: buttonHeight,
      width: buttonWidth,
      fontSize: buttonFontSize,
    };
  }, [buttonHeight, buttonWidth, buttonFontSize]);

  return (
    showButton && (
      <div
        className={[styles.button1, className].join(" ")}
        data-icon={icon}
        data-size={size}
        data-style={style}
        style={buttonStyle}
      >
        <div className={styles.button} style={button1Style}>
          {button}
        </div>
      </div>
    )
  );
};

Button.propTypes = {
  className: PropTypes.string,
  button: PropTypes.string,
  showButton: PropTypes.bool,

  /** Variant props */
  icon: PropTypes.number,
  size: PropTypes.number,
  style: PropTypes.number,

  /** Style props */
  buttonAlignSelf: PropTypes.string,
  buttonHeight: PropTypes.string,
  buttonWidth: PropTypes.string,
  buttonPadding: PropTypes.string,
  buttonFontSize: PropTypes.string,
};

export default Button;
