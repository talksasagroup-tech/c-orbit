import { createFileRoute } from "@tanstack/react-router";
import { MerchantPage } from "@/components/scoped-page";
import { TransactionDetail } from "@/components/pages/transaction-detail";

export const Route = createFileRoute("/merchant/transactions/$transactionId")({
  head: () => ({
    meta: [
      { title: "Transaction details — Paygate" },
      { name: "description", content: "Full lifecycle of a single collection settled through your channels." },
      { property: "og:title", content: "Transaction details — Paygate" },
      { property: "og:description", content: "Full lifecycle of a single collection settled through your channels." },
    ],
  }),
  component: Page,
});

function Page() {
  const { transactionId } = Route.useParams();
  return <MerchantPage>{() => <TransactionDetail scope="merchant" transactionId={transactionId} />}</MerchantPage>;
}
