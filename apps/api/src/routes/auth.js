import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /auth/verify-email
router.post('/verify-email', async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

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