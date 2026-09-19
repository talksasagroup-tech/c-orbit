import { createFileRoute } from "@tanstack/react-router";
import { MerchantPage } from "@/components/scoped-page";
import { TransactionsPage } from "@/components/pages/transactions-page";

export const Route = createFileRoute("/merchant/transactions/")({
  head: () => ({
    meta: [
      { title: "My Transactions — Paygate" },
      { name: "description", content: "Every collection settled through your payment channels." },
      { property: "og:title", content: "My Transactions — Paygate" },
      { property: "og:description", content: "Every collection settled through your payment channels." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MerchantPage>{(merchantId) => <TransactionsPage scope="merchant" merchantId={merchantId} />}</MerchantPage>
  );
}
