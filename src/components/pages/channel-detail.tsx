import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Plug, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DetailList, Mono, PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { TransactionLink, type Scope } from "@/components/entity-links";
import { getMerchant, paymentChannels, transactions } from "@/lib/mock-data";
import { countryName, formatAmount, formatDate, formatDateTime } from "@/lib/format";

export function ChannelDetail({ scope, channelId }: { scope: Scope; channelId: string }) {
  const channel = paymentChannels.find((c) => c.id === channelId);
  const [status, setStatus] = useState(channel?.status ?? "active");
  const [revealed, setRevealed] = useState(false);

  if (!channel) {
    return (
      <>
        <PageHeader title="Channel not found" description={`No payment channel matches ${channelId}.`} />
        <Button asChild variant="outline" size="sm">
          {scope === "admin" ? (
            <Link to="/admin/channels">Back to channels</Link>
          ) : (
            <Link to="/merchant/channels">Back to channels</Link>
          )}
        </Button>
      </>
    );
  }

  const merchant = getMerchant(channel.merchantId);
  const recent = transactions.filter((t) => t.channelId === channel.id).slice(0, 8);

  return (
    <>
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 text-muted-foreground">
          {scope === "admin" ? (
            <Link to="/admin/channels">
              <ArrowLeft className="size-4" /> Payment channels
            </Link>
          ) : (
            <Link to="/merchant/channels">
              <ArrowLeft className="size-4" /> Payment channels
            </Link>
          )}
        </Button>
        <PageHeader
          title={channel.name}
          description={`${channel.providerName} · ${channel.channelType} · ${countryName(channel.country)}`}
          actions={
            <>
              <StatusBadge status={status} />
              <Button variant="outline" size="sm" onClick={() => toast.info("Configuration editor opened")}>
                Edit configuration
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.promise(new Promise((r) => setTimeout(r, 900)), {
                    loading: "Testing connection…",
                    success: "Connection healthy — provider responded in 812ms",
                    error: "Connection failed",
                  })
                }
              >
                <Plug className="size-4" /> Test connection
              </Button>
              <Button
                variant={status === "disabled" ? "default" : "destructive"}
                size="sm"
                onClick={() => {
                  const next = status === "disabled" ? "active" : "disabled";
                  setStatus(next);
                  toast.success(`Channel ${next === "active" ? "enabled" : "disabled"}`);
                }}
              >
                {status === "disabled" ? "Enable channel" : "Disable channel"}
              </Button>
            </>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <SectionCard title="Channel details">
            <DetailList
              items={[
                ...(scope === "admin" && merchant ? [{ label: "Merchant", value: merchant.name }] : []),
                { label: "Provider", value: channel.providerName },
                { label: "Channel type", value: channel.channelType },
                { label: "Country", value: countryName(channel.country) },
                { label: "Currency", value: channel.currency },
                { label: "Account identifier", value: <Mono>{channel.accountIdentifier}</Mono> },
                { label: "Created", value: formatDate(channel.createdAt) },
                { label: "Last successful transaction", value: formatDateTime(channel.lastSuccessfulAt) },
                { label: "Last activity", value: formatDateTime(channel.lastActivityAt) },
                {
                  label: "Configuration",
                  value: channel.configurationComplete ? (
                    <StatusBadge status="active" label="complete" />
                  ) : (
                    <StatusBadge status="pending" label="incomplete" />
                  ),
                },
              ]}
            />
          </SectionCard>

          <SectionCard
            title="Provider configuration"
            description="Credentials are stored encrypted in the backend and are never returned in full."
            actions={
              <Button variant="ghost" size="sm" onClick={() => setRevealed((v) => !v)}>
                {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                {revealed ? "Hide" : "Show"} hints
              </Button>
            }
          >
            <div className="space-y-2">
              {channel.credentials.map((cred) => (
                <div
                  key={cred.label}
                  className="flex items-center justify-between rounded-md border border-border bg-secondary/50 px-3 py-2"
                >
                  <span className="text-sm text-muted-foreground">{cred.label}</span>
                  <Mono>{revealed ? cred.masked : "••••••••••••••••"}</Mono>
                </div>
              ))}
              <p className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5" /> Only the last four characters are ever exposed to the console.
              </p>
            </div>
          </SectionCard>

          <SectionCard title="Recent transactions" description="Latest collections settled through this channel.">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <TransactionLink scope={scope} id={t.id} className="font-mono text-[0.8125rem] text-primary hover:underline">
                          {t.id}
                        </TransactionLink>
                      </TableCell>
                      <TableCell className="text-right tabular">{formatAmount(t.amount, t.currency)}</TableCell>
                      <TableCell><StatusBadge status={t.status} /></TableCell>
                      <TableCell className="text-muted-foreground">{formatDateTime(t.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Performance" description="Rolling 30-day channel statistics.">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Collected volume</p>
                <p className="mt-1 text-2xl font-semibold tabular">{formatAmount(channel.stats.volume, channel.currency)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Transactions</p>
                  <p className="mt-1 text-lg font-semibold tabular">{channel.stats.count.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Success rate</p>
                  <p className="mt-1 text-lg font-semibold tabular text-success">{channel.stats.successRate}%</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
