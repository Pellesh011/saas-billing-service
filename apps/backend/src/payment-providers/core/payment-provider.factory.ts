import { Inject, Injectable } from '@nestjs/common';
import { PaymentProviderRegistry } from './payment-provider.registry';
import { PAYMENT_PROVIDERS_OPTIONS, PaymentProvidersModuleOptions } from '../payment-providers.module';

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

  getProvider(name?: string): any {
    const providerName = name || this.options.defaultProvider;
    const provider = this.registry.get(providerName);
    
    if (!provider) {
      throw new Error(`Payment provider "${providerName}" not found`);
    }
    
    return provider;
  }

  getAllProviders(): string[] {
    return this.options.providers.map((p: any) => p.name);
  }

  getProviderConfig(name: string): any {
    return this.options.providers.find((p: any) => p.name === name);
  }
}