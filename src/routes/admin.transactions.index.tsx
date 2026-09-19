import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { TransactionsPage } from "@/components/pages/transactions-page";

export const Route = createFileRoute("/admin/transactions/")({
  head: () => ({
    meta: [
      { title: "All Transactions — Paygate" },
      { name: "description", content: "Unified transaction ledger across every merchant, provider and channel." },
      { property: "og:title", content: "All Transactions — Paygate" },
      { property: "og:description", content: "Unified transaction ledger across every merchant, provider and channel." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminPage>
      <TransactionsPage scope="admin" />
    </AdminPage>
  );
}
