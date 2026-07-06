export const PROVIDER_CONFIG_TOKEN = 'PROVIDER_CONFIG';
export const PAYMENT_PROVIDERS_CONFIG = 'PAYMENT_PROVIDERS_CONFIG';

export interface PaymentProvidersConfig {
  defaultProvider: string;
  providers: ProviderRegistration[];
}

export interface ProviderRegistration {
  name: string;
  providerClass: new (...args: unknown[]) => unknown;
  config: Record<string, unknown>;
  isActive: boolean;
  priority: number;
}