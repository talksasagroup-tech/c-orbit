import { Link } from "@tanstack/react-router";
import { Activity, Building2, CheckCircle2, Clock, CreditCard, TrendingUp, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mono, PageHeader, SectionCard, StatCard, StatusBadge } from "@/components/common";
import { CountChart, StatusChart, VolumeChart } from "@/components/charts";
import { TransactionLink } from "@/components/entity-links";
import {
  merchantActivity,
  merchants,
  paymentChannels,
  providerHealth,
  transactions,
  volumeSeries,
} from "@/lib/mock-data";
import { formatAmount, formatCompact, formatNumber, relativeTime } from "@/lib/format";

export function AdminDashboard() {
  const active = merchants.filter((m) => m.status === "active").length;
  const inactive = merchants.filter((m) => m.status !== "active").length;
  const successful = transactions.filter((t) => t.status === "successful").length;
  const pending = transactions.filter((t) => t.status === "pending").length;
  const failed = transactions.filter((t) => t.status === "failed").length;
  const reversed = transactions.filter((t) => t.status === "reversed").length;
  const activeChannels = paymentChannels.filter((c) => c.status === "active").length;
  const totalVolume = paymentChannels.reduce((sum, c) => (c.currency === "KES" ? sum + c.stats.volume : sum), 0);
  const recent = transactions.slice(0, 7);

  return (
    <>
      <PageHeader
        title="Platform Dashboard"
        description="Collections, channel health and merchant activity across the whole platform."
        actions={
          <Button asChild size="sm">
            <Link to="/admin/merchants/new">Add merchant</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total merchants" value={formatNumber(merchants.length)} hint={`${active} active · ${inactive} inactive`} icon={<Building2 className="size-4" />} />
        <StatCard label="Transaction volume (KES)" value={formatCompact(totalVolume)} hint="Rolling 30 days" icon={<TrendingUp className="size-4" />} />
        <StatCard label="Active payment channels" value={formatNumber(activeChannels)} hint={`${paymentChannels.length} configured`} icon={<CreditCard className="size-4" />} />
        <StatCard label="Successful transactions" value={formatNumber(successful)} tone="success" hint="Last 7 days" icon={<CheckCircle2 className="size-4" />} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending" value={formatNumber(pending)} tone="warning" icon={<Clock className="size-4" />} />
        <StatCard label="Failed" value={formatNumber(failed)} tone="danger" icon={<XCircle className="size-4" />} />
        <StatCard label="Reversed" value={formatNumber(reversed)} icon={<Activity className="size-4" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SectionCard title="Transaction volume" description="Daily collected volume normalized to KES.">
          <VolumeChart data={volumeSeries} />
        </SectionCard>
        <SectionCard title="Transaction status" description="Distribution across the last 7 days.">
          <StatusChart
            data={[
              { name: "Successful", value: successful, color: "var(--color-chart-2)" },
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
          description="Latest collections across all merchants."
          actions={
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/transactions">View all</Link>
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <TransactionLink scope="admin" id={t.id} className="font-mono text-[0.8125rem] text-primary hover:underline">
                        {t.id}
                      </TransactionLink>
                    </TableCell>
                    <TableCell className="max-w-40 truncate">{t.merchantName}</TableCell>
                    <TableCell className="max-w-40 truncate text-muted-foreground">{t.channelName}</TableCell>
                    <TableCell className="text-right tabular">{formatAmount(t.amount, t.currency)}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Provider health" description="Connectivity reported by the orchestration engine.">
            <ul className="space-y-3">
              {providerHealth.map((p) => (
                <li key={p.provider} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.provider}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.channelType} · {p.uptime}% uptime · {p.latencyMs}ms
                    </p>
                  </div>
                  <StatusBadge status={p.state} />
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Recent merchant activity">
            <ul className="space-y-3">
              {merchantActivity.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{a.merchant}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.action}</p>
                  </div>
                  <Mono>{relativeTime(a.at)}</Mono>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Transactions per day" description="Count of collections processed platform-wide.">
        <CountChart data={volumeSeries} />
      </SectionCard>
    </>
  );
}
