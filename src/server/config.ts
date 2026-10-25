// AgentShield AI Environment & Configuration
import * as path from 'path';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  appSecret: string;
  stripeTestSecretKey: string;
  stripeTestWebhookSecret: string;
  stripePriceProMonthly: string;
  stripePriceLifetime: string;
  databasePath: string;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appSecret: process.env.APP_SECRET || 'agentshield_secure_dev_secret_key_2026',
  stripeTestSecretKey: process.env.STRIPE_TEST_SECRET_KEY || 'sk_test_mock_secret_agentshield_001',
  stripeTestWebhookSecret: process.env.STRIPE_TEST_WEBHOOK_SECRET || 'whsec_test_mock_webhook_secret_agentshield_001',
  stripePriceProMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_test_pro_39_monthly',
  stripePriceLifetime: process.env.STRIPE_PRICE_LIFETIME || 'price_test_lifetime_149_founder',
  databasePath: process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'agentshield.db')
};
