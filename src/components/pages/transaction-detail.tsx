import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, CircleDashed, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailList, Mono, PageHeader, SectionCard, StatusBadge } from "@/components/common";
import { ChannelLink, type Scope } from "@/components/entity-links";
import { transactions } from "@/lib/mock-data";
import { formatAmount, formatDateTime } from "@/lib/format";

export function TransactionDetail({ scope, transactionId }: { scope: Scope; transactionId: string }) {
  const transaction = transactions.find((t) => t.id === transactionId);

  if (!transaction) {
    return (
      <>
        <PageHeader title="Transaction not found" description={`No transaction matches ${transactionId}.`} />
        <Button asChild variant="outline" size="sm">
          {scope === "admin" ? (
            <Link to="/admin/transactions">Back to transactions</Link>
          ) : (
            <Link to="/merchant/transactions">Back to transactions</Link>
          )}
        </Button>
      </>
    );
  }

  return (
    <>
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 text-muted-foreground">
          {scope === "admin" ? (
            <Link to="/admin/transactions">
              <ArrowLeft className="size-4" /> All transactions
            </Link>
          ) : (
            <Link to="/merchant/transactions">
              <ArrowLeft className="size-4" /> My transactions
            </Link>
          )}
        </Button>
        <PageHeader
          title={transaction.id}
          description={`${transaction.providerName} · ${transaction.channelName}`}
          actions={<StatusBadge status={transaction.status} />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <SectionCard title="Transaction" description="Normalized fields as stored in the unified ledger.">
            <DetailList
              items={[
                { label: "Amount", value: <span className="tabular font-medium">{formatAmount(transaction.amount, transaction.currency)}</span> },
                { label: "Currency", value: transaction.currency },
                ...(scope === "admin" ? [{ label: "Merchant", value: transaction.merchantName }] : []),
                { label: "Provider", value: transaction.providerName },
                {
                  label: "Channel",
                  value: (
                    <ChannelLink scope={scope} id={transaction.channelId} className="text-primary hover:underline">
                      {transaction.channelName}
                    </ChannelLink>
                  ),
                },
                { label: "Customer", value: <Mono>{transaction.customer}</Mono> },
                { label: "Merchant reference", value: <Mono>{transaction.reference}</Mono> },
                { label: "Provider reference", value: <Mono>{transaction.providerReference}</Mono> },
                { label: "Created", value: formatDateTime(transaction.createdAt) },
                { label: "Last updated", value: formatDateTime(transaction.updatedAt) },
              ]}
            />
          </SectionCard>

          <SectionCard title="Raw payload" description="Provider credentials are never included in ledger payloads.">
            <pre className="overflow-x-auto rounded-md bg-secondary p-4 font-mono text-xs leading-relaxed text-muted-foreground">
{JSON.stringify(
  {
    id: transaction.id,
    amount: transaction.amount,
    currency: transaction.currency,
    provider: transaction.providerName,
    channel_id: transaction.channelId,
    reference: transaction.reference,
    customer: transaction.customer,
    status: transaction.status,
    provider_reference: transaction.providerReference,
    created_at: transaction.createdAt,
  },
  null,
  2,
)}
            </pre>
          </SectionCard>
        </div>

        <SectionCard title="Timeline" description="Lifecycle events reported by the orchestration engine.">
          <ol className="space-y-5">
            {transaction.timeline.map((event, index) => {
              const Icon = event.state === "failed" ? XCircle : event.state === "current" ? CircleDashed : CheckCircle2;
              const tone =
                event.state === "failed" ? "text-destructive" : event.state === "current" ? "text-warning-foreground" : "text-success";
              return (
                <li key={index} className="relative flex gap-3">
                  {index < transaction.timeline.length - 1 ? (
                    <span className="absolute left-[0.4375rem] top-6 h-full w-px bg-border" />
                  ) : null}
                  <Icon className={`mt-0.5 size-4 shrink-0 ${tone}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.label}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(event.at)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </SectionCard>
      </div>
    </>
  );
}
