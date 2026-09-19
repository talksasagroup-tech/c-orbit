import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { AddMerchant } from "@/components/pages/add-merchant";

export const Route = createFileRoute("/admin/merchants/new")({
  head: () => ({
    meta: [
      { title: "Add Merchant — Paygate" },
      { name: "description", content: "Onboard a new business and connect its first payment channel." },
      { property: "og:title", content: "Add Merchant — Paygate" },
      { property: "og:description", content: "Onboard a new business and connect its first payment channel." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminPage>
      <AddMerchant />
    </AdminPage>
  );
}
