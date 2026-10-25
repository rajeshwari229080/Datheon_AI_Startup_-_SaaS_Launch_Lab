// Billing API Routes (/api/billing)
import { Router, Request, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { BillingService } from '../services/billingService';
import { Database } from '../db/database';

export const billingRouter = Router();

// Create Checkout Session (Authenticated)
billingRouter.post('/create-checkout-session', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const { planTier } = req.body;

    if (!planTier || (planTier !== 'PRO' && planTier !== 'LIFETIME')) {
      res.status(400).json({ error: 'Valid planTier (PRO or LIFETIME) is required.' });
      return;
    }

    const session = BillingService.createCheckoutSession(user.id, planTier);
    res.status(200).json(session);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Checkout session failed.' });
  }
});

// Official Stripe Webhook Listener with HMAC-SHA256 Signature Verification
billingRouter.post('/webhook', (req: Request, res: Response): void => {
  const signature = req.headers['stripe-signature'] as string;
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  if (!signature) {
    res.status(400).json({ error: 'Missing Stripe-Signature header.' });
    return;
  }

  const isValid = BillingService.verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    res.status(400).json({ error: 'Invalid webhook signature verification failed.' });
    return;
  }

  try {
    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = BillingService.processWebhookEvent(event);

    if (result.status === 'ALREADY_PROCESSED') {
      res.status(200).json({ message: 'Event already processed (Idempotent response).' });
      return;
    }

    res.status(200).json({ received: true, status: result.status, tier: result.tierUpgraded });
  } catch (err: any) {
    res.status(500).json({ error: 'Webhook processing error.' });
  }
});

// Test Mode Webhook Simulator for Dashboard Testing
billingRouter.post('/test-webhook-simulate', (req: Request, res: Response): void => {
  const { sessionId } = req.body;
  if (!sessionId) {
    res.status(400).json({ error: 'sessionId required.' });
    return;
  }

  // Simulate Stripe checkout.session.completed event
  const mockEvent = {
    id: `evt_sim_${Date.now()}`,
    type: 'checkout.session.completed',
    data: {
      object: {
        id: sessionId,
        client_reference_id: Object.values((Database as any).store.users)[0] ? Object.keys((Database as any).store.users)[0] : 'usr_test',
        amount_total: 3900,
        metadata: {
          planTier: 'PRO'
        }
      }
    }
  };

  const result = BillingService.processWebhookEvent(mockEvent);
  res.status(200).json({
    success: true,
    newTier: result.tierUpgraded || 'PRO',
    status: result.status
  });
});
