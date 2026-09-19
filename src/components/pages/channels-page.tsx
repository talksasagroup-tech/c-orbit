import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MoreHorizontal, Plug, Plus, Search } from "lucide-react";
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
import { EmptyState, Mono, PageHeader, StatusBadge } from "@/components/common";
import { ChannelLink, MerchantLink, type Scope } from "@/components/entity-links";
import { paymentChannels, providers } from "@/lib/mock-data";
import { countryName, formatAmount, relativeTime } from "@/lib/format";

export function ChannelsPage({ scope, merchantId }: { scope: Scope; merchantId?: string | null }) {
  const [query, setQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  const scoped = useMemo(
    () => (merchantId ? paymentChannels.filter((c) => c.merchantId === merchantId) : paymentChannels),
    [merchantId],
  );

  const rows = scoped.filter((c) => {
    const status = statuses[c.id] ?? c.status;
    if (providerFilter !== "all" && c.providerName !== providerFilter) return false;
    if (statusFilter !== "all" && status !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.accountIdentifier.toLowerCase().includes(q) ||
        c.channelType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      <PageHeader
        title="Payment Channels"
        description={
          scope === "admin"
            ? "Every provider connection across the platform, regardless of country or channel type."
            : "Provider connections that collect funds on behalf of your business."
        }
        actions={
          scope === "merchant" ? (
            <Button asChild size="sm">
              <Link to="/merchant/channels/new">
                <Plus className="size-4" /> Add Payment Channel
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to="/admin/merchants">
                <Plus className="size-4" /> Add channel to merchant
              </Link>
            </Button>
          )
        }
      />

      <Card className="gap-0 py-0 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search channels or account identifiers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={providerFilter} onValueChange={setProviderFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Provider" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All providers</SelectItem>
              {providers.map((p) => (
                <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {rows.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No payment channels yet"
              description="Connect a provider channel to start collecting and normalizing transactions."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  {scope === "admin" ? <TableHead>Merchant</TableHead> : null}
                  <TableHead>Provider</TableHead>
                  <TableHead>Channel type</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Account identifier</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last activity</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => {
                  const status = statuses[c.id] ?? c.status;
                  return (
                    <TableRow key={c.id} className="hover:bg-muted/40">
                      <TableCell>
                        <ChannelLink scope={scope} id={c.id} className="font-medium text-primary hover:underline">
                          {c.name}
                        </ChannelLink>
                      </TableCell>
                      {scope === "admin" ? (
                        <TableCell>
                          <MerchantLink id={c.merchantId} className="hover:underline">
                            {c.merchantId}
                          </MerchantLink>
                        </TableCell>
                      ) : null}
                      <TableCell>{c.providerName}</TableCell>
                      <TableCell className="text-muted-foreground">{c.channelType}</TableCell>
                      <TableCell>{countryName(c.country)}</TableCell>
                      <TableCell>{c.currency}</TableCell>
                      <TableCell><Mono>{c.accountIdentifier}</Mono></TableCell>
                      <TableCell className="text-right tabular">{formatAmount(c.stats.volume, c.currency)}</TableCell>
                      <TableCell><StatusBadge status={status} /></TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{relativeTime(c.lastActivityAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Channel actions">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <ChannelLink scope={scope} id={c.id}>View</ChannelLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Opening configuration editor")}>
                              Edit configuration
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toast.promise(new Promise((r) => setTimeout(r, 900)), {
                                  loading: `Testing ${c.name}…`,
                                  success: "Connection healthy — provider responded in 812ms",
                                  error: "Connection failed",
                                })
                              }
                            >
                              <Plug className="size-4" /> Test connection
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                const next = status === "disabled" ? "active" : "disabled";
                                setStatuses((s) => ({ ...s, [c.id]: next }));
                                toast.success(`${c.name} ${next === "active" ? "enabled" : "disabled"}`);
                              }}
                            >
                              {status === "disabled" ? "Enable channel" : "Disable channel"}
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
      </Card>
    </>
  );
}
