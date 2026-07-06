import { Inject, Injectable } from '@nestjs/common';
import { PaymentProviderRegistry } from './payment-provider.registry';
import {
  PAYMENT_PROVIDERS_OPTIONS,
  PaymentProvidersModuleOptions,
  PaymentProviderConfig,
} from '../payment-providers.module';
import { PaymentProvider } from '../interfaces/payment-provider.interface';

@Injectable()
export class PaymentProviderFactory {
  constructor(
    @Inject(PAYMENT_PROVIDERS_OPTIONS)
    private readonly options: PaymentProvidersModuleOptions,
    private readonly registry: PaymentProviderRegistry,
  ) {}

  getDefaultProvider(): string {
    return this.options.defaultProvider;
  }

  getProvider(name?: string): PaymentProvider {
    const providerName = name || this.options.defaultProvider;
    const provider = this.registry.get(providerName);

    if (!provider) {
      throw new Error(`Payment provider "${providerName}" not found`);
    }

    return provider;
  }

  getAllProviders(): string[] {
    return this.options.providers.map((p: PaymentProviderConfig) => p.name);
  }

  getProviderConfig(name: string): PaymentProviderConfig | undefined {
    return this.options.providers.find((p: PaymentProviderConfig) => p.name === name);
  }
}