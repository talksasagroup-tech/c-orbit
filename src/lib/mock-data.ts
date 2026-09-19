import type {
  ApiKey,
  Merchant,
  PaymentChannel,
  Provider,
  ReconciliationRun,
  Transaction,
  Webhook,
} from "./types";

export const providers: Provider[] = [
  {
    id: "safaricom",
    name: "Safaricom",
    country: "KE",
    channelTypes: [
      { id: "mpesa_paybill", name: "M-Pesa Paybill", category: "mobile_money" },
      { id: "mpesa_till", name: "M-Pesa Till", category: "mobile_money" },
    ],
  },
  {
    id: "airtel",
    name: "Airtel",
    country: "KE",
    channelTypes: [{ id: "airtel_money", name: "Airtel Money", category: "mobile_money" }],
  },
  {
    id: "equity",
    name: "Equity Bank",
    country: "KE",
    channelTypes: [{ id: "bank_collection", name: "Bank Collection Account", category: "bank" }],
  },
  {
    id: "mtn",
    name: "MTN",
    country: "UG",
    channelTypes: [{ id: "mtn_momo", name: "MTN MoMo Collection", category: "mobile_money" }],
  },
  {
    id: "cardnet",
    name: "Cardnet",
    country: "KE",
    channelTypes: [{ id: "card_acquiring", name: "Card Acquiring", category: "card" }],
  },
];

export const countries = [
  { code: "KE", name: "Kenya", currency: "KES" },
  { code: "UG", name: "Uganda", currency: "UGX" },
  { code: "TZ", name: "Tanzania", currency: "TZS" },
  { code: "NG", name: "Nigeria", currency: "NGN" },
  { code: "GH", name: "Ghana", currency: "GHS" },
];

export const currencies = ["KES", "UGX", "TZS", "NGN", "GHS", "USD"];

export const businessTypes = [
  "Limited Company",
  "Sole Proprietorship",
  "Partnership",
  "NGO / Non-profit",
  "Cooperative",
];

export const industries = [
  "Retail",
  "E-commerce",
  "Utilities",
  "Education",
  "Healthcare",
  "Transport & Logistics",
  "Financial Services",
];

