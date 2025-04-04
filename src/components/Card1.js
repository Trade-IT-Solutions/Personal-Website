import PropTypes from "prop-types";
import styles from "./Card1.module.css";

const Card1 = ({ className = "" }) => {
  return (
    <div className={[styles.card1, className].join(" ")}>
      <div className={styles.lineParent}>
        <div className={styles.line} />
        <div className={styles.badgeWrapper}>
          <div className={styles.badge}>
            <div className={styles.div}>01</div>
          </div>
        </div>
      </div>
      <div className={styles.lessonsDescription}>
        <h2 className={styles.cinemaBasedLessons}>Cinema-Based Lessons</h2>
        <div className={styles.throughHerMain}>
        Through her main YouTube channel, Kelly turns life’s toughest situations into powerful, motivational mini-movies that inspire, teach, and remind us all that growth comes from helping others
        </div>
      </div>
      <div className={styles.line1} />
    </div>
  );
};

Card1.propTypes = {
  className: PropTypes.string,
};

export default Card1;
