import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /domains
router.post('/', async (req, res) => {
  const { domain, businessId } = req.body;

  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ error: 'Domain is required' });
  }

  if (!businessId || typeof businessId !== 'string') {
    return res.status(400).json({ error: 'Business ID is required' });
  }

  // Create domain record in PocketBase
  const createdDomain = await pb.collection('senderDomains').create({
    domain,
    businessId,
    status: 'pending',
    verified: false,
    createdAt: new Date().toISOString(),
  });

  logger.info(`Domain created: ${domain} for business ${businessId}`);

  res.json(createdDomain);
});

// POST /domains/verify
router.post('/verify', async (req, res) => {
  const { domain, businessId } = req.body;

  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ error: 'Domain is required' });
  }

  if (!businessId || typeof businessId !== 'string') {
    return res.status(400).json({ error: 'Business ID is required' });
  }

  // Call Plunk API to verify domain
  const response = await fetch('https://api.plunk.io/v1/domains/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PLUNK_API_KEY}`,
    },
    body: JSON.stringify({ domain }),
  });

  if (!response.ok) {
    throw new Error(`Plunk API error: ${response.status} ${response.statusText}`);
  }

  const verificationResult = await response.json();

  // Check if domain is verified
  const verified = verificationResult.verified === true;

  // Fetch the domain record from PocketBase
  let domainRecord;
  try {
    domainRecord = await pb.collection('senderDomains').getFirstListItem(
      `domain = "${domain}" && businessId = "${businessId}"`
    );
  } catch (error) {
    throw new Error(`Domain record not found in database: ${error.message}`);
  }

  // Update domain status in PocketBase
  await pb.collection('senderDomains').update(domainRecord.id, {
    verified,
    status: verified ? 'verified' : 'pending',
    verifiedAt: verified ? new Date().toISOString() : null,
  });

  logger.info(`Domain verification result for ${domain}: ${verified ? 'verified' : 'pending'}`);

  res.json({
    verified,
    records: {
      spf: verificationResult.spf || null,
      dkim: verificationResult.dkim || null,
      cname: verificationResult.cname || null,
    },
    message: verified ? 'Domain verified successfully' : 'Domain verification pending. Please add DNS records.',
  });
});

// GET /domains/:businessId
router.get('/:businessId', async (req, res) => {
  const { businessId } = req.params;

  if (!businessId || typeof businessId !== 'string') {
    return res.status(400).json({ error: 'Business ID is required' });
  }

  // Fetch all domains for the business
  const domains = await pb.collection('senderDomains').getList(1, 50, {
    filter: `businessId = "${businessId}"`,
  });

  logger.info(`Fetched ${domains.items.length} domains for business ${businessId}`);

  res.json(domains.items);
});

// DELETE /domains/:domainId
router.delete('/:domainId', async (req, res) => {
  const { domainId } = req.params;

  if (!domainId || typeof domainId !== 'string') {
    return res.status(400).json({ error: 'Domain ID is required' });
  }

  // Delete domain from PocketBase
  await pb.collection('senderDomains').delete(domainId);

  logger.info(`Domain deleted: ${domainId}`);

  res.json({ success: true });
});

export default router;