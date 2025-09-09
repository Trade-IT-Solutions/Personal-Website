import Badge from "./Badge.js";
import PropTypes from "prop-types";
import styles from "./SectionProcess.module.css";
import React from "react";

const SectionProcess = ({ className = "" }) => {
  return (
    <section className={[styles.sectionProcess, className].join(" ")}>
      <div className={styles.grid}>
        <div className={styles.grid1}>
          <div className={styles.theProcess}>THe Process</div>
          <h1 className={styles.financialEducationInContainer}>
            <p className={styles.financialEducation}>Revolutionary Education</p>
            <p className={styles.financialEducation}>in 5 Steps</p>
          </h1>
          <h3 className={styles.ourProcessEnsures}>
          Kelly believes that your presence should be filled with purpose. Here are some ways she practices that.
          </h3>
        </div>
        <Badge
          size="Default"
          style="Default"
          badgePosition="unset"
          badgeTop="unset"
          badgeLeft="unset"
          badgeWidth="46px"
          badgeHeight="46px"
          pharrowUpRightLight="/pharrowdownlight.svg"
        />
      </div>
      <div className={styles.line} />
    </section>
  );
};

SectionProcess.propTypes = {
  className: PropTypes.string,
};

export default SectionProcess;
