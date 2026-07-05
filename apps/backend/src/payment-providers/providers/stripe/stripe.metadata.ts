import { PaymentProviderMetadata } from '../../decorators/payment-provider.decorator';
import { ProviderFeature } from '../../interfaces/provider-metadata';

export const STRIPE_PROVIDER_METADATA: PaymentProviderMetadata = {
  name: 'stripe',
  displayName: 'Stripe',
  version: '1.0.0',
  description: 'Stripe payment provider for subscriptions, payments, and billing',
  supportedFeatures: [
    ProviderFeature.CUSTOMERS,
    ProviderFeature.SUBSCRIPTIONS,
    ProviderFeature.CHECKOUT_SESSIONS,
    ProviderFeature.BILLING_PORTAL,
    ProviderFeature.REFUNDS,
    ProviderFeature.PAYMENT_METHODS,
    ProviderFeature.WEBHOOKS,
    ProviderFeature.USAGE_BASED,
    ProviderFeature.TRIALS,
    ProviderFeature.PRORATION,
  ],
  webhookEvents: [
    'customer.created',
    'customer.updated',
    'customer.deleted',
    'subscription.created',
    'subscription.updated',
    'subscription.deleted',
    'invoice.created',
    'invoice.updated',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'charge.refunded',
  ],
  configSchema: {
    secretKey: { type: 'string', required: true, sensitive: true },
    publishableKey: { type: 'string', required: true },
    webhookSecret: { type: 'string', required: true, sensitive: true },
    apiVersion: { type: 'string', required: false, default: '2023-10-16' },
    connectAccountId: { type: 'string', required: false },
  },
};