import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./SectionServices1.module.css";
import CtaBooking from "./CtaBooking";
import { useNavigate } from "react-router-dom";

const SectionServices1 = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <section className={[styles.sectionServices, className].join(" ")}>
      <CtaBooking onBookingClick={() => navigate("/bookings")} />
      {/* <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.receive1}>
            <h3 className={styles.bookKellyTo}>Book Kelly to Speak</h3>
            <Link to="/bookings" className={styles.ctaBooking}>
              <div className={styles.bookLinkContent}>
                <h1 className={styles.bookHere}>Book here</h1>
              </div>
            </Link>
          </div>
        </div>
      </div> */}
    </section>
  );
};

SectionServices1.propTypes = {
  className: PropTypes.string,
};

export default SectionServices1;
