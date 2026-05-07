import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /campaigns
router.post('/', async (req, res) => {
  const { name, subject, htmlContent, senderId, scheduledAt, recipientListId, businessId } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Campaign name is required' });
  }

  if (!subject || typeof subject !== 'string') {
    return res.status(400).json({ error: 'Campaign subject is required' });
  }

  if (!htmlContent || typeof htmlContent !== 'string') {
    return res.status(400).json({ error: 'Campaign HTML content is required' });
  }

  if (!senderId || typeof senderId !== 'string') {
    return res.status(400).json({ error: 'Sender ID is required' });
  }

  if (!businessId || typeof businessId !== 'string') {
    return res.status(400).json({ error: 'Business ID is required' });
  }

  try {
    // Verify sender domain is verified
    const senderDomain = await pb.collection('senderDomains').getOne(senderId);

    if (!senderDomain) {
      throw new Error('Sender domain not found');
    }

    if (!senderDomain.verified) {
      throw new Error('Sender domain is not verified');
    }

    if (senderDomain.businessId !== businessId) {
      throw new Error('Unauthorized: Sender domain does not belong to this business');
    }

    // Create campaign record
    const campaign = await pb.collection('campaigns').create({
      name,
      subject,
      htmlContent,
      senderId,
      businessId,
      recipientListId: recipientListId || null,
      scheduledAt: scheduledAt || null,
      status: 'draft',
      createdAt: new Date().toISOString(),
    });

    logger.info(`Campaign created: ${campaign.id} for business ${businessId}`);

    res.json({
      success: true,
      campaignId: campaign.id,
    });
  } catch (error) {
    logger.error('Failed to create campaign:', error);
    throw new Error(`Failed to create campaign: ${error.message}`);
  }
});

// POST /campaigns/send
router.post('/send', async (req, res) => {
  const { campaignId, businessId } = req.body;

  if (!campaignId || typeof campaignId !== 'string') {
    return res.status(400).json({ error: 'Campaign ID is required' });
  }

  if (!businessId || typeof businessId !== 'string') {
    return res.status(400).json({ error: 'Business ID is required' });
  }

  try {
    // Fetch campaign from PocketBase
    const campaign = await pb.collection('campaigns').getOne(campaignId);

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.businessId !== businessId) {
      throw new Error('Unauthorized: Campaign does not belong to this business');
    }

    // Fetch verified sender domain
    const domain = await pb.collection('senderDomains').getFirstListItem(
      `businessId = "${businessId}" && verified = true`
    );

    if (!domain) {
      throw new Error('No verified sender domain found');
    }

    // Fetch all active subscribers
    const subscribers = await pb.collection('subscribers').getFullList({
      filter: `businessId = "${businessId}" && status = "active"`,
    });

    let sent = 0;
    let failed = 0;

    // Send emails via Plunk API
    for (const subscriber of subscribers) {
      try {
        const response = await fetch('https://api.plunk.io/v1/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PLUNK_API_KEY}`,
          },
          body: JSON.stringify({
            to: subscriber.email,
            subject: campaign.subject,
            body: campaign.htmlContent,
            from: `noreply@${domain.domain}`,
            campaignId: campaignId,
            subscriberId: subscriber.id,
          }),
        });

        if (!response.ok) {
          failed++;
          logger.warn(`Failed to send email to ${subscriber.email}: ${response.statusText}`);
        } else {
          sent++;
        }
      } catch (error) {
        failed++;
        logger.error(`Error sending email to ${subscriber.email}:`, error);
      }
    }

    // Update campaign status to 'sent'
    await pb.collection('campaigns').update(campaignId, {
      status: 'sent',
      sentAt: new Date().toISOString(),
    });

    // Create campaign analytics record
    await pb.collection('campaignAnalytics').create({
      campaignId,
      businessId,
      sent,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
    });

    logger.info(`Campaign ${campaignId} sent: ${sent} emails sent, ${failed} failed`);

    res.json({ sent, failed });
  } catch (error) {
    logger.error('Failed to send campaign:', error);
    throw new Error(`Failed to send campaign: ${error.message}`);
  }
});

// GET /campaigns/:campaignId/analytics
router.get('/:campaignId/analytics', async (req, res) => {
  const { campaignId } = req.params;

  if (!campaignId || typeof campaignId !== 'string') {
    return res.status(400).json({ error: 'Campaign ID is required' });
  }

  try {
    // Fetch analytics from PocketBase
    const analytics = await pb.collection('campaignAnalytics').getFirstListItem(
      `campaignId = "${campaignId}"`
    );

    if (!analytics) {
      return res.json({
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        openRate: 0,
        clickRate: 0,
      });
    }

    const openRate = analytics.sent > 0 ? (analytics.opened / analytics.sent) * 100 : 0;
    const clickRate = analytics.sent > 0 ? (analytics.clicked / analytics.sent) * 100 : 0;

    res.json({
      sent: analytics.sent,
      delivered: analytics.delivered,
      opened: analytics.opened,
      clicked: analytics.clicked,
      bounced: analytics.bounced,
      unsubscribed: analytics.unsubscribed,
      openRate: parseFloat(openRate.toFixed(2)),
      clickRate: parseFloat(clickRate.toFixed(2)),
    });
  } catch (error) {
    logger.error('Failed to fetch campaign analytics:', error);
    throw new Error(`Failed to fetch campaign analytics: ${error.message}`);
  }
});

export default router;