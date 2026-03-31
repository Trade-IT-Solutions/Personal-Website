import React, { useState } from "react";
import styles from "./Resources.module.css";
import Footer from "../components/Footer.js";

// Production backend URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://personal-website-backend-e74k.onrender.com'
  : 'http://localhost:5000';

const Resources = () => {
  const [showForm, setShowForm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+1",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Email template generator
  const generateEmailTemplate = (name, resourceTitle) => {
    const subject = `Your Resource: ${resourceTitle}`;
    
    const text = `Hi ${name},

Thank you for your interest in ${resourceTitle}!

Please find the PDF attached to this email. This resource is designed to help you enhance your financial knowledge and trading skills.

Take your time to go through the material and implement the strategies shared.

If you have any questions or need further guidance, feel free to reach out!

Best regards,
Kelly Ohgee Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header Section -->
          <tr>
            <td style="background: linear-gradient(135deg, #22201D 0%, #2a2826 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #DAC5A7; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">
                Hi ${name}! 👋
              </h1>
              <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #D4A67C, #B8906A); margin: 20px auto;"></div>
              <p style="color: #DAC5A7; font-size: 16px; line-height: 1.6; margin: 15px 0 0 0;">
                Thank you for your interest in<br/>
                <strong style="font-size: 18px; color: #D4A67C;">${resourceTitle}</strong>
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
              
              <!-- Attachment Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #D4A67C 0%, #B8906A 100%); border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 10px;">📎</div>
                    <p style="color: #1a1816; font-size: 16px; font-weight: 600; margin: 0;">
                      Your PDF is attached to this email
                    </p>
                  </td>
                </tr>
              </table>

              <!-- What's Next Section -->
              <h2 style="color: #22201D; font-size: 22px; margin: 0 0 15px 0; font-weight: 700;">
                🎯 What's Next?
              </h2>
              
              <p style="color: #666666; font-size: 15px; line-height: 1.7; margin: 0 0 15px 0;">
                This resource is designed to help you enhance your financial knowledge and trading skills. Here's how to make the most of it:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #D4A67C; margin-bottom: 10px;">
                    <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">
                      <strong style="color: #D4A67C;">Step 1:</strong> Download the PDF from your email attachments
                    </p>
                  </td>
                </tr>
                <tr><td height="10"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #D4A67C;">
                    <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">
                      <strong style="color: #D4A67C;">Step 2:</strong> Take your time to go through the material carefully
                    </p>
                  </td>
                </tr>
                <tr><td height="10"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #D4A67C;">
                    <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">
                      <strong style="color: #D4A67C;">Step 3:</strong> Implement the strategies and techniques shared
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Support Section -->
              <div style="background-color: #f0f8ff; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0;">
                  💡 <strong>Need Help?</strong><br/>
                  If you have any questions or need further guidance, feel free to reach out. We're here to support your financial education journey!
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #22201D; padding: 30px; text-align: center;">
              <p style="color: #a89a82; font-size: 14px; margin: 0 0 5px 0;">
                Best regards,
              </p>
              <p style="color: #DAC5A7; font-size: 16px; font-weight: 700; margin: 0 0 20px 0;">
                Kelly Ohgee Team
              </p>
              <div style="border-top: 1px solid rgba(218, 197, 167, 0.2); padding-top: 20px; margin-top: 10px;">
                <p style="color: #a89a82; font-size: 12px; margin: 0; line-height: 1.5;">
                  Empowerment Through Education<br/>
                  © ${new Date().getFullYear()} Kelly Ohgee. All rights reserved.
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    return { subject, text, html };
  };

  const handleCardClick = (resourceType) => {
    setShowForm(resourceType);
    setSubmitMessage("");
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    
    if (value.length > 0) {
      if (value.length <= 3) {
        value = `(${value}`;
      } else if (value.length <= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      } else {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const resourceTitle = showForm === "wam" 
      ? "Kelly's WAM Method" 
      : "How to Read the Markets Like a Story";

    // Generate email template
    const emailTemplate = generateEmailTemplate(
      formData.name, 
      resourceTitle, 
      showForm
    );

    try {
      const response = await fetch(`${API_URL}/api/send-resource`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          countryCode: formData.countryCode,
          resourceType: showForm,
          emailTemplate: emailTemplate
        }),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json().catch(() => ({ message: 'Server error occurred' }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSubmitMessage(`Thank you! ${resourceTitle} has been sent to ${formData.email}. Please check your inbox (and spam folder).`);
        setErrorMessage(""); // Clear any previous errors
        
        setTimeout(() => {
          setShowForm(null);
          setFormData({
            name: "",
            countryCode: "+1",
            phone: "",
            email: "",
          });
          setSubmitMessage("");
        }, 5000);
      } else {
        setErrorMessage(data.message || "Failed to send email. Please try again.");
        setSubmitMessage(""); // Clear success message if there's an error
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // More specific error messages
      if (error.message.includes('CORS') || error.message.includes('fetch')) {
        setErrorMessage("Connection error. Please check your internet connection and try again.");
      } else if (error.message.includes('Failed to fetch')) {
        setErrorMessage("Unable to connect to server. Please try again in a moment.");
      } else {
        setErrorMessage(error.message || "An error occurred. Please try again or contact support.");
      }
      setSubmitMessage(""); // Clear success message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(null);
    setFormData({
      name: "",
      countryCode: "+1",
      phone: "",
      email: "",
    });
    setSubmitMessage("");
    setErrorMessage("");
  };

  return (
    <div className={styles.resources}>
      <div className={styles.resourcesContainer}>
        <h1 className={styles.mainTitle}>Resources</h1>
        <p className={styles.subtitle}>
          Download exclusive resources to enhance your financial knowledge
        </p>

        <div className={styles.cardsContainer}>
          <div className={styles.resourceCard}>
            <div className={styles.imageContainer}>
              <img
                src="/resource-wam-method.jpg"
                alt="WAM Method"
                className={styles.resourceImage}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300/22201D/DAC5A7?text=WAM+Method";
                }}
              />
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.resourceTitle}>
                Get Kelly's WAM Method Here
              </h2>
              <button
                className={styles.ctaButton}
                onClick={() => handleCardClick("wam")}
              >
                Click here!
              </button>
            </div>
          </div>

          <div className={styles.resourceCard}>
            <div className={styles.imageContainer}>
              <img
                src="/resource-markets-story.jpg"
                alt="Read Markets Like a Story"
                className={styles.resourceImage}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300/22201D/DAC5A7?text=Read+Markets";
                }}
              />
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.resourceTitle}>
                Learn How To Read The Markets Like A Story Here
              </h2>
              <button
                className={styles.ctaButton}
                onClick={() => handleCardClick("markets")}
              >
                Click Here!
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modalOverlay} onClick={handleCloseForm}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={handleCloseForm}
              aria-label="Close form"
            >
              ×
            </button>

            <h2 className={styles.formTitle}>
              {showForm === "wam"
                ? "Get Kelly's WAM Method"
                : "Learn How to Read the Markets"}
            </h2>

            {submitMessage ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <p>{submitMessage}</p>
              </div>
            ) : (
              <>
                {errorMessage && (
                  <div className={styles.errorMessage}>
                    <p>{errorMessage}</p>
                    <p style={{ marginTop: '10px', fontSize: '14px' }}>
                      If this problem persists, please email us directly at{' '}
                      <a href="mailto:contact@kellyohgee.com" style={{ color: '#DAC5A7', textDecoration: 'underline' }}>
                        contact@kellyohgee.com
                      </a>
                      {' '}to request the PDF.
                    </p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      Phone Number *
                    </label>
                    <div className={styles.phoneInputContainer}>
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleInputChange}
                        className={styles.countryCodeSelect}
                      >
                        <option value="+1">+1 (US/CA)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+61">+61 (AU)</option>
                        <option value="+91">+91 (IN)</option>
                        <option value="+86">+86 (CN)</option>
                        <option value="+81">+81 (JP)</option>
                        <option value="+49">+49 (DE)</option>
                        <option value="+33">+33 (FR)</option>
                        <option value="+39">+39 (IT)</option>
                        <option value="+34">+34 (ES)</option>
                        <option value="+52">+52 (MX)</option>
                        <option value="+55">+55 (BR)</option>
                        <option value="+27">+27 (ZA)</option>
                        <option value="+234">+234 (NG)</option>
                        <option value="+254">+254 (KE)</option>
                      </select>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={styles.phoneInput}
                        required
                        placeholder="(555) 123-4567"
                        maxLength="14"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send PDF"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Resources;
