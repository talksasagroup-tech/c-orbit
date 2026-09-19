import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { TransactionDetail } from "@/components/pages/transaction-detail";

export const Route = createFileRoute("/admin/transactions/$transactionId")({
  head: () => ({
    meta: [
      { title: "Transaction details — Paygate" },
      { name: "description", content: "Normalized transaction fields, provider references and lifecycle timeline." },
      { property: "og:title", content: "Transaction details — Paygate" },
      {
        property: "og:description",
        content: "Normalized transaction fields, provider references and lifecycle timeline.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { transactionId } = Route.useParams();
  return (
    <AdminPage>
      <TransactionDetail scope="admin" transactionId={transactionId} />
    </AdminPage>
  );
}
