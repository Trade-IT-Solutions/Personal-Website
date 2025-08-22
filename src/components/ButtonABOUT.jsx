import PropTypes from "prop-types";
import "./ButtonABOUT.css";

const Button = ({
  className = "",
  icon = "None",
  size = "Small",
  style = "Default",
}) => {
  return (
    <button
      className={`button1 ${className}`}
      data-icon={icon}
      data-size={size}
      data-style={style}
    >
      <div className="button">Let’s talk</div>
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,

  /** Variant props */
  icon: PropTypes.number,
  size: PropTypes.number,
  style: PropTypes.number,
};

export default Button;
