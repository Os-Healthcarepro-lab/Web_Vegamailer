import express from 'express';
import { body, validationResult } from 'express-validator';
import { strictRateLimit, honeypot } from '../middleware/index.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Validation and sanitization rules
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .escape()
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('company')
    .trim()
    .isLength({ min: 2, max: 100 })
    .escape()
    .withMessage('Company must be between 2 and 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .escape()
    .withMessage('Message must be between 10 and 1000 characters'),
];

// POST /contact - Apply strict rate limiting and honeypot
router.post('/', strictRateLimit, honeypot('website'), contactValidation, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const { name, email, company, message } = req.body;

  // Send email via Resend API
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'noreply@vegamailer.com',
      to: 'support@vegamailer.com',
      subject: 'New Contact Form Submission from VegaMailer',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.status} ${response.statusText}`);
  }

  logger.info(`Contact form submitted by ${name} (${email})`);

  res.json({
    success: true,
    message: 'Your message has been sent successfully. We will get back to you soon.',
  });
});

export default router;