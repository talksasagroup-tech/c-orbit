import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, PageHeader, StatCard, StatusBadge } from "@/components/common";
import type { Scope } from "@/components/entity-links";
import { providers, reconciliationRuns } from "@/lib/mock-data";
import { formatAmount, formatDate, formatNumber } from "@/lib/format";

export function ReconciliationPage({ scope, merchantId }: { scope: Scope; merchantId?: string | null }) {
  const [range, setRange] = useState("7d");
  const [providerFilter, setProviderFilter] = useState("all");

  const scoped = useMemo(
    () => (merchantId ? reconciliationRuns.filter((r) => r.merchantId === merchantId) : reconciliationRuns),
    [merchantId],
  );

  const rows = scoped.filter((r) => providerFilter === "all" || r.providerName === providerFilter);

  const totals = rows.reduce(
    (acc, r) => ({
      count: acc.count + r.transactionCount,
      matched: acc.matched + r.matched,
      unmatched: acc.unmatched + r.unmatched,
    }),
    { count: 0, matched: 0, unmatched: 0 },
  );
  const matchRate = totals.count ? ((totals.matched / totals.count) * 100).toFixed(1) : "0.0";

  return (
    <>
      <PageHeader
        title="Reconciliation"
        description={
          scope === "admin"
            ? "Compare platform-recorded collections against provider statements across merchants."
            : "Compare your recorded collections against provider statements."
        }
        actions={
          <>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => toast.success("Reconciliation report export queued")}>
              <Download className="size-4" /> Export
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Reconciled runs" value={formatNumber(rows.length)} hint="In selected period" />
        <StatCard label="Transactions compared" value={formatNumber(totals.count)} />
        <StatCard label="Matched" value={`${matchRate}%`} tone="success" hint={`${formatNumber(totals.matched)} transactions`} />
        <StatCard
          label="Unmatched"
          value={formatNumber(totals.unmatched)}
          tone={totals.unmatched > 0 ? "warning" : "default"}
          hint="Requires investigation"
        />
      </div>

      <Card className="gap-0 py-0 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-4">
          <p className="text-sm font-medium">Reconciliation runs</p>
          <Select value={providerFilter} onValueChange={setProviderFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Provider" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All providers</SelectItem>
              {providers.map((p) => (
                <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {rows.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No reconciliation runs" description="Runs appear once a channel has settled collections for a full day." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  {scope === "admin" ? <TableHead>Merchant</TableHead> : null}
                  <TableHead>Provider</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                  <TableHead className="text-right">Matched</TableHead>
                  <TableHead className="text-right">Unmatched</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap">{formatDate(r.periodStart)}</TableCell>
                    {scope === "admin" ? <TableCell>{r.merchantName}</TableCell> : null}
                    <TableCell>{r.providerName}</TableCell>
                    <TableCell className="text-muted-foreground">{r.channelName}</TableCell>
                    <TableCell className="text-right tabular">{formatNumber(r.transactionCount)}</TableCell>
                    <TableCell className="text-right tabular">{formatNumber(r.matched)}</TableCell>
                    <TableCell className="text-right tabular">{formatNumber(r.unmatched)}</TableCell>
                    <TableCell
                      className={`text-right tabular ${r.difference === 0 ? "" : "text-warning-foreground font-medium"}`}
                    >
                      {formatAmount(r.difference, r.currency)}
                    </TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </>
  );
}
