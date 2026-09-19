import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { DetailList, Mono, PageHeader, SectionCard, StatCard, StatusBadge } from "@/components/common";
import { ChannelLink, TransactionLink } from "@/components/entity-links";
import { channelsForMerchant, getMerchant, transactionsForMerchant } from "@/lib/mock-data";
import { countryName, formatAmount, formatDate, formatDateTime, formatNumber, relativeTime } from "@/lib/format";
import { useSession } from "@/lib/session";

export function MerchantDetail({ merchantId }: { merchantId: string }) {
  const session = useSession();
  const navigate = useNavigate();
  const merchant = getMerchant(merchantId);
  const [status, setStatus] = useState(merchant?.status ?? "active");
  const [confirmImpersonate, setConfirmImpersonate] = useState(false);

  if (!merchant) {
    return (
      <>
        <PageHeader title="Merchant not found" description={`No merchant matches ${merchantId}.`} />
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/merchants">Back to merchants</Link>
        </Button>
      </>
    );
  }

  const channels = channelsForMerchant(merchant.id);
  const txns = transactionsForMerchant(merchant.id);
  const settled = txns.filter((t) => t.status === "successful");
  const volume = settled.reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 text-muted-foreground">
          <Link to="/admin/merchants">
            <ArrowLeft className="size-4" /> Merchants
          </Link>
        </Button>
        <PageHeader
          title={merchant.name}
          description={`${merchant.businessType} · ${countryName(merchant.country)} · ${merchant.currency}`}
          actions={
            <>
              <StatusBadge status={status} />
              <Button variant="outline" size="sm" onClick={() => toast.info("Merchant editor opened")}>Edit</Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/merchants/$merchantId/channels/new" params={{ merchantId }}>
                  <Plus className="size-4" /> Add channel
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = status === "active" ? "inactive" : "active";
                  setStatus(next);
                  toast.success(`Merchant ${next === "active" ? "enabled" : "disabled"}`);
                }}
              >
                {status === "active" ? "Disable" : "Enable"}
              </Button>
              <Button size="sm" onClick={() => setConfirmImpersonate(true)}>
                <UserCog className="size-4" /> Impersonate
              </Button>
            </>
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Settled volume" value={formatAmount(volume, merchant.currency)} hint="Last 7 days" />
        <StatCard label="Transactions" value={formatNumber(txns.length)} />
        <StatCard label="Payment channels" value={formatNumber(channels.length)} hint={`${channels.filter((c) => c.status === "active").length} active`} />
        <StatCard label="Onboarded" value={formatDate(merchant.createdAt)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Business information">
          <DetailList
            items={[
              { label: "Legal name", value: merchant.name },
              { label: "Trading name", value: merchant.tradingName },
              { label: "Registration number", value: <Mono>{merchant.registrationNumber}</Mono> },
              { label: "Business type", value: merchant.businessType },
              { label: "Industry", value: merchant.industry },
              { label: "Country", value: countryName(merchant.country) },
              { label: "Default currency", value: merchant.currency },
              { label: "Business email", value: merchant.email },
              { label: "Business phone", value: merchant.phone },
              { label: "Address", value: merchant.address },
            ]}
          />
        </SectionCard>

        <SectionCard title="Contact information">
          <DetailList
            items={[
              { label: "Primary contact", value: merchant.contact.name },
              { label: "Role", value: merchant.contact.role },
              { label: "Email", value: merchant.contact.email },
              { label: "Phone", value: merchant.contact.phone },
            ]}
          />
        </SectionCard>
      </div>

      <SectionCard title="Payment channels" description="Provider connections collecting on behalf of this merchant.">
        {channels.length === 0 ? (
          <p className="text-sm text-muted-foreground">No channels configured yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Channel type</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Account identifier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <ChannelLink scope="admin" id={c.id} className="font-medium text-primary hover:underline">
                        {c.name}
                      </ChannelLink>
                    </TableCell>
                    <TableCell>{c.providerName}</TableCell>
                    <TableCell className="text-muted-foreground">{c.channelType}</TableCell>
                    <TableCell>{countryName(c.country)}</TableCell>
                    <TableCell>{c.currency}</TableCell>
                    <TableCell><Mono>{c.accountIdentifier}</Mono></TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{relativeTime(c.lastActivityAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <ChannelLink scope="admin" id={c.id}>View</ChannelLink>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Recent transactions"
        description="Latest collections recorded for this merchant."
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
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txns.slice(0, 8).map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <TransactionLink scope="admin" id={t.id} className="font-mono text-[0.8125rem] text-primary hover:underline">
                      {t.id}
                    </TransactionLink>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t.channelName}</TableCell>
                  <TableCell className="text-right tabular">{formatAmount(t.amount, t.currency)}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(t.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <AlertDialog open={confirmImpersonate} onOpenChange={setConfirmImpersonate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Impersonate {merchant.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              You will browse the merchant workspace as this business for support purposes. You stay signed in as an
              administrator and can exit at any time from the banner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                session.startImpersonation(merchant.id);
                toast.success(`Viewing as ${merchant.name}`);
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
