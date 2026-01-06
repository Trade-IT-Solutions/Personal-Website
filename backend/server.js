const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://personal-website-us3x.onrender.com',
  'https://www.kellyohgee.info',
  'https://kellyohgee.info'
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

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log('SendGrid configured:', !!process.env.SENDGRID_API_KEY);

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

    // Read PDF and convert to base64
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBuffer.toString('base64');

    // Prepare email to user
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.FROM_NAME || 'Kelly Ohgee'
      },
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
      attachments: [
        {
          content: pdfBase64,
          filename: pdfFileName,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };

    // Send email to user
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${email}`);

    // Send admin notification
    const adminNotification = {
      to: process.env.ADMIN_EMAIL || process.env.SENDGRID_FROM_EMAIL,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: 'Kelly Website'
      },
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

    await sgMail.send(adminNotification);
    console.log(`Admin notification sent`);

    // Return success response
    res.status(200).json({
      success: true,
      message: `${resourceTitle} has been sent to ${email}`
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    sendgridConfigured: !!process.env.SENDGRID_API_KEY
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`SendGrid API Key configured: ${!!process.env.SENDGRID_API_KEY}`);
});
