import { z } from 'zod';

export interface ProviderMetadata {
  name: string;
  displayName: string;
  version: string;
  description?: string;
  configSchema: z.ZodSchema<any>;
  supportedFeatures: ProviderFeature[];
  webhookEvents: string[];
}

export enum ProviderFeature {
  CUSTOMERS = 'customers',
  SUBSCRIPTIONS = 'subscriptions',
  CHECKOUT_SESSIONS = 'checkout_sessions',
  BILLING_PORTAL = 'billing_portal',
  REFUNDS = 'refunds',
  PAYMENT_METHODS = 'payment_methods',
  WEBHOOKS = 'webhooks',
  USAGE_BASED = 'usage_based',
  TRIALS = 'trials',
  PRORATION = 'proration',
}

export interface ProviderConfig {
  [key: string]: any;
}

export interface ValidatedProviderConfig {
  provider: string;
  config: Record<string, any>;
  isValid: boolean;
  errors?: z.ZodIssue[];
}