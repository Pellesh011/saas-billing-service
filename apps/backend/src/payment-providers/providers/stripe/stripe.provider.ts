import Stripe from 'stripe';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PaymentProvider,
  PaymentProviderMetadata,
  CreateCustomerInput,
  CustomerResult,
  CreateSubscriptionInput,
  SubscriptionResult,
  SubscriptionStatus,
  CancelSubscriptionOptions,
  CheckoutInput,
  CheckoutResult,
  BillingPortalInput,
  BillingPortalResult,
  RefundInput,
  RefundResult,
  RefundStatus,
  CreatePaymentMethodInput,
  PaymentMethodResult,
  UsageRecordInput,
  UsageRecordResult,
  WebhookEvent,
  ProviderFeature,
  ProviderMetadata,
} from '../interfaces';
import { PaymentProvider as PaymentProviderDecorator } from '../decorators/payment-provider.decorator';
import { StripeConfigSchema } from '../interfaces/provider-config';

const stripeMetadata: PaymentProviderMetadata = {
  name: 'stripe',
  displayName: 'Stripe',
  version: '1.0.0',
  description: 'Stripe payment provider for subscriptions and payments',
  supportedFeatures: [
    ProviderFeature.CUSTOMERS,
    ProviderFeature.SUBSCRIPTIONS,
    ProviderFeature.CHECKOUT_SESSIONS,
    ProviderFeature.BILLING_PORTAL,
    ProviderFeature.REFUNDS,
    ProviderFeature.PAYMENT_METHODS,
    ProviderFeature.WEBHOOKS,
    ProviderFeature.USAGE_BASED,
    ProviderFeature.TRIALS,
    ProviderFeature.PRORATION,
  ],
  webhookEvents: [
    'customer.created',
    'customer.updated',
    'customer.deleted',
    'subscription.created',
    'subscription.updated',
    'subscription.deleted',
    'invoice.created',
    'invoice.finalized',
    'invoice.paid',
    'invoice.payment_failed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'checkout.session.completed',
    'billing_portal.session.created',
  ],
  configSchema: StripeConfigSchema,
};