export const merchants: Merchant[] = [
  {
    id: "mch_001",
    name: "ABC Distributors Ltd",
    tradingName: "ABC Distributors",
    registrationNumber: "PVT-KE-4820193",
    businessType: "Limited Company",
    industry: "Retail",
    country: "KE",
    currency: "KES",
    email: "finance@abcdistributors.co.ke",
    phone: "+254 711 220 118",
    address: "Enterprise Road, Industrial Area, Nairobi",
    status: "active",
    createdAt: "2025-11-04T09:12:00Z",
    contact: {
      name: "Grace Mwangi",
      email: "grace.mwangi@abcdistributors.co.ke",
      phone: "+254 711 220 119",
      role: "Finance Director",
    },
  },
  {
    id: "mch_002",
    name: "Sunrise Water Services",
    tradingName: "Sunrise Water",
    registrationNumber: "PVT-KE-5510022",
    businessType: "Limited Company",
    industry: "Utilities",
    country: "KE",
    currency: "KES",
    email: "billing@sunrisewater.co.ke",
    phone: "+254 733 881 004",
    address: "Ngong Road, Nairobi",
    status: "active",
    createdAt: "2025-12-18T11:40:00Z",
    contact: {
      name: "Peter Otieno",
      email: "peter.otieno@sunrisewater.co.ke",
      phone: "+254 733 881 005",
      role: "Head of Billing",
    },
  },
  {
    id: "mch_003",
    name: "Kampala Freight Co.",
    tradingName: "KFC Logistics",
    registrationNumber: "UG-772-0031",
    businessType: "Partnership",
    industry: "Transport & Logistics",
    country: "UG",
    currency: "UGX",
    email: "accounts@kampalafreight.ug",
    phone: "+256 772 445 909",
    address: "Plot 14, Jinja Road, Kampala",
    status: "active",
    createdAt: "2026-01-22T08:05:00Z",
    contact: {
      name: "Sarah Nakato",
      email: "sarah.nakato@kampalafreight.ug",
      phone: "+256 772 445 910",
      role: "Operations Manager",
    },
  },
  {
    id: "mch_004",
    name: "Bright Future Academy",
    tradingName: "Bright Future",
    registrationNumber: "NGO-KE-118872",
    businessType: "NGO / Non-profit",
    industry: "Education",
    country: "KE",
    currency: "KES",
    email: "bursar@brightfuture.ac.ke",
    phone: "+254 720 118 774",
    address: "Kiambu Road, Nairobi",
    status: "inactive",
    createdAt: "2025-09-30T14:25:00Z",
    contact: {
      name: "Daniel Kiprop",
      email: "daniel.kiprop@brightfuture.ac.ke",
      phone: "+254 720 118 775",
      role: "Bursar",
    },
  },
  {
    id: "mch_005",
    name: "Zawadi Health Group",
    tradingName: "Zawadi Health",
    registrationNumber: "PVT-KE-6621904",
    businessType: "Limited Company",
    industry: "Healthcare",
    country: "KE",
    currency: "KES",
    email: "revenue@zawadihealth.co.ke",
    phone: "+254 705 662 190",
    address: "Mombasa Road, Nairobi",
    status: "pending",
    createdAt: "2026-08-28T16:02:00Z",
    contact: {
      name: "Aisha Hassan",
      email: "aisha.hassan@zawadihealth.co.ke",
      phone: "+254 705 662 191",
      role: "Revenue Lead",
    },
  },
  {
    id: "mch_006",
    name: "Accra Mart Online",
    tradingName: "AccraMart",
    registrationNumber: "GH-CS-994120",
    businessType: "Limited Company",
    industry: "E-commerce",
    country: "GH",
    currency: "GHS",
    email: "payments@accramart.com",
    phone: "+233 244 119 002",
    address: "Ring Road East, Accra",
    status: "active",
    createdAt: "2026-04-11T10:31:00Z",
    contact: {
      name: "Kwame Mensah",
      email: "kwame.mensah@accramart.com",
      phone: "+233 244 119 003",
      role: "Payments Lead",
    },
  },
];

