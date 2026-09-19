import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { MoreHorizontal, Plus, RefreshCw, Search, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmptyState, ErrorState, PageHeader, StatusBadge, TableSkeleton } from "@/components/common";
import { MerchantLink } from "@/components/entity-links";
import { countries, merchants, paymentChannels, transactionsForMerchant } from "@/lib/mock-data";
import { countryName, formatAmount, formatDate } from "@/lib/format";
import { useSession } from "@/lib/session";
import type { Merchant } from "@/lib/types";

const PAGE_SIZE = 8;

export function MerchantsPage() {
  const session = useSession();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [country, setCountry] = useState("all");
  const [page, setPage] = useState(1);
  const [overrides, setOverrides] = useState<Record<string, Merchant["status"]>>({});
  const [loading, setLoading] = useState(false);
  const [failed] = useState(false);
  const [impersonateTarget, setImpersonateTarget] = useState<Merchant | null>(null);

  const filtered = merchants.filter((m) => {
    const current = overrides[m.id] ?? m.status;
    if (status !== "all" && current !== status) return false;
    if (country !== "all" && m.country !== country) return false;
    if (query) {
      const q = query.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.tradingName.toLowerCase().includes(q) || m.email.includes(q);
    }
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function refresh() {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  }

  return (
    <>
      <PageHeader
        title="Merchants"
        description="Every business onboarded onto the platform, with their channels and collection volume."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="size-4" /> Refresh
            </Button>
            <Button asChild size="sm">
              <Link to="/admin/merchants/new">
                <Plus className="size-4" /> Add Merchant
              </Link>
            </Button>
          </>
        }
      />

      <Card className="gap-0 py-0 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search by business name or email"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={country} onValueChange={(v) => { setCountry(v); setPage(1); }}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Country" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {failed ? (
          <div className="p-6">
            <ErrorState message="The merchant directory is unavailable right now." onRetry={refresh} />
          </div>
        ) : loading ? (
          <div className="p-4"><TableSkeleton rows={6} cols={8} /></div>
        ) : rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No merchants found"
              description="Adjust your filters, or onboard the first business onto the platform."
              action={
                <Button asChild size="sm">
                  <Link to="/admin/merchants/new">Add merchant</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Business type</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">Channels</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((m) => {
                  const st = overrides[m.id] ?? m.status;
                  const channels = paymentChannels.filter((c) => c.merchantId === m.id);
                  const volume = transactionsForMerchant(m.id)
                    .filter((t) => t.status === "successful")
                    .reduce((sum, t) => sum + t.amount, 0);
                  return (
                    <TableRow key={m.id} className="hover:bg-muted/40">
                      <TableCell>
                        <MerchantLink id={m.id} className="font-medium text-primary hover:underline">
                          {m.name}
                        </MerchantLink>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{m.businessType}</TableCell>
                      <TableCell>{countryName(m.country)}</TableCell>
                      <TableCell>{m.currency}</TableCell>
                      <TableCell className="text-right tabular">{channels.length}</TableCell>
                      <TableCell className="text-right tabular">{formatAmount(volume, m.currency)}</TableCell>
                      <TableCell><StatusBadge status={st} /></TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(m.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`Actions for ${m.name}`}>
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <MerchantLink id={m.id}>View</MerchantLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Merchant editor opened")}>Edit</DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to="/admin/merchants/$merchantId/channels/new" params={{ merchantId: m.id }}>
                                Add channel
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                const next = st === "active" ? "inactive" : "active";
                                setOverrides((o) => ({ ...o, [m.id]: next }));
                                toast.success(`${m.name} ${next === "active" ? "enabled" : "disabled"}`);
                              }}
                            >
                              {st === "active" ? "Disable merchant" : "Enable merchant"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setImpersonateTarget(m)}>
                              <UserCog className="size-4" /> Impersonate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {!loading && rows.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-sm text-muted-foreground">
            <span>
              Showing {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length} merchants
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</Button>
              <span className="tabular">Page {current} / {pageCount}</span>
              <Button variant="outline" size="sm" disabled={current === pageCount} onClick={() => setPage(current + 1)}>Next</Button>
            </div>
          </div>
        ) : null}
      </Card>

      <AlertDialog open={!!impersonateTarget} onOpenChange={(o) => !o && setImpersonateTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Impersonate {impersonateTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              You will see the platform exactly as this merchant does. You remain signed in as an administrator, and the
              session is recorded in the audit log. A banner will stay visible until you exit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!impersonateTarget) return;
                session.startImpersonation(impersonateTarget.id);
                toast.success(`Viewing as ${impersonateTarget.name}`);
                setImpersonateTarget(null);
                navigate({ to: "/merchant" });
              }}
            >
              Start impersonation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
