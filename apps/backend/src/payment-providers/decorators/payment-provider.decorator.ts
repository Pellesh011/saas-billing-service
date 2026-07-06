export const PAYMENT_PROVIDER_METADATA_KEY = 'payment:provider:metadata';

export interface PaymentProviderMetadata {
  name: string;
  displayName: string;
  version: string;
  description?: string;
  supportedFeatures: string[];
  webhookEvents: string[];
  configSchema: unknown;
}

export const PaymentProvider = (metadata: PaymentProviderMetadata): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(PAYMENT_PROVIDER_METADATA_KEY, metadata, target);
  };
};

export const getPaymentProviderMetadata = (target: object): PaymentProviderMetadata | undefined => {
  return Reflect.getMetadata(PAYMENT_PROVIDER_METADATA_KEY, target);
};