export const paymentChannels: PaymentChannel[] = [
  {
    id: "chn_001",
    merchantId: "mch_001",
    providerId: "safaricom",
    providerName: "Safaricom",
    channelType: "M-Pesa Paybill",
    channelTypeCategory: "mobile_money",
    country: "KE",
    currency: "KES",
    name: "ABC Main Collections",
    accountIdentifier: "123456",
    status: "active",
    configurationComplete: true,
    createdAt: "2025-11-05T09:00:00Z",
    lastActivityAt: "2026-09-19T06:41:00Z",
    lastSuccessfulAt: "2026-09-19T06:41:00Z",
    credentials: [
      { label: "Consumer Key", masked: "••••••••••••  a91f" },
      { label: "Consumer Secret", masked: "••••••••••••  7c20" },
      { label: "Passkey", masked: "••••••••••••  1de4" },
    ],
    stats: { volume: 18420500, count: 9241, successRate: 97.4 },
  },
  {
    id: "chn_002",
    merchantId: "mch_001",
    providerId: "equity",
    providerName: "Equity Bank",
    channelType: "Bank Collection Account",
    channelTypeCategory: "bank",
    country: "KE",
    currency: "KES",
    name: "ABC Bank Sweep",
    accountIdentifier: "0170199224415",
    status: "active",
    configurationComplete: true,
    createdAt: "2026-02-14T09:00:00Z",
    lastActivityAt: "2026-09-18T18:12:00Z",
    lastSuccessfulAt: "2026-09-18T18:12:00Z",
    credentials: [
      { label: "API Username", masked: "••••••••  abc_col" },
      { label: "API Password", masked: "••••••••••••  f0b2" },
    ],
    stats: { volume: 6120000, count: 412, successRate: 99.1 },
  },
  {
    id: "chn_003",
    merchantId: "mch_002",
    providerId: "safaricom",
    providerName: "Safaricom",
    channelType: "M-Pesa Paybill",
    channelTypeCategory: "mobile_money",
    country: "KE",
    currency: "KES",
    name: "Sunrise Water Billing",
    accountIdentifier: "778102",
    status: "active",
    configurationComplete: true,
    createdAt: "2025-12-19T09:00:00Z",
    lastActivityAt: "2026-09-19T05:58:00Z",
    lastSuccessfulAt: "2026-09-19T05:58:00Z",
    credentials: [
      { label: "Consumer Key", masked: "••••••••••••  33bd" },
      { label: "Consumer Secret", masked: "••••••••••••  9a17" },
    ],
    stats: { volume: 9331200, count: 14883, successRate: 96.2 },
  },
  {
    id: "chn_004",
    merchantId: "mch_003",
    providerId: "mtn",
    providerName: "MTN",
    channelType: "MTN MoMo Collection",
    channelTypeCategory: "mobile_money",
    country: "UG",
    currency: "UGX",
    name: "KFC Kampala Collections",
    accountIdentifier: "MOMO-44219",
    status: "active",
    configurationComplete: true,
    createdAt: "2026-01-23T09:00:00Z",
    lastActivityAt: "2026-09-19T04:22:00Z",
    lastSuccessfulAt: "2026-09-19T04:22:00Z",
    credentials: [
      { label: "Subscription Key", masked: "••••••••••••  6ee1" },
      { label: "API User ID", masked: "••••••••  9f2c" },
    ],
    stats: { volume: 412000000, count: 3021, successRate: 94.8 },
  },
  {
    id: "chn_005",
    merchantId: "mch_004",
    providerId: "safaricom",
    providerName: "Safaricom",
    channelType: "M-Pesa Paybill",
    channelTypeCategory: "mobile_money",
    country: "KE",
    currency: "KES",
    name: "Bright Future Fees",
    accountIdentifier: "556710",
    status: "disabled",
    configurationComplete: true,
    createdAt: "2025-10-01T09:00:00Z",
    lastActivityAt: "2026-06-02T10:04:00Z",
    lastSuccessfulAt: "2026-06-02T10:04:00Z",
    credentials: [{ label: "Consumer Key", masked: "••••••••••••  4b70" }],
    stats: { volume: 2210000, count: 884, successRate: 92.5 },
  },
  {
    id: "chn_006",
    merchantId: "mch_006",
    providerId: "cardnet",
    providerName: "Cardnet",
    channelType: "Card Acquiring",
    channelTypeCategory: "card",
    country: "GH",
    currency: "GHS",
    name: "AccraMart Checkout",
    accountIdentifier: "ACQ-GH-77410",
    status: "pending",
    configurationComplete: false,
    createdAt: "2026-09-02T09:00:00Z",
    lastActivityAt: "2026-09-12T09:15:00Z",
    lastSuccessfulAt: "2026-09-12T09:15:00Z",
    credentials: [{ label: "Acquirer Secret", masked: "not configured" }],
    stats: { volume: 148900, count: 96, successRate: 88.4 },
  },
  {
    id: "chn_007",
    merchantId: "mch_005",
    providerId: "airtel",
    providerName: "Airtel",
    channelType: "Airtel Money",
    channelTypeCategory: "mobile_money",
    country: "KE",
    currency: "KES",
    name: "Zawadi Clinics Collections",
    accountIdentifier: "AM-200194",
    status: "pending",
    configurationComplete: false,
    createdAt: "2026-08-29T09:00:00Z",
    lastActivityAt: "2026-09-10T12:00:00Z",
    lastSuccessfulAt: "2026-09-10T12:00:00Z",
    credentials: [{ label: "Client Secret", masked: "not configured" }],
    stats: { volume: 62000, count: 41, successRate: 90.2 },
  },
];

