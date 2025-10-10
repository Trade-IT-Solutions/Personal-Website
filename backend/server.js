const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://personal-website-us3x.onrender.com',
  'https://www.kellyohgee.com',
  'https://kellyohgee.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Verify SMTP connection on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// Email sending endpoint
app.post('/api/send-resource', async (req, res) => {
  try {
    const { name, email, phone, countryCode, resourceType, emailTemplate } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !resourceType || !emailTemplate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Determine which PDF to send
    let pdfFileName, pdfPath, resourceTitle;
    
    if (resourceType === 'wam') {
      pdfFileName = 'kellys-wam-method.pdf';
      pdfPath = path.join(__dirname, 'pdfs', pdfFileName);
      resourceTitle = "Kelly's WAM Method";
    } else if (resourceType === 'markets') {
      pdfFileName = 'read-markets-like-story.pdf';
      pdfPath = path.join(__dirname, 'pdfs', pdfFileName);
      resourceTitle = 'How to Read the Markets Like a Story';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource type'
      });
    }

    // Check if PDF exists
    if (!fs.existsSync(pdfPath)) {
      console.error(`PDF not found: ${pdfPath}`);
      return res.status(404).json({
        success: false,
        message: 'Resource file not found'
      });
    }

    // Prepare email with template from frontend
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'Kelly Ohgee',
        address: process.env.SMTP_USER
      },
      to: email,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
      attachments: [
        {
          filename: pdfFileName,
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email to user
    await transporter.sendMail(mailOptions);

    // Send admin notification
    const adminMailOptions = {
      from: {
        name: 'Kelly Website',
        address: process.env.SMTP_USER
      },
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `New Resource Download: ${resourceTitle}`,
      text: `New resource request:\n\nName: ${name}\nEmail: ${email}\nPhone: ${countryCode} ${phone}\nResource: ${resourceTitle}\nTime: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #22201D;">New Resource Download</h2>
          <p><strong>Resource:</strong> ${resourceTitle}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${countryCode} ${phone}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    await transporter.sendMail(adminMailOptions);

    // Return success response
    res.status(200).json({
      success: true,
      message: `${resourceTitle} has been sent to ${email}`
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`SMTP configured: ${!!process.env.SMTP_HOST}`);
});