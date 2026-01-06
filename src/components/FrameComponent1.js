import PropTypes from "prop-types";
import styles from "./FrameComponent1.module.css";

const FrameComponent1 = ({ className = "" }) => {
  return (
    <div className={[styles.communityCardParent, className].join(" ")}>
      <div className={styles.communityCard}>
        <div className={styles.card3}>
          <div className={styles.badge}>
            <div className={styles.div}>03</div>
          </div>
          <h2 className={styles.unifiedPrivateCommunity}>privatE community</h2>
          <div className={styles.line} />
          <div className={styles.communityContent}>
            <div className={styles.exclusiveSpace}>
              <div className={styles.theOhgeeFamily}>
                The Ohgee Family is a tight-knit, exclusive space where people
                passionate about trading, business, and personal growth come
                together to learn, share, and support each other on their
                journeys.
              </div>
            </div>
            <div className={styles.line1} />
          </div>
        </div>
      </div>
      <div className={styles.card4}>
        <div className={styles.badge1}>
          <div className={styles.div}>04</div>
        </div>
        <h2 className={styles.socialMedia}>social media</h2>
        <div className={styles.line2} />
        <div className={styles.socialMediaContent}>
          <div className={styles.socialMediaDescription}>
            <div className={styles.onInstagramAnd}>
              On Instagram and X (Twitter), Kelly shares her unfiltered
              thoughts, daily life, and advice, always with the goal of helping
              YOU grow and succeed.
            </div>
          </div>
          <div className={styles.line3} />
        </div>
      </div>
    </div>
  );
};

FrameComponent1.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent1;