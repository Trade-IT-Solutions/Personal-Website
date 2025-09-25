import { useCallback } from "react";
import Button from "./Button";
import PropTypes from "prop-types";
import styles from "./Main.module.css";

const Main = ({ className = "" }) => {
  const onHamburgerContainerClick = useCallback(() => {
    // Please sync "Mobile View Pop Up Opened" to the project
  }, []);

  return (
    <section className={[styles.main, className].join(" ")}>
      <div className={styles.heroHamburger} data-scroll-to="heroHamburger">
        <div className={styles.header}>
          
          <div className={styles.servicesParent}>
            <div className={styles.services}>Services</div>
            <div className={styles.work}>Work</div>
            <div className={styles.about}>About</div>
            <div className={styles.blog}>Blog</div>
          </div>
          <Button
            icon="None"
            size="Small"
            style="Primary"
            buttonAlignSelf="unset"
            button="Let’s talk"
            buttonHeight="12px"
            buttonWidth="32px"
            showButton={false}
            buttonPadding="5.5px 8.9px"
            buttonFontSize="7.2px"
          />
          <div className={styles.hamburgerMenu}>
            <div
              className={styles.hamburger}
              onClick={onHamburgerContainerClick}
            >
              <div className={styles.hamburgerChild} />
              <div className={styles.hamburgerChild} />
              <div className={styles.hamburgerChild} />
            </div>
          </div>
        </div>
        <img
          className={styles.heroTopIcon}
          loading="lazy"
          alt=""
          src="/image@2x.jpeg"
        />
        <div className={styles.missionStatement}>
          <div className={styles.frameParent}>
            <div className={styles.empoweringGenerationsWrapper}>
              <div className={styles.empoweringGenerations}>
                <p className={styles.empowering}>Empowering</p>
                <p className={styles.empowering}>Generations</p>
              </div>
            </div>
            <div className={styles.myMissionIs}>
              My mission is to revolutionize the way we perceive education,
              empowering future generations to thrive. Your growth, your
              progress, and your achievement, my concern.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Main.propTypes = {
  className: PropTypes.string,
};

export default Main;
