

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./Booking.module.css";

const Booking = ({ className = "" }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null); // true for success, false for error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceID = "service_8udmjzt";
    const templateID = "template_a0fdrhk";
    const publicKey = "xm_PgDq3DqQTHCiYS";

    emailjs
      .send(serviceID, templateID, formData, publicKey)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        setStatusMessage("Message sent successfully!");
        setIsSuccess(true);
        setFormData({ name: "", phone: "", email: "" });

        setTimeout(() => {
          setStatusMessage("");
          setIsSuccess(null);
        }, 3000);
      })
      .catch((err) => {
        console.log("FAILED...", err);
        setStatusMessage("Failed to send message. Please try again later.");
        setIsSuccess(false);

        setTimeout(() => {
          setStatusMessage("");
          setIsSuccess(null);
        }, 3000);
      });
  };

  return (
    <section className={[styles.booking, className].join(" ")}>
      <div className={styles.submitParent}>
        <form className={styles.submit} onSubmit={handleSubmit}>
          <div className={styles.messageOptions}>
            <div className={styles.receiveAPersonal}>
            Stay in touch with Kelly!
            </div>
            <div className={styles.contactDetails}>
              <div className={styles.name}>
                <input
                  className={styles.inputField}
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.name}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone No"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
              </div>
              <div className={styles.contactInfo}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
              </div>
            </div>
          </div>

          {/* Status message */}
          {statusMessage && (
            <div
              className={
                isSuccess ? styles.successMessage : styles.errorMessage
              }
            >
              {statusMessage}
            </div>
          )}

          <button type="submit" className={styles.submit1}>
            <div className={styles.submit2}>Submit</div>
          </button>
        </form>

        <div className={styles.bookHere}>
          <div className={styles.bookKellyTo}>Book Kelly To Speak</div>
          <div className={styles.submitWrapper}>
            <Link to="/contact" className={styles.submit3}>
              <div className={styles.bookHere1}>Book Here</div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

Booking.propTypes = {
  className: PropTypes.string,
};

export default Booking;
