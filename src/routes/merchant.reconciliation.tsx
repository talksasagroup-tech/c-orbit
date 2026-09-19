import { createFileRoute } from "@tanstack/react-router";
import { MerchantPage } from "@/components/scoped-page";
import { ReconciliationPage } from "@/components/pages/reconciliation-page";

export const Route = createFileRoute("/merchant/reconciliation")({
  head: () => ({
    meta: [
      { title: "My Reconciliation — Paygate" },
      { name: "description", content: "Match your recorded collections against provider statements." },
      { property: "og:title", content: "My Reconciliation — Paygate" },
      { property: "og:description", content: "Match your recorded collections against provider statements." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MerchantPage>{(merchantId) => <ReconciliationPage scope="merchant" merchantId={merchantId} />}</MerchantPage>
  );
}
