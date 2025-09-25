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
    </section>
  );
};

SectionServices1.propTypes = {
  className: PropTypes.string,
};

export default SectionServices1;
