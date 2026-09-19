import { useMemo, useState } from "react";
import { Download, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, ErrorState, Mono, PageHeader, StatusBadge, TableSkeleton } from "@/components/common";
import { TransactionLink, type Scope } from "@/components/entity-links";
import { merchants, providers, transactions as allTransactions } from "@/lib/mock-data";
import { formatAmount, formatDateTime } from "@/lib/format";

const PAGE_SIZE = 12;

export function TransactionsPage({ scope, merchantId }: { scope: Scope; merchantId?: string | null }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [merchantFilter, setMerchantFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const scoped = useMemo(
    () => (merchantId ? allTransactions.filter((t) => t.merchantId === merchantId) : allTransactions),
    [merchantId],
  );

  const filtered = useMemo(() => {
    return scoped.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (scope === "admin" && merchantFilter !== "all" && t.merchantId !== merchantFilter) return false;
      if (providerFilter !== "all" && t.providerName !== providerFilter) return false;
      if (currencyFilter !== "all" && t.currency !== currencyFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.reference.toLowerCase().includes(q) ||
          t.customer.includes(q) ||
          t.merchantName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [scoped, status, merchantFilter, providerFilter, currencyFilter, query, scope]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const currencyOptions = Array.from(new Set(scoped.map((t) => t.currency)));

  function refresh() {
    setLoading(true);
    setFailed(false);
    setTimeout(() => setLoading(false), 700);
  }

  return (
    <>
      <PageHeader
        title="Transactions"
        description={
          scope === "admin"
            ? "Unified ledger of collections across every merchant, provider and channel."
            : "All collections settled through your payment channels."
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="size-4" /> Refresh
            </Button>
            <Button size="sm" onClick={() => toast.success(`Export queued — ${filtered.length} transactions`)}>
              <Download className="size-4" /> Export
            </Button>
          </>
        }
      />

      <Card className="gap-0 py-0 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by transaction ID, reference or customer"
              className="pl-8"
            />
          </div>
          {scope === "admin" ? (
            <Select value={merchantFilter} onValueChange={(v) => { setMerchantFilter(v); setPage(1); }}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Merchant" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All merchants</SelectItem>
                {merchants.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          <Select value={providerFilter} onValueChange={(v) => { setProviderFilter(v); setPage(1); }}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Provider" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All providers</SelectItem>
              {providers.map((p) => (
                <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="successful">Successful</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="reversed">Reversed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={currencyFilter} onValueChange={(v) => { setCurrencyFilter(v); setPage(1); }}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Currency" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All currencies</SelectItem>
              {currencyOptions.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {failed ? (
          <div className="p-6">
            <ErrorState message="We couldn't load transactions from the ledger service." onRetry={refresh} />
          </div>
        ) : loading ? (
          <div className="p-4">
            <TableSkeleton rows={8} cols={scope === "admin" ? 8 : 7} />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No transactions match these filters"
              description="Try widening the date range, clearing filters or searching a different reference."
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setStatus("all");
                    setMerchantFilter("all");
                    setProviderFilter("all");
                    setCurrencyFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  {scope === "admin" ? <TableHead>Merchant</TableHead> : null}
                  <TableHead>Provider</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((t) => (
                  <TableRow key={t.id} className="hover:bg-muted/40">
                    <TableCell>
                      <TransactionLink scope={scope} id={t.id} className="font-mono text-[0.8125rem] text-primary hover:underline">
                        {t.id}
                      </TransactionLink>
                    </TableCell>
                    {scope === "admin" ? <TableCell className="max-w-44 truncate">{t.merchantName}</TableCell> : null}
                    <TableCell>{t.providerName}</TableCell>
                    <TableCell className="max-w-44 truncate text-muted-foreground">{t.channelName}</TableCell>
                    <TableCell className="text-right tabular">{formatAmount(t.amount, t.currency)}</TableCell>
                    <TableCell><Mono>{t.reference}</Mono></TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(t.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!loading && !failed && rows.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-sm text-muted-foreground">
            <span>
              Showing {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={current === 1} onClick={() => setPage(current - 1)}>
                Previous
              </Button>
              <span className="tabular">
                Page {current} / {pageCount}
              </span>
              <Button variant="outline" size="sm" disabled={current === pageCount} onClick={() => setPage(current + 1)}>
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </>
  );
}
