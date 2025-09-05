import React, { useState } from 'react';
import emailjs from "@emailjs/browser";



const Bookings = () => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    bookingType: '',
    budget: '',
    eventTheme: '',
    eventDate: '',
    eventLocation: '',
    additionalInfo: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const serviceID = "service_8udmjzt";
    const templateID = "template_a0fdrhk"; // You can create a specific booking template
    const publicKey = "xm_PgDq3DqQTHCiYS";

    const templateParams = {
      to_email: 'contact@kellyohgee.info',
      from_name: formData.name,
      from_email: formData.email,
      organization: formData.organization,
      phone: formData.phone,
      booking_type: formData.bookingType,
      budget: formData.budget,
      event_theme: formData.eventTheme,
      event_date: formData.eventDate,
      event_location: formData.eventLocation,
      additional_info: formData.additionalInfo
    };

    setIsLoading(true);
    
    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log("Booking request sent successfully!", response.status, response.text);
        setIsSubmitted(true);
        
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            organization: '',
            email: '',
            phone: '',
            bookingType: '',
            budget: '',
            eventTheme: '',
            eventDate: '',
            eventLocation: '',
            additionalInfo: ''
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

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#0e0e0e',
      color: '#dac5a7',
      fontFamily: 'Inter, sans-serif',
      padding: '80px 20px 40px',
      boxSizing: 'border-box'
    },
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%'
    },
    header: {
      textAlign: 'center',
      marginBottom: '60px'
    },
    title: {
      fontSize: 'clamp(2.5rem, 6vw, 4rem)',
      fontWeight: 700,
      margin: '0 0 20px 0',
      background: 'linear-gradient(135deg, #dac5a7, #cbb89d)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '2px',
      textTransform: 'uppercase'
    },
    subtitle: {
      fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
      fontWeight: 400,
      color: 'rgba(218, 197, 167, 0.8)',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6',
      fontFamily: 'Satoshi, sans-serif'
    },
    form: {
      backgroundColor: 'rgba(218, 197, 167, 0.05)',
      borderRadius: '24px',
      border: '2px solid rgba(218, 197, 167, 0.15)',
      padding: '50px 40px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px)'
    },
    section: {
      marginBottom: '40px'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 600,
      marginBottom: '25px',
      color: '#dac5a7',
      borderBottom: '2px solid rgba(218, 197, 167, 0.2)',
      paddingBottom: '10px'
    },
    inputGroup: {
      display: 'grid',
      gap: '20px',
      marginBottom: '20px'
    },
    inputRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    input: {
      width: '100%',
      height: '55px',
      borderRadius: '12px',
      backgroundColor: 'rgba(218, 197, 167, 0.1)',
      border: '2px solid rgba(218, 197, 167, 0.2)',
      padding: '0 20px',
      fontSize: '16px',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box',
      color: '#dac5a7',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      borderRadius: '12px',
      backgroundColor: 'rgba(218, 197, 167, 0.1)',
      border: '2px solid rgba(218, 197, 167, 0.2)',
      padding: '20px',
      fontSize: '16px',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box',
      color: '#dac5a7',
      transition: 'all 0.3s ease',
      outline: 'none',
      resize: 'vertical'
    },
    submitButton: {
      backgroundColor: '#dac5a7',
      border: 'none',
      borderRadius: '16px',
      color: '#0e0e0e',
      padding: '20px 50px',
      fontSize: '18px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      cursor: isLoading ? 'not-allowed' : 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      width: '100%',
      transition: 'all 0.3s ease',
      opacity: isLoading ? 0.7 : 1,
      boxShadow: '0 8px 25px rgba(218, 197, 167, 0.3)',
      transform: isLoading ? 'scale(0.98)' : 'scale(1)',
      marginTop: '30px'
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(10px)'
    },
    overlayText: {
      color: '#dac5a7',
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '0 20px',
      animation: 'scaleUp 0.4s ease-in-out'
    },
    servicesList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '50px'
    },
    serviceItem: {
      backgroundColor: 'rgba(218, 197, 167, 0.08)',
      borderRadius: '16px',
      padding: '25px',
      border: '1px solid rgba(218, 197, 167, 0.15)',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    },
    serviceIcon: {
      fontSize: '48px',
      marginBottom: '15px',
      display: 'block'
    },
    serviceTitle: {
      fontSize: '18px',
      fontWeight: 600,
      marginBottom: '10px',
      color: '#dac5a7'
    },
    serviceDescription: {
      fontSize: '14px',
      color: 'rgba(218, 197, 167, 0.7)',
      lineHeight: '1.5'
    }
  };



  return (
    
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>Book Kelly to Speak</h1>
          <p style={styles.subtitle}>
            Transform your event with purpose-driven education and inspiration. 
            Let's create something amazing together that empowers your audience.
          </p>
        </div>

        {/* Services Grid */}
        

        {/* Booking Form */}
        <form style={styles.form} onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Personal Information</h2>
            <div style={styles.inputGroup}>
              <input
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#dac5a7'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(218, 197, 167, 0.2)'}
              />
              
              <input
                type="text"
                name="organization"
                placeholder="Organization or Event Name"
                value={formData.organization}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#dac5a7'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(218, 197, 167, 0.2)'}
              />
              
              <div style={styles.inputRow}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#dac5a7'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(218, 197, 167, 0.2)'}
                />
                
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#dac5a7'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(218, 197, 167, 0.2)'}
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Event Details</h2>
            <div style={styles.inputGroup}>
              <input
                type="text"
                name="bookingType"
                placeholder="What do you want to book Kelly for? (e.g., Keynote, Panel, Workshop)"
                value={formData.bookingType}
                onChange={handleInputChange}
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#dac5a7'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(218, 197, 167, 0.2)'}
              />
              
              <div style={styles.inputRow}>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#dac5a7'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(218, 197, 167, 0.2)'}
                />
                
                <input
                  type="text"
                  name="eventLocation"
                  placeholder="Event Location"
                  value={formData.eventLocation}
                  onChange={handleInputChange}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#dac5a7'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(218, 197, 167, 0.2)'}
                />
              </div>
              
              <input
                type="text"
                name="budget"
                placeholder="What is your budget?"
                value={formData.budget}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#dac5a7'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(218, 197, 167, 0.2)'}
              />
              
              <textarea
                name="eventTheme"
                placeholder="What is the theme or goal of the event?"
                value={formData.eventTheme}
                onChange={handleInputChange}
                style={styles.textarea}
                onFocus={(e) => e.target.style.borderColor = '#dac5a7'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(218, 197, 167, 0.2)'}
              />
              
              <textarea
                name="additionalInfo"
                placeholder="Additional information or special requirements..."
                value={formData.additionalInfo}
                onChange={handleInputChange}
                style={styles.textarea}
                onFocus={(e) => e.target.style.borderColor = '#dac5a7'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(218, 197, 167, 0.2)'}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={styles.submitButton}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#cbb89d';
                e.target.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#dac5a7';
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            {isLoading ? 'Sending Request...' : 'Send Booking Request'}
          </button>
        </form>
      </div>

      {/* Success Overlay */}
      {isSubmitted && (
        <div style={styles.overlay}>
          <div style={styles.overlayText}>
            Booking Request Sent Successfully!
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleUp {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        input::placeholder, textarea::placeholder {
          color: rgba(218, 197, 167, 0.6) !important;
          opacity: 1 !important;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          background: linear-gradient(45deg, #dac5a7, #cbb89d);
          border-radius: 6px;
          padding: 6px;
          margin-left: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(218, 197, 167, 0.3);
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          background-color: #cbb89d;
          transform: scale(1.1);
        }
        
        input[type="date"]::-webkit-datetime-edit {
          color: #dac5a7;
        }
        
        input[type="date"]::-webkit-datetime-edit-fields-wrapper {
          color: #dac5a7;
        }
        
        input[type="date"]::-webkit-datetime-edit-text {
          color: rgba(218, 197, 167, 0.6);
          padding: 0 4px;
        }
        
        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="date"]::-webkit-datetime-edit-year-field {
          color: #dac5a7;
          font-weight: 500;
        }
        
        @media screen and (max-width: 768px) {
          .input-row {
            grid-template-columns: 1fr !important;
          }
          
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media screen and (max-width: 480px) {
          .form-container {
            padding: 30px 20px !important;
          }
          
          .page-container {
            padding: 60px 10px 40px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Bookings;