import express from 'express';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import pb from '../utils/pocketbaseClient.js';
import { validateEmail } from '../utils/emailValidator.js';
import logger from '../utils/logger.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /subscribers/validate
router.post('/validate', async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const validation = validateEmail(email);
  res.json(validation);
});

// POST /subscribers/import
router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'CSV file is required' });
  }

  try {
    // Parse CSV file
    const csvContent = req.file.buffer.toString('utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const invalidEmails = [];
    let validCount = 0;

    // Validate all emails first
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const email = record.email?.trim();

      if (!email) {
        invalidEmails.push({ row: i + 2, email: '', reason: 'Email is required' });
        continue;
      }

      // Validate email using internal validator
      const validation = validateEmail(email);

      if (!validation.isValid) {
        invalidEmails.push({ row: i + 2, email, reason: validation.reason });
      } else {
        validCount++;
      }
    }

    // If any emails are invalid, reject entire batch
    if (invalidEmails.length > 0) {
      logger.warn(`Import rejected: ${invalidEmails.length} invalid emails found`);
      return res.json({
        success: false,
        invalidCount: invalidEmails.length,
        invalidEmails: invalidEmails.slice(0, 100), // Return first 100 errors
      });
    }

    // All emails are valid
    logger.info(`Import validation passed: ${validCount} valid emails`);
    res.json({
      success: true,
      validCount,
    });
  } catch (error) {
    logger.error('Import validation failed:', error);
    throw new Error(`Import validation failed: ${error.message}`);
  }
});

// POST /subscribers/bulk-import
router.post('/bulk-import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'CSV file is required' });
  }

  const { businessId } = req.body;

  if (!businessId || typeof businessId !== 'string') {
    return res.status(400).json({ error: 'Business ID is required' });
  }

  try {
    // Parse CSV file
    const csvContent = req.file.buffer.toString('utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    let imported = 0;
    let failed = 0;
    const errors = [];

    // Process each record
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const email = record.email?.trim();

      if (!email) {
        failed++;
        errors.push({ row: i + 2, error: 'Email is required' });
        continue;
      }

      // Validate email
      const validation = validateEmail(email);

      if (!validation.isValid) {
        failed++;
        errors.push({ row: i + 2, email, error: validation.reason });
        continue;
      }

      try {
        // Create subscriber record in PocketBase
        await pb.collection('subscribers').create({
          email,
          businessId,
          status: 'active',
          createdAt: new Date().toISOString(),
        });
        imported++;
      } catch (error) {
        failed++;
        errors.push({ row: i + 2, email, error: error.message });
      }
    }

    logger.info(`Bulk import completed: ${imported} imported, ${failed} failed`);

    res.json({
      imported,
      failed,
      errors: errors.slice(0, 100), // Return first 100 errors
    });
  } catch (error) {
    logger.error('Bulk import failed:', error);
    throw new Error(`Bulk import failed: ${error.message}`);
  }
});

export default router;