const customers = [
  "254711000118",
  "254722948210",
  "254733110044",
  "256772445909",
  "233244119002",
  "254701882290",
];

function buildTimeline(status: Transaction["status"], created: string) {
  const base = new Date(created).getTime();
  const at = (m: number) => new Date(base + m * 60000).toISOString();
  const timeline: Transaction["timeline"] = [
    { label: "Created", at: at(0), state: "done" },
    { label: "Submitted to provider", at: at(1), state: "done" },
  ];
  if (status === "successful") {
    timeline.push(
      { label: "Processing", at: at(2), state: "done" },
      { label: "Successful", at: at(3), state: "done" },
    );
  } else if (status === "pending") {
    timeline.push({ label: "Processing", at: at(2), state: "current" });
  } else if (status === "failed") {
    timeline.push(
      { label: "Processing", at: at(2), state: "done" },
      { label: "Failed — provider timeout", at: at(4), state: "failed" },
    );
  } else {
    timeline.push(
      { label: "Successful", at: at(3), state: "done" },
      { label: "Reversed", at: at(180), state: "failed" },
    );
  }
  return timeline;
}

function makeTransactions(): Transaction[] {
  const statuses: Transaction["status"][] = [
    "successful",
    "successful",
    "successful",
    "successful",
    "pending",
    "failed",
    "successful",
    "reversed",
  ];
  const active = paymentChannels.filter((c) => c.status !== "disabled");
  const list: Transaction[] = [];
  for (let i = 0; i < 128; i++) {
    const channel = active[i % active.length]!;
    const merchant = merchants.find((m) => m.id === channel.merchantId)!;
    const status = statuses[i % statuses.length]!;
    const created = new Date(Date.UTC(2026, 8, 19, 7, 0) - i * 47 * 60000).toISOString();
    const amount =
      channel.currency === "UGX"
        ? (i % 9) * 25000 + 50000
        : channel.currency === "GHS"
          ? (i % 7) * 45 + 30
          : (i % 11) * 350 + 250;
    list.push({
      id: `trx_${(100000 + i * 37).toString()}`,
      merchantId: merchant.id,
      merchantName: merchant.name,
      providerName: channel.providerName,
      channelId: channel.id,
      channelName: channel.name,
      amount,
      currency: channel.currency,
      reference: `INV-${2026}${(1000 + i).toString()}`,
      customer: customers[i % customers.length]!,
      status,
      createdAt: created,
      updatedAt: new Date(new Date(created).getTime() + 4 * 60000).toISOString(),
      providerReference: `${channel.providerId.slice(0, 3).toUpperCase()}${(9200000 + i * 131).toString()}`,
      timeline: buildTimeline(status, created),
    });
  }
  return list;
}

export const transactions: Transaction[] = makeTransactions();

