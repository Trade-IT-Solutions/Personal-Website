// BookingCTA.jsx
import { useState, useRef } from "react";
import styles from "./CtaBooking.module.css";
import PropTypes from "prop-types";

const CtaBooking = ({
  name = "Kelly",
  heading = "Ready to Connect with Kelly?",
  subHeading = "Schedule your consultation today and let's discuss how we can work together to achieve your goals.",
  buttonText = "Book Your Session",
  isAvailable = true,
  onBookingClick = () => console.log("Booking clicked"),
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleBooking = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
      onBookingClick();
    }, 250);
  };

  return (
    <div
      // ref={containerRef}
      className={styles.ctaContainer}
      // onMouseMove={handleMouseMove}
    >
      {isAvailable && (
        <div className={styles.availabilityBadge}>Available Now</div>
      )}

      <div className={styles.kellyAvatar}>{name.charAt(0).toUpperCase()}</div>

      <h1 className={styles.mainHeading}>{heading}</h1>
      <p className={styles.subHeading}>{subHeading}</p>

      <button
        className={styles.ctaButton}
        onClick={handleBooking}
        style={{
          transform: isClicked ? "translateY(2px)" : "translateY(-2px)",
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

CtaBooking.propTypes = {
  name: PropTypes.string,
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  buttonText: PropTypes.string,
  isAvailable: PropTypes.bool,
  trustItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      text: PropTypes.string.isRequired,
    })
  ),
  onBookingClick: PropTypes.func,
};

export default CtaBooking;
