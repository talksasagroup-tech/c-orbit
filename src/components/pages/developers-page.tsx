import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, KeyRound, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionCard } from "@/components/common";
import type { Scope } from "@/components/entity-links";

const snippet = `curl https://api.paygate.io/v1/transactions \\
  -H "Authorization: Bearer pk_live_•••••••••••" \\
  -G -d "channel_id=chn_001" -d "status=successful"`;

const webhookSample = `{
  "event": "transaction.successful",
  "data": {
    "id": "trx_100037",
    "provider": "Safaricom",
    "channel_type": "M-Pesa Paybill",
    "amount": 2500,
    "currency": "KES",
    "reference": "INV-20261001"
  }
}`;

export function DevelopersPage({ scope }: { scope: Scope }) {
  return (
    <>
      <PageHeader
        title="Developers"
        description="Everything needed to integrate with the collections API — provider-agnostic by design."
        actions={
          <Button variant="outline" size="sm" asChild>
            <a href="https://example.com/docs" target="_blank" rel="noreferrer">
              <BookOpen className="size-4" /> API documentation <ArrowUpRight className="size-3.5" />
            </a>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Environments" description="Switch base URLs to move between test and live traffic.">
          <div className="space-y-2 text-sm">
            <div className="rounded-md border border-border bg-secondary/50 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Test</p>
              <code className="font-mono text-xs">https://sandbox.api.paygate.io/v1</code>
            </div>
            <div className="rounded-md border border-border bg-secondary/50 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Live</p>
              <code className="font-mono text-xs">https://api.paygate.io/v1</code>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="API keys" description="Create, rotate and revoke credentials.">
          <Button asChild variant="outline" size="sm">
            {scope === "admin" ? (
              <Link to="/admin/api-keys"><KeyRound className="size-4" /> Manage API keys</Link>
            ) : (
              <Link to="/merchant/api-keys"><KeyRound className="size-4" /> Manage API keys</Link>
            )}
          </Button>
        </SectionCard>

        <SectionCard title="Webhooks" description="Subscribe to transaction and reconciliation events.">
          <Button asChild variant="outline" size="sm">
            {scope === "admin" ? (
              <Link to="/admin/webhooks"><Webhook className="size-4" /> Configure webhooks</Link>
            ) : (
              <Link to="/merchant/webhooks"><Webhook className="size-4" /> Configure webhooks</Link>
            )}
          </Button>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Fetch transactions" description="All providers return the same normalized shape.">
          <pre className="overflow-x-auto rounded-md bg-secondary p-4 font-mono text-xs leading-relaxed text-muted-foreground">
            {snippet}
          </pre>
        </SectionCard>
        <SectionCard title="Webhook payload" description="Signed with your endpoint secret, no credentials included.">
          <pre className="overflow-x-auto rounded-md bg-secondary p-4 font-mono text-xs leading-relaxed text-muted-foreground">
            {webhookSample}
          </pre>
        </SectionCard>
      </div>
    </>
  );
}
