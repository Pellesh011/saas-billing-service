import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PAYMENT_PROVIDER_METADATA_KEY, PaymentProviderMetadata } from '../decorators/payment-provider.decorator';
import { PaymentProvider } from '../interfaces/payment-provider.interface';

@Injectable()
export class PaymentProviderRegistry implements OnModuleInit {
  private providers = new Map<string, PaymentProvider>();
  private metadata = new Map<string, PaymentProviderMetadata>();

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  async onModuleInit(): Promise<void> {
    this.discoverProviders();
  }

  private discoverProviders(): void {
    const providers = this.discovery.getProviders();

    for (const wrapper of providers) {
      const instance = wrapper.instance;
      if (!instance) continue;

      const meta = this.reflector.get<PaymentProviderMetadata>(
        PAYMENT_PROVIDER_METADATA_KEY,
        instance.constructor,
      );

      if (meta && instance.name) {
        this.providers.set(meta.name, instance as PaymentProvider);
        this.metadata.set(meta.name, meta);
      }
    }
  }

  registerProvider(name: string, instance: PaymentProvider, meta: PaymentProviderMetadata) {
    this.providers.set(name, instance);
    this.metadata.set(name, meta);
  }

  get(name: string): PaymentProvider | undefined {
    return this.providers.get(name);
  }

  getMetadata(name: string): PaymentProviderMetadata | undefined {
    return this.metadata.get(name);
  }

  getAll(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }

  getAllMetadata(): PaymentProviderMetadata[] {
    return Array.from(this.metadata.values());
  }

  getNames(): string[] {
    return Array.from(this.providers.keys());
  }

  has(name: string): boolean {
    return this.providers.has(name);
  }
}