import { Router } from 'express';
import healthCheck from './health-check.js';
import authRouter from './auth.js';
import domainsRouter from './domains.js';
import subscribersRouter from './subscribers.js';
import campaignsRouter from './campaigns.js';
import webhooksRouter from './webhooks.js';
import validationRouter from './validation.js';
import contactRouter from './contact.js';

const router = Router();

export default () => {
  router.get('/health', healthCheck);
  router.use('/auth', authRouter);
  router.use('/domains', domainsRouter);
  router.use('/subscribers', subscribersRouter);
  router.use('/campaigns', campaignsRouter);
  router.use('/webhooks', webhooksRouter);
  router.use('/validation', validationRouter);
  router.use('/contact', contactRouter);

  return router;
};