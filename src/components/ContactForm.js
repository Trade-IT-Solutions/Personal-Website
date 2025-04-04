import PropTypes from "prop-types";
import styles from "./ContactForm.module.css";

const ContactForm = ({ className = "" }) => {
  return (
    <section className={[styles.contactForm, className].join(" ")}>
      <div className={styles.join}>
        <div className={styles.joinFamily}>
          <h1 className={styles.joinTheOhgee}>
            Join The Ohgee family household
          </h1>
        </div>
        <div className={styles.tradingEducation}>
          <div className={styles.getAccessToExclusiveTradinWrapper}>
            <div
              className={styles.getAccessTo}
            >{`Get access to exclusive education, video tutorials & lessons, and a strong, like-minded community!`}</div>
          </div>
          <div className={styles.aboutButtonParent}>
            <div className={styles.aboutButton}>
              <img
                className={styles.buttonTextIcon}
                alt=""
                src="/button-text-icon1.svg"
              />
              <div className={styles.aboutWrapper}>
                <a
                  className={styles.about}
                  href="https://patreon.com/kellyohgee"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  I&apos;m Ready to Join
                </a>
              </div>
            </div>
          </div>
          <div className={styles.joinChild} />
          {/* <div className={styles.ohgeeParent}>
            <h1 className={styles.ohgee}>Ohgee</h1>
            <div className={styles.family}>Family</div>
            <div className={styles.groupChild} />
          </div> */}
        </div>
      </div>
    </section>
  );
};

ContactForm.propTypes = {
  className: PropTypes.string,
};

export default ContactForm;