export const reconciliationRuns: ReconciliationRun[] = [
  {
    id: "rec_2026_09_18",
    merchantId: "mch_001",
    merchantName: "ABC Distributors Ltd",
    providerName: "Safaricom",
    channelName: "ABC Main Collections",
    periodStart: "2026-09-18T00:00:00Z",
    periodEnd: "2026-09-18T23:59:00Z",
    status: "balanced",
    transactionCount: 412,
    matched: 412,
    unmatched: 0,
    difference: 0,
    currency: "KES",
  },
  {
    id: "rec_2026_09_17",
    merchantId: "mch_002",
    merchantName: "Sunrise Water Services",
    providerName: "Safaricom",
    channelName: "Sunrise Water Billing",
    periodStart: "2026-09-17T00:00:00Z",
    periodEnd: "2026-09-17T23:59:00Z",
    status: "variance",
    transactionCount: 688,
    matched: 681,
    unmatched: 7,
    difference: -4250,
    currency: "KES",
  },
  {
    id: "rec_2026_09_19",
    merchantId: "mch_003",
    merchantName: "Kampala Freight Co.",
    providerName: "MTN",
    channelName: "KFC Kampala Collections",
    periodStart: "2026-09-19T00:00:00Z",
    periodEnd: "2026-09-19T23:59:00Z",
    status: "in_progress",
    transactionCount: 96,
    matched: 88,
    unmatched: 8,
    difference: 150000,
    currency: "UGX",
  },
  {
    id: "rec_2026_09_16",
    merchantId: "mch_001",
    merchantName: "ABC Distributors Ltd",
    providerName: "Equity Bank",
    channelName: "ABC Bank Sweep",
    periodStart: "2026-09-16T00:00:00Z",
    periodEnd: "2026-09-16T23:59:00Z",
    status: "balanced",
    transactionCount: 34,
    matched: 34,
    unmatched: 0,
    difference: 0,
    currency: "KES",
  },
  {
    id: "rec_2026_09_15",
    merchantId: "mch_006",
    merchantName: "Accra Mart Online",
    providerName: "Cardnet",
    channelName: "AccraMart Checkout",
    periodStart: "2026-09-15T00:00:00Z",
    periodEnd: "2026-09-15T23:59:00Z",
    status: "variance",
    transactionCount: 41,
    matched: 38,
    unmatched: 3,
    difference: 128.5,
    currency: "GHS",
  },
];

export const webhooks: Webhook[] = [
  {
    id: "whk_001",
    merchantId: "mch_001",
    url: "https://api.abcdistributors.co.ke/hooks/payments",
    events: ["transaction.successful", "transaction.failed", "reconciliation.completed"],
    status: "active",
    lastDeliveryAt: "2026-09-19T06:42:00Z",
    lastDeliveryStatus: "delivered",
    retries: 0,
    deliveries: [
      { id: "dlv_1", event: "transaction.successful", at: "2026-09-19T06:42:00Z", status: "delivered", responseCode: 200 },
      { id: "dlv_2", event: "transaction.successful", at: "2026-09-19T06:31:00Z", status: "delivered", responseCode: 200 },
      { id: "dlv_3", event: "transaction.failed", at: "2026-09-19T05:58:00Z", status: "retrying", responseCode: 502 },
    ],
  },
  {
    id: "whk_002",
    merchantId: "mch_001",
    url: "https://ops.abcdistributors.co.ke/hooks/recon",
    events: ["reconciliation.variance"],
    status: "paused",
    lastDeliveryAt: "2026-09-14T22:10:00Z",
    lastDeliveryStatus: "delivered",
    retries: 0,
    deliveries: [
      { id: "dlv_4", event: "reconciliation.variance", at: "2026-09-14T22:10:00Z", status: "delivered", responseCode: 200 },
    ],
  },
  {
    id: "whk_003",
    merchantId: "mch_002",
    url: "https://billing.sunrisewater.co.ke/callbacks/collections",
    events: ["transaction.successful", "transaction.reversed"],
    status: "failing",
    lastDeliveryAt: "2026-09-19T06:05:00Z",
    lastDeliveryStatus: "failed",
    retries: 4,
    deliveries: [
      { id: "dlv_5", event: "transaction.successful", at: "2026-09-19T06:05:00Z", status: "failed", responseCode: 500 },
      { id: "dlv_6", event: "transaction.successful", at: "2026-09-19T05:35:00Z", status: "failed", responseCode: 500 },
    ],
  },
  {
    id: "whk_004",
    merchantId: "mch_003",
    url: "https://kampalafreight.ug/api/payments/webhook",
    events: ["transaction.successful"],
    status: "active",
    lastDeliveryAt: "2026-09-19T04:24:00Z",
    lastDeliveryStatus: "delivered",
    retries: 0,
    deliveries: [
      { id: "dlv_7", event: "transaction.successful", at: "2026-09-19T04:24:00Z", status: "delivered", responseCode: 201 },
    ],
  },
];

