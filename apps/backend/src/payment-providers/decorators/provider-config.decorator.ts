export const PROVIDER_CONFIG_TOKEN = 'PROVIDER_CONFIG';
export const PAYMENT_PROVIDERS_CONFIG = 'PAYMENT_PROVIDERS_CONFIG';

export interface PaymentProvidersConfig {
  defaultProvider: string;
  providers: ProviderRegistration[];
}

export interface ProviderRegistration {
  name: string;
  providerClass: new (...args: any[]) => any;
  config: Record<string, any>;
  isActive: boolean;
  priority: number;
}