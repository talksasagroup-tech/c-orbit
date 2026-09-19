import { useMemo, useState } from "react";
import { Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, Mono, PageHeader, SectionCard, StatusBadge } from "@/components/common";
import type { Scope } from "@/components/entity-links";
import { webhooks as allWebhooks } from "@/lib/mock-data";
import { formatDateTime, relativeTime } from "@/lib/format";
import type { Webhook } from "@/lib/types";

const eventOptions = [
  "transaction.successful",
  "transaction.failed",
  "transaction.reversed",
  "reconciliation.completed",
  "reconciliation.variance",
  "channel.status_changed",
];

export function WebhooksPage({ scope, merchantId }: { scope: Scope; merchantId?: string | null }) {
  const base = useMemo(
    () => (merchantId ? allWebhooks.filter((w) => w.merchantId === merchantId) : allWebhooks),
    [merchantId],
  );
  const [items, setItems] = useState<Webhook[]>(base);
  const [selected, setSelected] = useState<Webhook | null>(base[0] ?? null);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>(["transaction.successful"]);
  const [error, setError] = useState<string | null>(null);

  function addWebhook() {
    if (!/^https:\/\/.+/.test(url)) {
      setError("Endpoint must be a valid HTTPS URL.");
      return;
    }
    if (events.length === 0) {
      setError("Select at least one event type.");
      return;
    }
    const created: Webhook = {
      id: `whk_${Math.random().toString(36).slice(2, 7)}`,
      merchantId: merchantId ?? "mch_001",
      url,
      events,
      status: "active",
      lastDeliveryAt: new Date().toISOString(),
      lastDeliveryStatus: "delivered",
      retries: 0,
      deliveries: [],
    };
    setItems((prev) => [created, ...prev]);
    setSelected(created);
    setOpen(false);
    setUrl("");
    setError(null);
    toast.success("Webhook endpoint added");
  }

  return (
    <>
      <PageHeader
        title="Webhooks"
        description={
          scope === "admin"
            ? "Outbound event delivery configured by merchants across the platform."
            : "Receive real-time events when collections and reconciliation runs complete."
        }
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" /> Add webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add webhook endpoint</DialogTitle>
                <DialogDescription>We sign every payload and retry failed deliveries for 24 hours.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hook-url">Endpoint URL</Label>
                  <Input
                    id="hook-url"
                    placeholder="https://api.yourcompany.com/hooks/payments"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Event types</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {eventOptions.map((evt) => (
                      <label key={evt} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={events.includes(evt)}
                          onCheckedChange={(checked) =>
                            setEvents((prev) => (checked ? [...prev, evt] : prev.filter((e) => e !== evt)))
                          }
                        />
                        <span className="font-mono text-xs">{evt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={addWebhook}>Add webhook</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="gap-0 py-0 shadow-[var(--shadow-card)]">
        {items.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No webhook endpoints" description="Add an HTTPS endpoint to start receiving events." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last delivery</TableHead>
                  <TableHead>Delivery status</TableHead>
                  <TableHead className="text-right">Retries</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((w) => (
                  <TableRow key={w.id} className="hover:bg-muted/40">
                    <TableCell className="max-w-80 truncate"><Mono>{w.url}</Mono></TableCell>
                    <TableCell className="text-muted-foreground">{w.events.length} events</TableCell>
                    <TableCell><StatusBadge status={w.status} /></TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{relativeTime(w.lastDeliveryAt)}</TableCell>
                    <TableCell><StatusBadge status={w.lastDeliveryStatus} /></TableCell>
                    <TableCell className="text-right tabular">{w.retries}</TableCell>
                    <TableCell className="space-x-1 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(w)}>
                        History
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toast.info("Edit endpoint")}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast.promise(new Promise((r) => setTimeout(r, 800)), {
                            loading: "Sending test event…",
                            success: "Test event delivered (200 OK)",
                            error: "Delivery failed",
                          })
                        }
                      >
                        <Send className="size-3.5" /> Test
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {selected ? (
        <SectionCard title="Delivery history" description={selected.url}>
          {selected.deliveries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No deliveries recorded yet for this endpoint.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selected.deliveries.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell><Mono>{d.event}</Mono></TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(d.at)}</TableCell>
                    <TableCell className="tabular">{d.responseCode}</TableCell>
                    <TableCell><StatusBadge status={d.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>
      ) : null}
    </>
  );
}
