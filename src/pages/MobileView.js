import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiUser, FiMail, FiCalendar } from "react-icons/fi";
import Main from "../components/Main";
import Community from "../components/Community";
import YouTubeConnectRecreated from "../components/YouTubeConnectRecreated";
import ContactForm from "../components/ContactForm";
import Booking from "../components/Booking";
import Card1 from "../components/Card1";
import FrameComponent from "../components/FrameComponent";
import FrameComponent1 from "../components/FrameComponent1";
import Card2 from "../components/Card2";
import FooterLinks from "../components/FooterLinks";
import Footer3 from "../components/Footer";
import Badge from "../components/Badge";

import styles from "./MobileView.module.css";
import Navbar from "../components/navigation/Navbar";

const MobileView = () => {
  const [isScrolling, setIsScrolling] = useState(true); // Always visible initially
  let scrollTimeout = null;

  // Detect scrolling and hide/show navbar accordingly
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      clearTimeout(scrollTimeout);

      // Hide navbar after 2 seconds of no scrolling
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

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
          <div className={styles.theProcess}>THe PRocess</div>
          <h1 className={styles.empowermentThroughEducationContainer}>
            <p
              className={styles.empowermentThrough}
            >{`Empowerment Through `}</p>
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

      {/* Remove the bottom navigation as we've moved it to the top */}
    </div>
  );
};

export default MobileView;
