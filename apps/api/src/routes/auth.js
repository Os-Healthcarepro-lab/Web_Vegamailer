import express from 'express';
import { body, validationResult } from 'express-validator';
import { strictRateLimit } from '../middleware/index.js';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Validation rules
const emailValidation = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
];

// POST /auth/verify-email - Apply strict rate limiting
router.post('/verify-email', strictRateLimit, emailValidation, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }

  const { email } = req.body;

  try {
    // Send verification email using PocketBase built-in mailer
    await pb.collection('users').requestVerification(email);
    
    logger.info(`Verification email sent to ${email}`);
    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to send verification email:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
});

export default router;