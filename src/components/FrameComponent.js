import PropTypes from "prop-types";
import styles from "./FrameComponent.module.css";

const FrameComponent = ({ className = "" }) => {
  return (
    <div className={[styles.card2Wrapper, className].join(" ")}>
      <div className={styles.card2}>
        <div className={styles.badge}>
          <div className={styles.div}>02</div>
        </div>
        <h2 className={styles.financialEducation}>FINANCIAL EDUCATION</h2>
        <div className={styles.line} />
        <div className={styles.uncutDescription}>
          <div className={styles.throughHerUncutChannelSheWrapper}>
            <div className={styles.throughHerUncutContainer}>
              Through her UNCUT channel, she breaks down the often-overlooked truths about business, life, and mindset, providing real, honest insights aimed at changing the way you think and succeed.
            </div>
          </div>
          <div className={styles.line1} />
        </div>
      </div>
    </div>
  );
};

FrameComponent.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent;