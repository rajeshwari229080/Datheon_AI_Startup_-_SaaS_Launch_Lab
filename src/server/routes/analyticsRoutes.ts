// Analytics API Routes (/api/analytics)
import { Router, Request, Response } from 'express';
import { AnalyticsCollector } from '../utils/analyticsCollector';

export const analyticsRouter = Router();

analyticsRouter.post('/event', (req: Request, res: Response): void => {
  const { event, timestamp, url, properties } = req.body;
  const ipAnonymized = (req.socket.remoteAddress || '127.0.0.1').replace(/\.\d+$/, '.0');

  AnalyticsCollector.record({
    event,
    timestamp,
    url,
    properties,
    ipAnonymized
  });

  res.status(202).json({ status: 'queued' });
});

analyticsRouter.get('/summary', (_req: Request, res: Response): void => {
  res.status(200).json({
    metrics: AnalyticsCollector.getMetricsSummary(),
    totalRecorded: AnalyticsCollector.getAll().length
  });
});
