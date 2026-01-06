import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import Input1 from "./Input1contact";
import Button from "./Buttoncontact";
import PropTypes from "prop-types";
import styles from "./Containercontact.module.css";

const Container = ({ setShowOverlay }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();

    // Simple validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      setStatusMessage("Please fill in all fields before submitting.");
      setTimeout(() => setStatusMessage(""), 3000);
      return;
    }

    const serviceID = "service_8udmjzt";
    const templateID = "template_d870taq";
    const publicKey = "xm_PgDq3DqQTHCiYS";

    emailjs
      .send(serviceID, templateID, formData, publicKey)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setStatusMessage("");

        // ✅ Instantly scroll to top
        window.scrollTo(0, 0);

        setShowOverlay(true);
        setTimeout(() => {
          setShowOverlay(false);
        }, 3000);
      })
      .catch((err) => {
        console.log("FAILED...", err);
        setStatusMessage("Failed to send message. Please try again later.");
        setTimeout(() => setStatusMessage(""), 3000);
      });
  };

  return (
    <div className={styles.container}>
      <img className={styles.imageIcon1} alt="" src="/KellyTalks.png" />
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.grid1}>
            <h1 className={styles.letsGetIn}>Connect With Kelly!</h1>
          </div>

          <Input1
            style="Default"
            name1="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            maxLength={50}
          />
          <Input1
            style="Default"
            name1="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            maxLength={100}
          />
          <Input1
            name="phone"
            name1="Phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            maxLength={15}
          />
          <Input1
            style="Default"
            name1="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            maxLength={500}
            isTextArea={true}
          />

          {statusMessage && (
            <div className={styles.errorMessage}>{statusMessage}</div>
          )}

          <Button
            icon="None"
            size="Small"
            style="Primary"
            buttonAlignSelf="stretch"
            button="Send Message"
            type="button"
            onClick={handleSubmit} // ✅ use handleSubmit to fix ESLint warning
          />
        </div>
      </div>
    </div>
  );
};

Container.propTypes = {
  className: PropTypes.string,
  setShowOverlay: PropTypes.func.isRequired,
};

export default Container;
