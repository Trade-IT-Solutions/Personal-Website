import React, { useCallback } from "react";
import Main from "../components/Main";
import Community from "../components/Community";
import YouTubeConnectRecreated from "../components/YouTubeConnectRecreated";
import ContactForm from "../components/ContactForm";
import Card1 from "../components/Card1";
import FrameComponent from "../components/FrameComponent";
import FrameComponent1 from "../components/FrameComponent1";
import Card2 from "../components/Card2";
import FooterLinks from "../components/FooterLinks";
import Footer3 from "../components/Footer";
import Badge from "../components/Badge";

import styles from "./MobileView.module.css";

const MobileView = () => {
  const onFrameContainerClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='heroHamburger']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  return (
    <div className={styles.mobileView}>
      <Main />
      <Community />
      <YouTubeConnectRecreated />
      <ContactForm />
      <section className={styles.process}>
        <div className={styles.processDescription}>
          <div className={styles.theProcess}>The Process</div>
          <h1 className={styles.empowermentThroughEducationContainer}>
            <p className={styles.empowermentThrough}>{`Empowerment Through `}</p>
            <p className={styles.empowermentThrough}>Education in 5 Steps</p>
          </h1>
          <div className={styles.websiteDescription}>
            <div className={styles.ourProcessEnsures}>
              Kelly believes that your presence should be filled with purpose.
              Here are some ways she practices that.
            </div>
          </div>
        </div>
      </section>
      <section className={styles.features}>
        <div className={styles.featureCards}>
          <Card1 />
          <FrameComponent />
          <FrameComponent1 />
          <Card2 />
        </div>
      </section>
      <section className={styles.footerInfo}>
        <div className={styles.socialLinks}>
          <div className={styles.footerName}>
            <div className={styles.kellyOhgee}>
              <img
                src="/kelly-logo-11@2x.png"
                alt="Kelly Ohgee Logo"
                className={styles.kellyLogo}
              />
            </div>
          </div>
          <div className={styles.myMission}>
            My mission is to revolutionize the way we perceive education,
            empowering future generations to thrive. Your growth, your progress,
            and your achievement, my concern.
          </div>
        </div>
      </section>
      <FooterLinks />
      <Footer3 />
      <section className={styles.frameBelow}>
        <div className={styles.kellyOhgee2025}>© Kelly Ohgee 2025</div>
        <div className={styles.frameBelowInner}>
          <div className={styles.badgeParent} onClick={onFrameContainerClick}>
            <Badge
              size="Default"
              style="Default"
              badgePosition="unset"
              badgeTop="unset"
              badgeLeft="unset"
              badgeWidth="unset"
              badgeHeight="46px"
              pharrowUpRightLight="/pharrowuplight2.svg"
              showBadge
              badgeAlignSelf="stretch"
              badgeFlex="1"
              badgeBorderRadius="500px"
              badgeBorder="1px solid rgba(218, 197, 167, 0.15)"
              badgePadding="8px 12px"
            />
            <div className={styles.toTop}>To Top</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileView;
