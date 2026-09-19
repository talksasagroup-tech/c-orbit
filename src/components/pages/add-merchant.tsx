import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DetailList, Mono, PageHeader, SectionCard, StatusBadge } from "@/components/common";
import {
  ChannelForm,
  Field,
  channelSummary,
  emptyChannel,
  validateChannel,
  type ChannelFormValues,
} from "@/components/channel-form";
import { businessTypes, countries, currencies, industries } from "@/lib/mock-data";
import { countryName } from "@/lib/format";

const steps = ["Business Information", "Contact Information", "Payment Channel", "Review"] as const;

interface BusinessValues {
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
}

interface ContactValues {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export function AddMerchant() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [business, setBusiness] = useState<BusinessValues>({
    name: "",
    tradingName: "",
    registrationNumber: "",
    businessType: "",
    industry: "",
    country: "",
    currency: "",
    email: "",
    phone: "",
    address: "",
  });
  const [contact, setContact] = useState<ContactValues>({ name: "", email: "", phone: "", role: "" });
  const [channel, setChannel] = useState<ChannelFormValues>(emptyChannel);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateStep() {
    const next: Record<string, string> = {};
    if (step === 0) {
      if (business.name.trim().length < 3) next["name"] = "Business name is required.";
      if (business.registrationNumber.trim().length < 3) next["registrationNumber"] = "Registration number is required.";
      if (!business.businessType) next["businessType"] = "Select a business type.";
      if (!business.country) next["country"] = "Select a country.";
      if (!business.currency) next["currency"] = "Select a default currency.";
      if (!business.email.includes("@")) next["email"] = "Enter a valid business email.";
      if (business.phone.trim().length < 7) next["phone"] = "Enter a valid phone number.";
    }
    if (step === 1) {
      if (contact.name.trim().length < 3) next["contactName"] = "Contact name is required.";
      if (!contact.email.includes("@")) next["contactEmail"] = "Enter a valid email.";
      if (contact.phone.trim().length < 7) next["contactPhone"] = "Enter a valid phone number.";
    }
    if (step === 2) {
      Object.entries(validateChannel(channel)).forEach(([k, v]) => {
        next[k] = v as string;
      });
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function nextStep() {
    if (!validateStep()) {
      toast.error("Fix the highlighted fields before continuing");
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function createMerchant() {
    setSubmitting(true);
    setTimeout(() => {
      toast.success(`${business.name} created with one payment channel`);
      navigate({ to: "/admin/merchants" });
    }, 900);
  }

  const summary = channelSummary(channel);

  return (
    <>
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 text-muted-foreground">
          <Link to="/admin/merchants">
            <ArrowLeft className="size-4" /> Merchants
          </Link>
        </Button>
        <PageHeader title="Add Merchant" description="Onboard a business and connect its first payment channel." />
      </div>

      <ol className="flex flex-wrap gap-2">
        {steps.map((label, index) => {
          const state = index === step ? "current" : index < step ? "done" : "upcoming";
          return (
            <li
              key={label}
              className={`flex flex-1 min-w-48 items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${
                state === "current"
                  ? "border-primary/40 bg-info-soft text-foreground"
                  : state === "done"
                    ? "border-success/25 bg-success-soft text-foreground"
                    : "border-border bg-card text-muted-foreground"
              }`}
            >
              <span
                className={`grid size-5 shrink-0 place-items-center rounded-full text-[0.6875rem] font-semibold ${
                  state === "done"
                    ? "bg-success text-success-foreground"
                    : state === "current"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {state === "done" ? <Check className="size-3" /> : index + 1}
              </span>
              <span className="truncate font-medium">{label}</span>
            </li>
          );
        })}
      </ol>

      <Card className="shadow-[var(--shadow-card)]">
        <CardContent className="space-y-6 pt-6">
          {step === 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Business / merchant name" required error={errors["name"]}>
                <Input value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} placeholder="ABC Distributors Ltd" />
              </Field>
              <Field label="Trading name">
                <Input value={business.tradingName} onChange={(e) => setBusiness({ ...business, tradingName: e.target.value })} />
              </Field>
              <Field label="Business registration number" required error={errors["registrationNumber"]}>
                <Input value={business.registrationNumber} onChange={(e) => setBusiness({ ...business, registrationNumber: e.target.value })} />
              </Field>
              <Field label="Business type" required error={errors["businessType"]}>
                <Select value={business.businessType} onValueChange={(v) => setBusiness({ ...business, businessType: v })}>
                  <SelectTrigger><SelectValue placeholder="Select business type" /></SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Industry">
                <Select value={business.industry} onValueChange={(v) => setBusiness({ ...business, industry: v })}>
                  <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    {industries.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Country" required error={errors["country"]}>
                <Select
                  value={business.country}
                  onValueChange={(v) => {
                    const match = countries.find((c) => c.code === v);
                    setBusiness({ ...business, country: v, currency: business.currency || (match?.currency ?? "") });
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Default currency" required error={errors["currency"]}>
                <Select value={business.currency} onValueChange={(v) => setBusiness({ ...business, currency: v })}>
                  <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Business email" required error={errors["email"]}>
                <Input type="email" value={business.email} onChange={(e) => setBusiness({ ...business, email: e.target.value })} />
              </Field>
              <Field label="Business phone" required error={errors["phone"]}>
                <Input value={business.phone} onChange={(e) => setBusiness({ ...business, phone: e.target.value })} placeholder="+254 700 000 000" />
              </Field>
              <Field label="Business address" className="sm:col-span-2">
                <Textarea value={business.address} onChange={(e) => setBusiness({ ...business, address: e.target.value })} />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Primary contact name" required error={errors["contactName"]}>
                <Input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
              </Field>
              <Field label="Role / position">
                <Input value={contact.role} onChange={(e) => setContact({ ...contact, role: e.target.value })} placeholder="Finance Director" />
              </Field>
              <Field label="Email" required error={errors["contactEmail"]}>
                <Input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
              </Field>
              <Field label="Phone" required error={errors["contactPhone"]}>
                <Input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
              </Field>
            </div>
          ) : null}

          {step === 2 ? (
            <ChannelForm values={channel} errors={errors} onChange={(patch) => setChannel({ ...channel, ...patch })} />
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <SectionCard title="Business information" actions={<Button variant="ghost" size="sm" onClick={() => setStep(0)}>Edit</Button>}>
                <DetailList
                  items={[
                    { label: "Business name", value: business.name },
                    { label: "Trading name", value: business.tradingName || "—" },
                    { label: "Registration number", value: <Mono>{business.registrationNumber}</Mono> },
                    { label: "Business type", value: business.businessType },
                    { label: "Industry", value: business.industry || "—" },
                    { label: "Country", value: countryName(business.country) },
                    { label: "Default currency", value: business.currency },
                    { label: "Business email", value: business.email },
                    { label: "Business phone", value: business.phone },
                    { label: "Address", value: business.address || "—" },
                  ]}
                />
              </SectionCard>

              <SectionCard title="Contact information" actions={<Button variant="ghost" size="sm" onClick={() => setStep(1)}>Edit</Button>}>
                <DetailList
                  items={[
                    { label: "Name", value: contact.name },
                    { label: "Role", value: contact.role || "—" },
                    { label: "Email", value: contact.email },
                    { label: "Phone", value: contact.phone },
                  ]}
                />
              </SectionCard>

              <SectionCard title="Payment channel" actions={<Button variant="ghost" size="sm" onClick={() => setStep(2)}>Edit</Button>}>
                <DetailList
                  items={[
                    { label: "Provider", value: summary.providerName },
                    { label: "Channel type", value: summary.channelTypeName },
                    { label: "Country", value: countryName(channel.country) },
                    { label: "Currency", value: channel.currency },
                    { label: "Channel name", value: channel.name },
                    { label: "Account identifier", value: <Mono>{channel.accountIdentifier}</Mono> },
                    { label: "Credentials", value: <Mono>•••••••••••• stored encrypted</Mono> },
                    { label: "Configuration status", value: <StatusBadge status="active" label="ready to verify" /> },
                  ]}
                />
              </SectionCard>
            </div>
          ) : null}

          <div className="flex items-center justify-between border-t border-border pt-5">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={nextStep}>Continue</Button>
            ) : (
              <Button onClick={createMerchant} disabled={submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                Create merchant
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
