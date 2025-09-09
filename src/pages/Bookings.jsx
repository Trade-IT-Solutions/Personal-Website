import { useState } from "react";
import emailjs from "@emailjs/browser";
import styles from "../components/Booking.module.css";

const Bookings = () => {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    bookingType: "",
    budget: "",
    eventTheme: "",
    eventDate: "",
    eventLocation: "",
    additionalInfo: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceID = "service_8udmjzt";
    const templateID = "template_ur0h4cr"; // You can create a specific booking template
    const publicKey = "xm_PgDq3DqQTHCiYS";

    const templateParams = {
      to_email: "contact@kellyohgee.info",
      from_name: formData.name,
      from_email: formData.email,
      organization: formData.organization,
      phone: formData.phone,
      booking_type: formData.bookingType,
      budget: formData.budget,
      event_theme: formData.eventTheme,
      event_date: formData.eventDate,
      event_location: formData.eventLocation,
      additional_info: formData.additionalInfo,
    };

    setIsLoading(true);

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log(
          "Booking request sent successfully!",
          response.status,
          response.text
        );
        setIsSubmitted(true);

        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            organization: "",
            email: "",
            phone: "",
            bookingType: "",
            budget: "",
            eventTheme: "",
            eventDate: "",
            eventLocation: "",
            additionalInfo: "",
          });
        }, 3000);
      })
      .catch((err) => {
        console.log("Failed to send booking request:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>Book Kelly to Speak</h1>
          <p className={styles.subtitle}>
            Transform your event with purpose-driven education and inspiration.
            Let's create something amazing together that empowers your audience.
          </p>
        </div>

        {/* Services Grid */}

        {/* Booking Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={styles.input}
                onFocus={(e) => (e.target.style.borderColor = "#dac5a7")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(218, 197, 167, 0.2)")
                }
              />

              <input
                type="text"
                name="organization"
                placeholder="Organization or Event Name"
                value={formData.organization}
                onChange={handleInputChange}
                className={styles.input}
                onFocus={(e) => (e.target.style.borderColor = "#dac5a7")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(218, 197, 167, 0.2)")
                }
              />

              <div className={styles.inputRow}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#dac5a7")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(218, 197, 167, 0.2)")
                  }
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#dac5a7")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(218, 197, 167, 0.2)")
                  }
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Event Details</h2>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="bookingType"
                placeholder="What do you want to book Kelly for? (e.g., Keynote, Panel, Workshop)"
                value={formData.bookingType}
                onChange={handleInputChange}
                required
                className={styles.input}
                onFocus={(e) => (e.target.style.borderColor = "#dac5a7")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(218, 197, 167, 0.2)")
                }
              />

              <div className={styles.inputRow}>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#dac5a7")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(218, 197, 167, 0.2)")
                  }
                />

                <input
                  type="text"
                  name="eventLocation"
                  placeholder="Event Location"
                  value={formData.eventLocation}
                  onChange={handleInputChange}
                  className={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#dac5a7")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(218, 197, 167, 0.2)")
                  }
                />
              </div>

              <input
                type="text"
                name="budget"
                placeholder="What is your budget?"
                value={formData.budget}
                onChange={handleInputChange}
                className={styles.input}
                onFocus={(e) => (e.target.style.borderColor = "#dac5a7")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(218, 197, 167, 0.2)")
                }
              />

              <textarea
                name="eventTheme"
                placeholder="What is the theme or goal of the event?"
                value={formData.eventTheme}
                onChange={handleInputChange}
                className={styles.textarea}
                onFocus={(e) => (e.target.style.borderColor = "#dac5a7")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(218, 197, 167, 0.2)")
                }
              />

              <textarea
                name="additionalInfo"
                placeholder="Additional information or special requirements..."
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className={styles.textarea}
                onFocus={(e) => (e.target.style.borderColor = "#dac5a7")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(218, 197, 167, 0.2)")
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            //  cursor: isLoading ? "not-allowed" : "pointer",
            className={styles.submitButton}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = "#cbb89d";
                e.target.style.transform = "scale(1.02)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = "#dac5a7";
                e.target.style.transform = "scale(1)";
              }
            }}
          >
            {isLoading ? "Sending Request..." : "Send Booking Request"}
          </button>
        </form>
      </div>

      {/* Success Overlay */}
      {isSubmitted && (
        <div className={styles.overlay}>
          <div className={styles.overlayText}>
            Booking Request Sent Successfully!
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
