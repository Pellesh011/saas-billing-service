import { DiscoveryService } from '@nestjs/core';

export const PAYMENT_PROVIDER_METADATA_KEY = 'payment:provider:metadata';

export interface PaymentProviderMetadata {
  name: string;
  displayName: string;
  version: string;
  description?: string;
  supportedFeatures: string[];
  webhookEvents: string[];
  configSchema: any;
}

export const PaymentProvider = (metadata: PaymentProviderMetadata): ClassDecorator => {
  return (target: any) => {
    DiscoveryService.createDecorator<PaymentProviderMetadata>()(target);
    Reflect.defineMetadata(PAYMENT_PROVIDER_METADATA_KEY, metadata, target);
  };
};

export const getPaymentProviderMetadata = (target: any): PaymentProviderMetadata | undefined => {
  return Reflect.getMetadata(PAYMENT_PROVIDER_METADATA_KEY, target);
};