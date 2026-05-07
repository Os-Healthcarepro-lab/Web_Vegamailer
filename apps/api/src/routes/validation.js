import express from 'express';
import logger from '../utils/logger.js';
import { isDisposableEmail } from '../utils/disposableEmailList.js';
import { checkEmailTypos } from '../utils/emailTypoChecker.js';

const router = express.Router();

// RFC 5322 compliant email regex (simplified but comprehensive)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /validate-email
router.post('/validate-email', async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const suggestions = [];
  let isValid = true;
  let reason = 'Valid email';

  // Check email format
  if (!emailRegex.test(trimmedEmail)) {
    isValid = false;
    reason = 'Invalid email format';
    logger.warn(`Invalid email format: ${trimmedEmail}`);
  }
  // Check for disposable email
  else if (isDisposableEmail(trimmedEmail)) {
    isValid = false;
    reason = 'Disposable email address not allowed';
    logger.warn(`Disposable email detected: ${trimmedEmail}`);
  }
  // Check for common typos
  else {
    const typoSuggestions = checkEmailTypos(trimmedEmail);
    if (typoSuggestions.length > 0) {
      suggestions.push(...typoSuggestions);
      logger.info(`Email typo suggestions for ${trimmedEmail}: ${typoSuggestions.join(', ')}`);
    }
  }

  res.json({
    isValid,
    reason,
    suggestions,
  });
});

export default router;