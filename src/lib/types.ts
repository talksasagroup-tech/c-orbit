export type Role = "admin" | "merchant";

export type MerchantStatus = "active" | "inactive" | "pending";

export type ChannelStatus = "active" | "disabled" | "pending";

export type TransactionStatus = "successful" | "pending" | "failed" | "reversed";

export interface Provider {
  id: string;
  name: string;
  country: string;
  channelTypes: { id: string; name: string; category: "mobile_money" | "bank" | "card" }[];
}

export interface Merchant {
  id: string;
  name: string;
  tradingName: string;
  registrationNumber: string;
  businessType: string;
  industry: string;
  country: string;
  currency: string;
  email: string;
  phone: string;
  address: string;
  status: MerchantStatus;
  createdAt: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
}

export interface PaymentChannel {
  id: string;
  merchantId: string;
  providerId: string;
  providerName: string;
  channelType: string;
  channelTypeCategory: "mobile_money" | "bank" | "card";
  country: string;
  currency: string;
  name: string;
  accountIdentifier: string;
  status: ChannelStatus;
  configurationComplete: boolean;
  createdAt: string;
  lastActivityAt: string;
  lastSuccessfulAt: string;
  credentials: { label: string; masked: string }[];
  stats: { volume: number; count: number; successRate: number };
}

export interface Transaction {
  id: string;
  merchantId: string;
  merchantName: string;
  providerName: string;
  channelId: string;
  channelName: string;
  amount: number;
  currency: string;
  reference: string;
  customer: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  providerReference: string;
  timeline: { label: string; at: string; state: "done" | "current" | "failed" }[];
}

export interface ReconciliationRun {
  id: string;
  merchantId: string;
  merchantName: string;
  providerName: string;
  channelName: string;
  periodStart: string;
  periodEnd: string;
  status: "balanced" | "variance" | "in_progress";
  transactionCount: number;
  matched: number;
  unmatched: number;
  difference: number;
  currency: string;
}

export interface Webhook {
  id: string;
  merchantId: string;
  url: string;
  events: string[];
  status: "active" | "paused" | "failing";
  lastDeliveryAt: string;
  lastDeliveryStatus: "delivered" | "failed" | "retrying";
  retries: number;
  deliveries: {
    id: string;
    event: string;
    at: string;
    status: "delivered" | "failed" | "retrying";
    responseCode: number;
  }[];
}

export interface ApiKey {
  id: string;
  merchantId: string;
  label: string;
  environment: "test" | "live";
  prefix: string;
  masked: string;
  createdAt: string;
  lastUsedAt: string | null;
  status: "active" | "revoked";
}