export const apiKeys: ApiKey[] = [
  {
    id: "key_001",
    merchantId: "mch_001",
    label: "Production server",
    environment: "live",
    prefix: "pk_live_abc",
    masked: "pk_live_abc••••••••••••4f21",
    createdAt: "2025-11-06T10:00:00Z",
    lastUsedAt: "2026-09-19T06:40:00Z",
    status: "active",
  },
  {
    id: "key_002",
    merchantId: "mch_001",
    label: "Sandbox integration",
    environment: "test",
    prefix: "pk_test_abc",
    masked: "pk_test_abc••••••••••••8c03",
    createdAt: "2025-11-06T10:02:00Z",
    lastUsedAt: "2026-09-17T14:20:00Z",
    status: "active",
  },
  {
    id: "key_003",
    merchantId: "mch_001",
    label: "Legacy ERP bridge",
    environment: "live",
    prefix: "pk_live_abc",
    masked: "pk_live_abc••••••••••••1190",
    createdAt: "2025-11-20T08:00:00Z",
    lastUsedAt: null,
    status: "revoked",
  },
  {
    id: "key_004",
    merchantId: "mch_002",
    label: "Billing engine",
    environment: "live",
    prefix: "pk_live_swt",
    masked: "pk_live_swt••••••••••••7b55",
    createdAt: "2025-12-20T08:00:00Z",
    lastUsedAt: "2026-09-19T05:55:00Z",
    status: "active",
  },
];

export const volumeSeries = [
  { day: "Sep 13", volume: 1840000, transactions: 742 },
  { day: "Sep 14", volume: 2120000, transactions: 811 },
  { day: "Sep 15", volume: 1985000, transactions: 769 },
  { day: "Sep 16", volume: 2460000, transactions: 903 },
  { day: "Sep 17", volume: 2310000, transactions: 874 },
  { day: "Sep 18", volume: 2890000, transactions: 1012 },
  { day: "Sep 19", volume: 1420000, transactions: 498 },
];

export const merchantVolumeSeries = [
  { day: "Sep 13", volume: 412000, transactions: 168 },
  { day: "Sep 14", volume: 501000, transactions: 194 },
  { day: "Sep 15", volume: 466000, transactions: 181 },
  { day: "Sep 16", volume: 588000, transactions: 220 },
  { day: "Sep 17", volume: 542000, transactions: 205 },
  { day: "Sep 18", volume: 671000, transactions: 249 },
  { day: "Sep 19", volume: 318000, transactions: 112 },
];

export const merchantActivity = [
  { id: "act_1", merchant: "Accra Mart Online", action: "Added card acquiring channel", at: "2026-09-19T06:10:00Z" },
  { id: "act_2", merchant: "Zawadi Health Group", action: "Submitted onboarding documents", at: "2026-09-18T15:42:00Z" },
  { id: "act_3", merchant: "Sunrise Water Services", action: "Rotated live API key", at: "2026-09-18T11:04:00Z" },
  { id: "act_4", merchant: "Kampala Freight Co.", action: "Webhook endpoint updated", at: "2026-09-17T19:20:00Z" },
  { id: "act_5", merchant: "ABC Distributors Ltd", action: "Reconciliation approved", at: "2026-09-17T08:30:00Z" },
];

export const providerHealth = [
  { provider: "Safaricom", channelType: "M-Pesa Paybill", uptime: 99.7, latencyMs: 820, state: "operational" as const },
  { provider: "MTN", channelType: "MoMo Collection", uptime: 98.4, latencyMs: 1340, state: "degraded" as const },
  { provider: "Equity Bank", channelType: "Bank Collection", uptime: 99.9, latencyMs: 410, state: "operational" as const },
  { provider: "Cardnet", channelType: "Card Acquiring", uptime: 94.1, latencyMs: 2260, state: "outage" as const },
];

export const currentMerchantId = "mch_001";

export function getMerchant(id: string) {
  return merchants.find((m) => m.id === id);
}

export function channelsForMerchant(id: string) {
  return paymentChannels.filter((c) => c.merchantId === id);
}

export function transactionsForMerchant(id: string) {
  return transactions.filter((t) => t.merchantId === id);
}
