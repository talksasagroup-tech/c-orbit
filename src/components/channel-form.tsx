import { useMemo, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries, currencies, providers } from "@/lib/mock-data";

export interface ChannelFormValues {
  providerId: string;
  channelTypeId: string;
  country: string;
  currency: string;
  name: string;
  accountIdentifier: string;
  credentialKey: string;
  credentialSecret: string;
}

export const emptyChannel: ChannelFormValues = {
  providerId: "",
  channelTypeId: "",
  country: "",
  currency: "",
  name: "",
  accountIdentifier: "",
  credentialKey: "",
  credentialSecret: "",
};

export function ChannelForm({
  values,
  errors,
  onChange,
}: {
  values: ChannelFormValues;
  errors: Partial<Record<keyof ChannelFormValues, string>>;
  onChange: (patch: Partial<ChannelFormValues>) => void;
}) {
  const provider = useMemo(() => providers.find((p) => p.id === values.providerId), [values.providerId]);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Provider" required error={errors.providerId}>
        <Select
          value={values.providerId}
          onValueChange={(v) => onChange({ providerId: v, channelTypeId: "" })}
        >
          <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
          <SelectContent>
            {providers.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Channel type" required error={errors.channelTypeId}>
        <Select
          value={values.channelTypeId}
          onValueChange={(v) => onChange({ channelTypeId: v })}
          disabled={!provider}
        >
          <SelectTrigger><SelectValue placeholder={provider ? "Select channel type" : "Select a provider first"} /></SelectTrigger>
          <SelectContent>
            {(provider?.channelTypes ?? []).map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Country" required error={errors.country}>
        <Select
          value={values.country}
          onValueChange={(v) => {
            const match = countries.find((c) => c.code === v);
            onChange({ country: v, currency: values.currency || (match?.currency ?? "") });
          }}
        >
          <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Currency" required error={errors.currency}>
        <Select value={values.currency} onValueChange={(v) => onChange({ currency: v })}>
          <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
          <SelectContent>
            {currencies.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Channel name" required error={errors.name}>
        <Input
          placeholder="Main collections account"
          value={values.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </Field>

      <Field
        label="Account identifier"
        required
        error={errors.accountIdentifier}
        hint="Paybill, till, account or acquirer reference depending on channel type"
      >
        <Input
          placeholder="e.g. 123456"
          value={values.accountIdentifier}
          onChange={(e) => onChange({ accountIdentifier: e.target.value })}
        />
      </Field>

      <div className="sm:col-span-2">
        <div className="rounded-lg border border-border bg-secondary/40 p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Lock className="size-3.5 text-muted-foreground" /> Provider configuration
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Credentials are sent straight to the backend vault, stored encrypted and never returned to this console.
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Field label="API key / consumer key" required error={errors.credentialKey}>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={values.credentialKey}
                onChange={(e) => onChange({ credentialKey: e.target.value })}
              />
            </Field>
            <Field label="API secret / passkey" required error={errors.credentialSecret}>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={values.credentialSecret}
                onChange={(e) => onChange({ credentialSecret: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  required,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  required?: boolean | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label className="flex items-center gap-1.5">
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden>*</span>
        ) : (
          <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        )}
      </Label>
      {children}
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function validateChannel(values: ChannelFormValues) {
  const errors: Partial<Record<keyof ChannelFormValues, string>> = {};
  if (!values.providerId) errors.providerId = "Select a provider.";
  if (!values.channelTypeId) errors.channelTypeId = "Select a channel type.";
  if (!values.country) errors.country = "Select a country.";
  if (!values.currency) errors.currency = "Select a currency.";
  if (values.name.trim().length < 3) errors.name = "Give the channel a recognisable name.";
  if (values.accountIdentifier.trim().length < 3) errors.accountIdentifier = "Account identifier is required.";
  if (values.credentialKey.trim().length < 4) errors.credentialKey = "Provider key is required.";
  if (values.credentialSecret.trim().length < 4) errors.credentialSecret = "Provider secret is required.";
  return errors;
}

export function channelSummary(values: ChannelFormValues) {
  const provider = providers.find((p) => p.id === values.providerId);
  const channelType = provider?.channelTypes.find((t) => t.id === values.channelTypeId);
  return {
    providerName: provider?.name ?? "—",
    channelTypeName: channelType?.name ?? "—",
  };
}
