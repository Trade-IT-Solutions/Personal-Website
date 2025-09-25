import PropTypes from "prop-types";
import styles from "./Card2.module.css";

const Card2 = ({ className = "" }) => {
  return (
    <div className={[styles.card5, className].join(" ")}>
      <div className={styles.badge}>
            <div className={styles.content}>05</div>
          </div>
      <h2 className={styles.theBigThing}>the big thing</h2>
      <div className={styles.line} />
      <div className={styles.bigThingContent}>
        <div className={styles.bigThingBadge}>
          
        </div>
        <div className={styles.findingHerFirst}>
          Finding her first major success in the trading industry, Kelly has
          dedicated her time and resources to revolutionizing its education.
          She’s now building an innovative EdTech company to make that
          transformation sustainable and accessible for all.
        </div>
        <div className={styles.line1} />
      </div>
    </div>
  );
};

Card2.propTypes = {
  className: PropTypes.string,
};

export default Card2;
