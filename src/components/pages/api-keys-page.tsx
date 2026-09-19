import { useMemo, useState } from "react";
import { Copy, KeyRound, Plus, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { EmptyState, Mono, PageHeader, StatusBadge } from "@/components/common";
import type { Scope } from "@/components/entity-links";
import { apiKeys as allKeys } from "@/lib/mock-data";
import { formatDate, relativeTime } from "@/lib/format";
import type { ApiKey } from "@/lib/types";

export function ApiKeysPage({ scope, merchantId }: { scope: Scope; merchantId?: string | null }) {
  const base = useMemo(
    () => (merchantId ? allKeys.filter((k) => k.merchantId === merchantId) : allKeys),
    [merchantId],
  );
  const [keys, setKeys] = useState<ApiKey[]>(base);
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [environment, setEnvironment] = useState<"test" | "live">("test");
  const [secret, setSecret] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);

  function createKey() {
    if (label.trim().length < 3) {
      toast.error("Give the key a descriptive label");
      return;
    }
    const raw = `pk_${environment}_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`;
    const created: ApiKey = {
      id: `key_${Math.random().toString(36).slice(2, 7)}`,
      merchantId: merchantId ?? "mch_001",
      label,
      environment,
      prefix: raw.slice(0, 11),
      masked: `${raw.slice(0, 11)}••••••••••••${raw.slice(-4)}`,
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      status: "active",
    };
    setKeys((prev) => [created, ...prev]);
    setSecret(raw);
    setOpen(false);
    setLabel("");
  }

  return (
    <>
      <PageHeader
        title="API Keys"
        description={
          scope === "admin"
            ? "Platform keys used by internal services. Merchant keys are managed inside each merchant workspace."
            : "Authenticate your server-side requests to the collections API."
        }
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="size-4" /> Create API key</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create API key</DialogTitle>
                <DialogDescription>The secret is shown once at creation and cannot be retrieved later.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="key-label">Label</Label>
                  <Input id="key-label" placeholder="Production server" value={label} onChange={(e) => setLabel(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Environment</Label>
                  <Select value={environment} onValueChange={(v) => setEnvironment(v as "test" | "live")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Test</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={createKey}>Create key</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {secret ? (
        <div className="rounded-lg border border-warning/35 bg-warning-soft p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-warning-foreground">
            <ShieldAlert className="size-4" /> Copy your secret key now
          </p>
          <p className="mt-1 text-sm text-warning-foreground/80">
            This is the only time the full key will be displayed.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="rounded-md border border-warning/35 bg-card px-3 py-2 font-mono text-xs">{secret}</code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard?.writeText(secret);
                toast.success("Key copied to clipboard");
              }}
            >
              <Copy className="size-3.5" /> Copy
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSecret(null)}>Dismiss</Button>
          </div>
        </div>
      ) : null}

      <Card className="gap-0 py-0 shadow-[var(--shadow-card)]">
        {keys.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No API keys" description="Create a test key to start integrating with the collections API." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        <KeyRound className="size-3.5 text-muted-foreground" />
                        {k.label}
                      </span>
                    </TableCell>
                    <TableCell><Mono>{k.masked}</Mono></TableCell>
                    <TableCell><StatusBadge status={k.environment} /></TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(k.createdAt)}</TableCell>
                    <TableCell className="text-muted-foreground">{k.lastUsedAt ? relativeTime(k.lastUsedAt) : "Never"}</TableCell>
                    <TableCell><StatusBadge status={k.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={k.status === "revoked"}
                        onClick={() => setRevokeTarget(k)}
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <AlertDialog open={!!revokeTarget} onOpenChange={(o) => !o && setRevokeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke {revokeTarget?.label}?</AlertDialogTitle>
            <AlertDialogDescription>
              Any integration using this key will immediately start receiving 401 responses. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setKeys((prev) => prev.map((k) => (k.id === revokeTarget?.id ? { ...k, status: "revoked" } : k)));
                toast.success("API key revoked");
                setRevokeTarget(null);
              }}
            >
              Revoke key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
