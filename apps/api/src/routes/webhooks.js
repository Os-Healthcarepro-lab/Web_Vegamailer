import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /webhooks/plunk
router.post('/plunk', async (req, res) => {
  const { eventType, subscriberId, campaignId, timestamp } = req.body;

  if (!eventType || !subscriberId || !campaignId) {
    return res.status(400).json({ error: 'Missing required fields: eventType, subscriberId, campaignId' });
  }

  try {
    // Create webhook event record
    await pb.collection('webhookEvents').create({
      eventType,
      subscriberId,
      campaignId,
      timestamp: timestamp || new Date().toISOString(),
      payload: req.body,
    });

    // Fetch current analytics
    const analytics = await pb.collection('campaignAnalytics').getFirstListItem(
      `campaignId = "${campaignId}"`
    );

    if (!analytics) {
      logger.warn(`Analytics record not found for campaign ${campaignId}`);
      return res.json({ success: true });
    }

    // Update analytics based on event type
    const updates = {};

    switch (eventType) {
      case 'delivered':
        updates.delivered = (analytics.delivered || 0) + 1;
        break;
      case 'opened':
        updates.opened = (analytics.opened || 0) + 1;
        break;
      case 'clicked':
        updates.clicked = (analytics.clicked || 0) + 1;
        break;
      case 'bounced':
        updates.bounced = (analytics.bounced || 0) + 1;
        break;
      case 'unsubscribed':
        updates.unsubscribed = (analytics.unsubscribed || 0) + 1;
        break;
      default:
        logger.warn(`Unknown event type: ${eventType}`);
    }

    if (Object.keys(updates).length > 0) {
      await pb.collection('campaignAnalytics').update(analytics.id, updates);
    }

    logger.info(`Webhook event processed: ${eventType} for campaign ${campaignId}`);

    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to process webhook:', error);
    throw new Error(`Failed to process webhook: ${error.message}`);
  }
});

export default router;