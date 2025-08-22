import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./SectionServices1.module.css";

const SectionServices1 = ({ className = "" }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [showMessageSentOverlay, setShowMessageSentOverlay] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);

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
        setFormData({ name: "", phone: "", email: "" });

        // Show full screen "message sent" overlay
        setShowMessageSentOverlay(true);
        setTimeout(() => {
          setShowMessageSentOverlay(false);
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
    <section className={[styles.sectionServices, className].join(" ")}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.receive}>
            <div className={styles.grid1}>
              <h1 className={styles.receiveAPersonal}>
              Stay in touch with Kelly!
              </h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.receiveChild}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.inputField}
                />
              </div>
              <div className={styles.contact}>
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
              <div className={styles.receiveItem}>
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

              {statusMessage && (
                <div
                  className={
                    isSuccess ? styles.successMessage : styles.errorMessage
                  }
                >
                  {statusMessage}
                </div>
              )}

              <button type="submit" className={styles.submit}>
                <div className={styles.submitChild} />
                <div className={styles.submit1}>Submit</div>
              </button>
            </form>
          </div>

          <div className={styles.receive1}>
            <div className={styles.grid1} />
            <h3 className={styles.bookKellyTo}>Book Kelly to Speak</h3>
            <div className={styles.grid4}>
              <Link to="/contact" className={styles.gridChild}>
                <div className={styles.bookLinkContent}>
                  <h1 className={styles.bookHere}>
                    Book here
                    <img
                      className={styles.pharrowUpRightLightIcon}
                      loading="lazy"
                      alt="Arrow Icon"
                      src="/pharrowuprightlight.svg"
                    />
                  </h1>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Full screen "Message Sent" overlay */}
      {showMessageSentOverlay && (
        <div className={styles.messageSentOverlay}>
          <h1 className={styles.messageSentText}>Thank You! Message Sent</h1>
        </div>
      )}
    </section>
  );
};

SectionServices1.propTypes = {
  className: PropTypes.string,
};

export default SectionServices1;