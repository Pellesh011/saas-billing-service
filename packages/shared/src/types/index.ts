export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filter?: Record<string, unknown>;
}

export type Interval = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export type SubscriptionStatus =
  | 'TRIALING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'PAUSED'
  | 'INCOMPLETE'
  | 'INCOMPLETE_EXPIRED'
  | 'UNPAID';

export type InvoiceStatus = 'DRAFT' | 'OPEN' | 'PAID' | 'VOID' | 'UNCOLLECTIBLE';

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentMethodType = 'CARD' | 'BANK_TRANSFER' | 'WALLET' | 'CASH' | 'OTHER';

export type LineItemType = 'SUBSCRIPTION' | 'USAGE' | 'ONE_TIME' | 'DISCOUNT' | 'TAX';

export type WebhookStatus = 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'DEAD_LETTER';

export type Role = 'ADMIN' | 'MANAGER' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  interval: Interval;
  price: number;
  currency: string;
  features: Record<string, unknown>;
  limits: Record<string, unknown>;
  isActive: boolean;
  stripePriceId?: string;
  trialDays: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  address?: Record<string, unknown>;
  taxId?: string;
  stripeCustomerId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart?: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  pausedAt?: string;
  stripeSubscriptionId?: string;
  quantity: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  plan?: Plan;
}

export interface Invoice {
  id: string;
  customerId: string;
  subscriptionId?: string;
  number: string;
  status: InvoiceStatus;
  amount: number;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  dueDate?: string;
  paidAt?: string;
  voidedAt?: string;
  stripeInvoiceId?: string;
  hostedInvoiceUrl?: string;
  invoicePdfUrl?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  subscription?: Subscription;
  lineItems?: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  type: LineItemType;
  metadata: Record<string, unknown>;
}

export interface Payment {
  id: string;
  invoiceId?: string;
  customerId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethodType;
  stripePaymentIntentId?: string;
  failureCode?: string;
  failureMessage?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  customerId: string;
  type: PaymentMethodType;
  stripePaymentMethodId?: string;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEvent {
  id: string;
  provider: string;
  eventType: string;
  stripeEventId?: string;
  status: WebhookStatus;
  payload: Record<string, unknown>;
  errorMessage?: string;
  attempts: number;
  lastAttemptAt?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
