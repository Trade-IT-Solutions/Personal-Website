import { useMemo } from "react";
import PropTypes from "prop-types";
import "./BadgeABOUT.css";

const Badge = ({
  className = "",
  size = "XSmall",
  style = "Default",
  badgeWidth,
  badgeHeight,
  pharrowDownLight,
}) => {
  const badgeStyle = useMemo(() => {
    return {
      width: badgeWidth,
      height: badgeHeight,
    };
  }, [badgeWidth, badgeHeight]);

  return (
    <div
      className={`root ${className}`}
      data-size={size}
      data-style={style}
      style={badgeStyle}
    >
      <img
        className="pharrow-down-light-icon"
        
        alt=""
        src={pharrowDownLight}
      />
    </div>
  );
};

Badge.propTypes = {
  className: PropTypes.string,
  pharrowDownLight: PropTypes.string,

  /** Variant props */
  size: PropTypes.string,
  style: PropTypes.number,

  /** Style props */
  badgeWidth: PropTypes.string,
  badgeHeight: PropTypes.string,
};

export default Badge;
