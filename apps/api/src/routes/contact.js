import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /contact
router.post('/', async (req, res) => {
  const { name, email, company, message } = req.body;

  // Validate all required fields
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!company || typeof company !== 'string') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Send email via Resend API
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'noreply@vegamailer.com',
      to: 'mail.os-healthcarepro.com',
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