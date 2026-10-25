// AgentShield AI — Stripe Test Mode Billing & Cryptographic Webhook Service
import * as crypto from 'crypto';
import { Database, SubscriptionRow } from '../db/database';
import { config } from '../config';

export interface PlanConfig {
  tier: 'PRO' | 'LIFETIME';
  priceId: string;
  amountCents: number;
  currency: string;
  interval: 'month' | 'one_time';
}

export const PLANS: Record<string, PlanConfig> = {
  PRO: {
    tier: 'PRO',
    priceId: config.stripePriceProMonthly,
    amountCents: 3900, // $39.00 USD
    currency: 'usd',
    interval: 'month'
  },
  LIFETIME: {
    tier: 'LIFETIME',
    priceId: config.stripePriceLifetime,
    amountCents: 14900, // $149.00 USD
    currency: 'usd',
    interval: 'one_time'
  }
};

export class BillingService {
  /**
   * Server-side Checkout Session Creation with strict server-enforced pricing.
   * Prevents client-supplied price tampering.
   */
  static createCheckoutSession(userId: string, planTier: 'PRO' | 'LIFETIME'): {
    sessionId: string;
    planTier: string;
    amountCents: number;
    currency: string;
    checkoutUrl: string;
  } {
    const plan = PLANS[planTier];
    if (!plan) {
      throw new Error(`Invalid plan tier requested: ${planTier}. Only PRO and LIFETIME are valid.`);
    }

    const user = Database.findUserById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const sessionId = `cs_test_${crypto.randomBytes(16).toString('hex')}`;
    const checkoutUrl = `https://checkout.stripe.com/test/pay/${sessionId}`;

    return {
      sessionId,
      planTier: plan.tier,
      amountCents: plan.amountCents,
      currency: plan.currency,
      checkoutUrl
    };
  }

  /**
   * Cryptographic Webhook Signature Verification using HMAC-SHA256
   * Conforms to official Stripe Webhook Security Specifications.
   */
  static verifyWebhookSignature(payload: string, signatureHeader: string, secret = config.stripeTestWebhookSecret): boolean {
    if (!signatureHeader || !payload) return false;

    // Header format: t=1612345678,v1=abc123def456...
    const elements = signatureHeader.split(',');
    let timestamp = '';
    let signature = '';

    for (const el of elements) {
      const [key, val] = el.trim().split('=');
      if (key === 't') timestamp = val;
      if (key === 'v1') signature = val;
    }

    if (!timestamp || !signature) return false;

    // Check clock drift (prevent replay attacks > 5 minutes old)
    const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - parseInt(timestamp, 10));
    if (isNaN(ageSeconds) || ageSeconds > 300) {
      return false; // Expired timestamp
    }

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch {
      return false;
    }
  }

  /**
   * Process Verified Webhook Event with strict Idempotency
   */
  static processWebhookEvent(event: { id: string; type: string; data: { object: any } }): {
    status: 'PROCESSED' | 'ALREADY_PROCESSED' | 'IGNORED';
    tierUpgraded?: string;
  } {
    const { id: eventId, type: eventType, data } = event;

    // 1. Idempotency Check: prevent double-processing and duplicate credits
    if (Database.isEventProcessed(eventId)) {
      return { status: 'ALREADY_PROCESSED' };
    }

    if (eventType === 'checkout.session.completed') {
      const session = data.object;
      const userId = session.client_reference_id || session.metadata?.userId;
      const planTier = (session.metadata?.planTier || 'PRO').toUpperCase() as 'PRO' | 'LIFETIME';

      if (userId) {
        // Upgrade user tier in database
        Database.updateUserTier(userId, planTier);

        // Record active subscription
        const subRecord: SubscriptionRow = {
          id: `sub_${crypto.randomBytes(8).toString('hex')}`,
          user_id: userId,
          stripe_customer_id: session.customer || `cus_test_${userId}`,
          stripe_session_id: session.id,
          plan_tier: planTier,
          status: 'active',
          amount_cents: session.amount_total || (planTier === 'PRO' ? 3900 : 14900),
          created_at: new Date().toISOString()
        };
        Database.createSubscription(subRecord);

        // Mark event as processed in atomic idempotency ledger
        Database.markEventProcessed(eventId, eventType);

        return { status: 'PROCESSED', tierUpgraded: planTier };
      }
    }

    // Mark other event types as processed
    Database.markEventProcessed(eventId, eventType);
    return { status: 'IGNORED' };
  }

  /**
   * Helper utility to generate valid test webhook signatures for automated tests
   */
  static generateTestWebhookSignature(payload: string, secret = config.stripeTestWebhookSecret, timestamp = Math.floor(Date.now() / 1000)): string {
    const signedPayload = `${timestamp}.${payload}`;
    const v1Signature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');
    return `t=${timestamp},v1=${v1Signature}`;
  }
}
