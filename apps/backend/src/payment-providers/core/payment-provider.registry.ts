import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PaymentProviderMetadata } from '../decorators/payment-provider.decorator';
import { PAYMENT_PROVIDER_METADATA_KEY } from '../decorators/payment-provider.decorator';

@Injectable()
export class PaymentProviderRegistry implements OnModuleInit {
  private providers = new Map<string, any>();
  private metadata = new Map<string, PaymentProviderMetadata>();

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  async onModuleInit() {
    this.discoverProviders();
  }

  private discoverProviders() {
    const providers = this.discovery.getProviders();

    for (const wrapper of providers) {
      const instance = wrapper.instance;
      if (!instance) continue;

      const metadata = this.reflector.get<PaymentProviderMetadata>(
        PAYMENT_PROVIDER_METADATA_KEY,
        instance.constructor,
      );

      if (metadata && instance.name) {
        this.providers.set(metadata.name, instance);
        this.metadata.set(metadata.name, metadata);
      }
    }
  }

  registerProvider(name: string, instance: any, metadata: PaymentProviderMetadata) {
    this.providers.set(name, instance);
    this.metadata.set(name, metadata);
  }

  get(name: string): any {
    return this.providers.get(name);
  }

  getMetadata(name: string): PaymentProviderMetadata | undefined {
    return this.metadata.get(name);
  }

  getAll(): any[] {
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