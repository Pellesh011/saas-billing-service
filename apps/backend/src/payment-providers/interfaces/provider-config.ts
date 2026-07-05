import { z } from 'zod';

export const StripeConfigSchema = z.object({
  secretKey: z.string().min(1, 'Secret key is required'),
  publishableKey: z.string().min(1, 'Publishable key is required'),
  webhookSecret: z.string().min(1, 'Webhook secret is required'),
  apiVersion: z.string().optional().default('2023-10-16'),
  connectAccountId: z.string().optional(),
});

export const PaddleConfigSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  apiKey: z.string().min(1, 'API key is required'),
  webhookSecret: z.string().min(1, 'Webhook secret is required'),
  environment: z.enum(['sandbox', 'production']).default('sandbox'),
});

export const LemonSqueezyConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  webhookSecret: z.string().min(1, 'Webhook secret is required'),
  storeId: z.string().min(1, 'Store ID is required'),
  environment: z.enum(['sandbox', 'production']).default('sandbox'),
});

export type StripeConfig = z.infer<typeof StripeConfigSchema>;
export type PaddleConfig = z.infer<typeof PaddleConfigSchema>;
export type LemonSqueezyConfig = z.infer<typeof LemonSqueezyConfigSchema>;

export const ProviderConfigSchemas = {
  stripe: StripeConfigSchema,
  paddle: PaddleConfigSchema,
  lemonsqueezy: LemonSqueezyConfigSchema,
} as const;

export type ProviderName = keyof typeof ProviderConfigSchemas;
export type ProviderConfigMap = {
  [K in ProviderName]: z.infer<typeof ProviderConfigSchemas[K]>;
};