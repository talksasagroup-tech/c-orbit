import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { ReconciliationPage } from "@/components/pages/reconciliation-page";

export const Route = createFileRoute("/admin/reconciliation")({
  head: () => ({
    meta: [
      { title: "Reconciliation — Paygate" },
      { name: "description", content: "Compare recorded collections with provider statements across merchants." },
      { property: "og:title", content: "Reconciliation — Paygate" },
      { property: "og:description", content: "Compare recorded collections with provider statements across merchants." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminPage>
      <ReconciliationPage scope="admin" />
    </AdminPage>
  );
}
