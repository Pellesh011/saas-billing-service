import { Module, DynamicModule, Global } from '@nestjs/common';

export interface PaymentProviderConfig {
  name: string;
  displayName: string;
  providerClass: new (...args: unknown[]) => unknown;
  config: Record<string, unknown>;
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
      ],
      exports: [
        PAYMENT_PROVIDERS_OPTIONS,
        ...providerTokens,
      ],
    };
  }
}