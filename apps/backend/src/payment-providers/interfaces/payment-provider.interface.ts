import { ProviderMetadata, ProviderFeature } from './provider-metadata';

export interface CreateCustomerInput {
  email: string;
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  taxId?: string;
  metadata?: Record<string, unknown>;
}

export interface CustomerResult {
  id: string;
  email: string;
  name?: string;
  metadata?: Record<string, unknown>;
  provider: string;
  providerId: string;
  createdAt: Date;
}

export interface CreateSubscriptionInput {
  customerId: string;
  priceId: string;
  quantity?: number;
  trialDays?: number;
  metadata?: Record<string, unknown>;
  paymentMethodId?: string;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
}

export interface SubscriptionResult {
  id: string;
  customerId: string;
  status: SubscriptionStatus;
  priceId: string;
  quantity: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialStart?: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  metadata?: Record<string, unknown>;
  provider: string;
  providerId: string;
}

export enum SubscriptionStatus {
  TRIALING = 'trialing',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  PAUSED = 'paused',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  UNPAID = 'unpaid',
}

export interface CancelSubscriptionOptions {
  prorate?: boolean;
  invoiceNow?: boolean;
}

export interface CheckoutInput {
  customerId: string;
  priceId: string;
  quantity?: number;
  successUrl: string;
  cancelUrl: string;
  mode: 'payment' | 'subscription' | 'setup';
  trialDays?: number;
  metadata?: Record<string, unknown>;
  allowPromotionCodes?: boolean;
  billingAddressCollection?: 'auto' | 'required';
  customerUpdate?: {
    address?: 'auto';
    name?: 'auto';
  };
}

export interface CheckoutResult {
  id: string;
  url: string;
  expiresAt?: Date;
  provider: string;
  providerId: string;
}

export interface BillingPortalInput {
  customerId: string;
  returnUrl: string;
  configurationId?: string;
}

export interface BillingPortalResult {
  url: string;
  provider: string;
}

export interface RefundInput {
  paymentId: string;
  amount?: number;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
  metadata?: Record<string, unknown>;
}

export interface RefundResult {
  id: string;
  paymentId: string;
  amount: number;
  status: RefundStatus | null;
  reason?: string;
  provider: string;
  providerId: string;
  createdAt: Date;
}

export enum RefundStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

export interface CreatePaymentMethodInput {
  customerId: string;
  type: 'card' | 'bank_transfer' | 'wallet';
  card?: {
    token: string;
  };
  billingDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
  metadata?: Record<string, unknown>;
}

export interface PaymentMethodResult {
  id: string;
  customerId: string;
  type: 'card' | 'bank_transfer' | 'wallet';
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    fingerprint: string;
  };
  isDefault: boolean;
  provider: string;
  providerId: string;
  createdAt: Date;
}

export interface UsageRecordInput {
  subscriptionId: string;
  metric: string;
  quantity: number;
  timestamp?: Date;
  action?: 'increment' | 'set';
}

export interface UsageRecordResult {
  id: string;
  subscriptionId: string;
  metric: string;
  quantity: number;
  periodStart: Date;
  periodEnd: Date;
  provider: string;
  providerId: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: unknown;
  createdAt: Date;
  provider: string;
}

export interface PaymentProvider {
  readonly metadata: ProviderMetadata;
  
  initialize(config: Record<string, unknown>): Promise<void>;
  
  createCustomer(data: CreateCustomerInput): Promise<CustomerResult>;
  getCustomer(providerCustomerId: string): Promise<CustomerResult | null>;
  updateCustomer(providerCustomerId: string, data: Partial<CreateCustomerInput>): Promise<CustomerResult>;
  deleteCustomer(providerCustomerId: string): Promise<void>;
  
  createSubscription(data: CreateSubscriptionInput): Promise<SubscriptionResult>;
  getSubscription(providerSubscriptionId: string): Promise<SubscriptionResult | null>;
  updateSubscription(providerSubscriptionId: string, data: Partial<CreateSubscriptionInput>): Promise<SubscriptionResult>;
  cancelSubscription(providerSubscriptionId: string, options?: CancelSubscriptionOptions): Promise<SubscriptionResult>;
  pauseSubscription(providerSubscriptionId: string): Promise<SubscriptionResult>;
  resumeSubscription(providerSubscriptionId: string): Promise<SubscriptionResult>;
  
  createCheckoutSession(data: CheckoutInput): Promise<CheckoutResult>;
  createBillingPortalSession(data: BillingPortalInput): Promise<BillingPortalResult>;
  
  createRefund(data: RefundInput): Promise<RefundResult>;
  
  attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentMethodResult>;
  detachPaymentMethod(paymentMethodId: string): Promise<void>;
  listPaymentMethods(customerId: string): Promise<PaymentMethodResult[]>;
  
  recordUsage(data: UsageRecordInput): Promise<UsageRecordResult>;
  getUsageRecords(subscriptionId: string, metric: string, periodStart: Date, periodEnd: Date): Promise<UsageRecordResult[]>;
  
  constructEvent(payload: string | Buffer, signature: string, secret: string): WebhookEvent;
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
  
  getSupportedFeatures(): ProviderFeature[];
  healthCheck(): Promise<boolean>;
}