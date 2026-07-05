import { Module, DynamicModule, Global } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { PaymentProviderRegistry } from './core/payment-provider.registry';
import { PaymentProviderFactory } from './core/payment-provider.factory';

export interface PaymentProviderConfig {
  name: string;
  displayName: string;
  providerClass: any;
  config: Record<string, any>;
}

export interface PaymentProvidersModuleOptions {
  defaultProvider: string;
  providers: PaymentProviderConfig[];
}

export const PAYMENT_PROVIDERS_OPTIONS = 'PAYMENT_PROVIDERS_OPTIONS';

@Global()
@Module({})
export class PaymentProvidersModule {
  static forRoot(options: PaymentProvidersModuleOptions): DynamicModule {
    const providerTokens = options.providers.map(p => `PAYMENT_PROVIDER_${p.name.toUpperCase()}`);
    
    const providers = [
      {
        provide: PAYMENT_PROVIDERS_OPTIONS,
        useValue: options,
      },
      ...options.providers.map(p => ({
        provide: `PAYMENT_PROVIDER_${p.name.toUpperCase()}`,
        useClass: p.providerClass,
      })),
    ];

    return {
      module: PaymentProvidersModule,
      global: true,
      providers: [
        ...providers,
        PaymentProviderRegistry,
        PaymentProviderFactory,
      ],
      exports: [
        PaymentProviderRegistry,
        PaymentProviderFactory,
        PAYMENT_PROVIDERS_OPTIONS,
        ...providerTokens,
      ],
    };
  }
}