@PaymentProviderDecorator(stripeMetadata)
@Injectable()
export class StripeProvider implements PaymentProvider, OnModuleInit {
  readonly metadata = stripeMetadata;
  private stripe: Stripe;
  private config: Stripe.StripeConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      apiKey: this.configService.get<string>('stripe.secretKey') || '',
      apiVersion: '2023-10-16',
    };
    this.stripe = new Stripe(this.config.apiKey, {
      apiVersion: this.config.apiVersion,
    });
  }

  async onModuleInit(): Promise<void> {
    // Initialize Stripe client
  }

  async initialize(config: Record<string, any>): Promise<void> {
    const validated = StripeConfigSchema.parse(config);
    this.config.apiKey = validated.secretKey;
    this.stripe = new Stripe(validated.secretKey, {
      apiVersion: validated.apiVersion || '2023-10-16',
    });
  }

  // Customer operations
  async createCustomer(data: CreateCustomerInput): Promise<CustomerResult> {
    const customer = await this.stripe.customers.create({
      email: data.email,
      name: data.name,
      phone: data.phone,
      address: data.address,
      metadata: data.metadata,
    });

    return {
      id: customer.id,
      email: customer.email || '',
      name: customer.name || undefined,
      metadata: customer.metadata as Record<string, any>,
      provider: 'stripe',
      providerId: customer.id,
      createdAt: new Date(customer.created * 1000),
    };
  }

  async getCustomer(providerCustomerId: string): Promise<CustomerResult | null> {
    try {
      const customer = await this.stripe.customers.retrieve(providerCustomerId);
      if (customer.deleted) return null;
      
      return {
        id: customer.id,
        email: customer.email || '',
        name: customer.name || undefined,
        metadata: customer.metadata as Record<string, any>,
        provider: 'stripe',
        providerId: customer.id,
        createdAt: new Date(customer.created * 1000),
      };
    } catch (error) {
      if (error.code === 'resource_missing') return null;
      throw error;
    }
  }

  async updateCustomer(providerCustomerId: string, data: Partial<CreateCustomerInput>): Promise<CustomerResult> {
    const customer = await this.stripe.customers.update(providerCustomerId, {
      email: data.email,
      name: data.name,
      phone: data.phone,
      address: data.address,
      metadata: data.metadata,
    });

    return {
      id: customer.id,
      email: customer.email || '',
      name: customer.name || undefined,
      metadata: customer.metadata as Record<string, any>,
      provider: 'stripe',
      providerId: customer.id,
      createdAt: new Date(customer.created * 1000),
    };
  }

  async deleteCustomer(providerCustomerId: string): Promise<void> {
    await this.stripe.customers.del(providerCustomerId);
  }

  // Subscription operations
  async createSubscription(data: CreateSubscriptionInput): Promise<SubscriptionResult> {
    const subscription = await this.stripe.subscriptions.create({
      customer: data.customerId,
      items: [{ price: data.priceId, quantity: data.quantity || 1 }],
      trial_period_days: data.trialDays,
      metadata: data.metadata,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    return this.mapSubscription(subscription);
  }

  async getSubscription(providerSubscriptionId: string): Promise<SubscriptionResult | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(providerSubscriptionId);
      return this.mapSubscription(subscription);
    } catch (error) {
      if (error.code === 'resource_missing') return null;
      throw error;
    }
  }

  async updateSubscription(providerSubscriptionId: string, data: Partial<CreateSubscriptionInput>): Promise<SubscriptionResult> {
    const subscription = await this.stripe.subscriptions.update(providerSubscriptionId, {
      items: data.priceId ? [{ price: data.priceId, quantity: data.quantity || 1 }] : undefined,
      trial_end: data.trialDays ? Math.floor(Date.now() / 1000) + data.trialDays * 86400 : undefined,
      metadata: data.metadata,
      proration_behavior: data.prorationBehavior,
    });

    return this.mapSubscription(subscription);
  }

  async cancelSubscription(providerSubscriptionId: string, options?: CancelSubscriptionOptions): Promise<SubscriptionResult> {
    const subscription = await this.stripe.subscriptions.cancel(providerSubscriptionId, {
      prorate: options?.prorate,
      invoice_now: options?.invoiceNow,
    });

    return this.mapSubscription(subscription);
  }

  async pauseSubscription(providerSubscriptionId: string): Promise<SubscriptionResult> {
    const subscription = await this.stripe.subscriptions.update(providerSubscriptionId, {
      pause_collection: { behavior: 'void' },
    });

    return this.mapSubscription(subscription);
  }

  async resumeSubscription(providerSubscriptionId: string): Promise<SubscriptionResult> {
    const subscription = await this.stripe.subscriptions.update(providerSubscriptionId, {
      pause_collection: '',
    });

    return this.mapSubscription(subscription);
  }

  // Checkout & Billing Portal
  async createCheckoutSession(data: CheckoutInput): Promise<CheckoutResult> {
    const session = await this.stripe.checkout.sessions.create({
      customer: data.customerId,
      mode: data.mode,
      line_items: data.mode === 'subscription' ? [{
        price: data.priceId,
        quantity: data.quantity || 1,
      }] : [{
        price: data.priceId,
        quantity: data.quantity || 1,
      }],
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      trial_period_days: data.trialDays,
      metadata: data.metadata,
      allow_promotion_codes: data.allowPromotionCodes,
      billing_address_collection: data.billingAddressCollection,
      customer_update: data.customerUpdate,
      subscription_data: data.mode === 'subscription' ? {
        trial_period_days: data.trialDays,
        metadata: data.metadata,
      } : undefined,
    });

    return {
      id: session.id,
      url: session.url || '',
      expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : undefined,
      provider: 'stripe',
      providerId: session.id,
    };
  }

  async createBillingPortalSession(data: BillingPortalInput): Promise<BillingPortalResult> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: data.customerId,
      return_url: data.returnUrl,
      configuration: data.configurationId,
    });

    return {
      url: session.url,
      provider: 'stripe',
    };
  }

  // Refunds
  async createRefund(data: RefundInput): Promise<RefundResult> {
    const refund = await this.stripe.refunds.create({
      payment_intent: data.paymentId,
      amount: data.amount,
      reason: data.reason,
      metadata: data.metadata,
    });

    return {
      id: refund.id,
      paymentId: refund.payment_intent as string,
      amount: refund.amount,
      status: this.mapRefundStatus(refund.status),
      reason: refund.reason || undefined,
      provider: 'stripe',
      providerId: refund.id,
      createdAt: new Date(refund.created * 1000),
    };
  }

  // Payment Methods
  async attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentMethodResult> {
    const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    return this.mapPaymentMethod(paymentMethod);
  }

  async detachPaymentMethod(paymentMethodId: string): Promise<void> {
    await this.stripe.paymentMethods.detach(paymentMethodId);
  }

  async listPaymentMethods(customerId: string): Promise<PaymentMethodResult[]> {
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data.map(pm => this.mapPaymentMethod(pm));
  }

  // Usage-based billing
  async recordUsage(data: UsageRecordInput): Promise<UsageRecordResult> {
    const usageRecord = await this.stripe.subscriptionItems.createUsageRecord(
      data.subscriptionId, // This should be the subscription item ID
      {
        quantity: data.quantity,
        timestamp: Math.floor((data.timestamp || new Date()).getTime() / 1000),
        action: data.action || 'increment',
      }
    );

    return {
      id: usageRecord.id,
      subscriptionId: data.subscriptionId,
      metric: data.metric,
      quantity: usageRecord.quantity,
      periodStart: new Date(usageRecord.period.start * 1000),
      periodEnd: new Date(usageRecord.period.end * 1000),
      provider: 'stripe',
      providerId: usageRecord.id,
    };
  }

  async getUsageRecords(subscriptionId: string, metric: string, periodStart: Date, periodEnd: Date): Promise<UsageRecordResult[]> {
    // Stripe doesn't have a direct API for this, would need to use reporting
    return [];
  }

  // Webhooks
  constructEvent(payload: any, signature: string, secret: string): WebhookEvent {
    const event = this.stripe.webhooks.constructEvent(payload, signature, secret);
    return {
      id: event.id,
      type: event.type,
      data: event.data.object,
      createdAt: new Date(event.created * 1000),
      provider: 'stripe',
    };
  }

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
      this.stripe.webhooks.constructEvent(payload, signature, secret);
      return true;
    } catch {
      return false;
    }
  }

  // Utilities
  getSupportedFeatures(): ProviderFeature[] {
    return this.metadata.supportedFeatures;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.stripe.customers.list({ limit: 1 });
      return true;
    } catch {
      return false;
    }
  }

  // Mappers
  private mapSubscription(subscription: Stripe.Subscription): SubscriptionResult {
    return {
      id: subscription.id,
      customerId: subscription.customer as string,
      status: this.mapSubscriptionStatus(subscription.status),
      priceId: subscription.items.data[0]?.price.id || '',
      quantity: subscription.items.data[0]?.quantity || 1,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : undefined,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : undefined,
      metadata: subscription.metadata as Record<string, any>,
      provider: 'stripe',
      providerId: subscription.id,
    };
  }

  private mapSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
    const statusMap: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
      trialing: SubscriptionStatus.TRIALING,
      active: SubscriptionStatus.ACTIVE,
      past_due: SubscriptionStatus.PAST_DUE,
      canceled: SubscriptionStatus.CANCELED,
      paused: SubscriptionStatus.PAUSED,
      incomplete: SubscriptionStatus.INCOMPLETE,
      incomplete_expired: SubscriptionStatus.INCOMPLETE_EXPIRED,
      unpaid: SubscriptionStatus.UNPAID,
    };
    return statusMap[status] || SubscriptionStatus.INCOMPLETE;
  }

  private mapRefundStatus(status: Stripe.Refund.Status): RefundStatus {
    const statusMap: Record<Stripe.Refund.Status, RefundStatus> = {
      pending: RefundStatus.PENDING,
      succeeded: RefundStatus.SUCCEEDED,
      failed: RefundStatus.FAILED,
      canceled: RefundStatus.CANCELED,
    };
    return statusMap[status] || RefundStatus.PENDING;
  }

  private mapPaymentMethod(pm: Stripe.PaymentMethod): PaymentMethodResult {
    return {
      id: pm.id,
      customerId: pm.customer as string,
      type: pm.type,
      card: pm.card ? {
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year,
        fingerprint: pm.card.fingerprint,
      } : undefined,
      isDefault: false,
      provider: 'stripe',
      providerId: pm.id,
      createdAt: new Date(pm.created * 1000),
    };
  }
}