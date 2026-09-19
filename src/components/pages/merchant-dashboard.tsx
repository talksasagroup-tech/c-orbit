import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, CreditCard, TrendingUp, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, SectionCard, StatCard, StatusBadge } from "@/components/common";
import { CountChart, StatusChart, VolumeChart } from "@/components/charts";
import { TransactionLink } from "@/components/entity-links";
import { channelsForMerchant, merchantVolumeSeries, transactionsForMerchant } from "@/lib/mock-data";
import { formatAmount, formatDateTime, formatNumber } from "@/lib/format";

export function MerchantDashboard({ merchantId }: { merchantId: string }) {
  const txns = transactionsForMerchant(merchantId);
  const channels = channelsForMerchant(merchantId);
  const successful = txns.filter((t) => t.status === "successful");
  const pending = txns.filter((t) => t.status === "pending").length;
  const failed = txns.filter((t) => t.status === "failed").length;
  const reversed = txns.filter((t) => t.status === "reversed").length;
  const currency = channels[0]?.currency ?? "KES";
  const collected = successful.reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your collections, channels and settlement activity."
        actions={
          <Button asChild size="sm">
            <Link to="/merchant/channels/new">Add payment channel</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total collections" value={formatAmount(collected, currency)} hint="Settled in last 7 days" icon={<TrendingUp className="size-4" />} />
        <StatCard label="Successful" value={formatNumber(successful.length)} tone="success" icon={<CheckCircle2 className="size-4" />} />
        <StatCard label="Pending" value={formatNumber(pending)} tone="warning" icon={<Clock className="size-4" />} />
        <StatCard label="Failed" value={formatNumber(failed)} tone="danger" icon={<XCircle className="size-4" />} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Active payment channels"
          value={formatNumber(channels.filter((c) => c.status === "active").length)}
          hint={`${channels.length} configured`}
          icon={<CreditCard className="size-4" />}
        />
        <StatCard label="Transactions processed" value={formatNumber(txns.length)} hint="Across all channels" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SectionCard title="Transaction volume" description="Daily collected volume for your channels.">
          <VolumeChart data={merchantVolumeSeries} />
        </SectionCard>
        <SectionCard title="Transaction status" description="Distribution across the last 7 days.">
          <StatusChart
            data={[
              { name: "Successful", value: successful.length, color: "var(--color-chart-2)" },
              { name: "Pending", value: pending, color: "var(--color-chart-3)" },
              { name: "Failed", value: failed, color: "var(--color-chart-4)" },
              { name: "Reversed", value: reversed, color: "var(--color-chart-5)" },
            ]}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="Recent transactions"
          description="Latest collections across your channels."
          actions={
            <Button asChild variant="ghost" size="sm">
              <Link to="/merchant/transactions">View all</Link>
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txns.slice(0, 7).map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <TransactionLink scope="merchant" id={t.id} className="font-mono text-[0.8125rem] text-primary hover:underline">
                        {t.id}
                      </TransactionLink>
                    </TableCell>
                    <TableCell className="max-w-40 truncate text-muted-foreground">{t.channelName}</TableCell>
                    <TableCell className="text-right tabular">{formatAmount(t.amount, t.currency)}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(t.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard title="Your payment channels" description="Provider connections collecting on your behalf.">
          <ul className="space-y-3">
            {channels.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to="/merchant/channels/$channelId"
                    params={{ channelId: c.id }}
                    className="truncate text-sm font-medium text-primary hover:underline"
                  >
                    {c.name}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.providerName} · {c.channelType} · {c.currency}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Transactions per day" description="Collection count across your channels.">
        <CountChart data={merchantVolumeSeries} />
      </SectionCard>
    </>
  );
}
