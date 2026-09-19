import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { MerchantsPage } from "@/components/pages/merchants-page";

export const Route = createFileRoute("/admin/merchants/")({
  head: () => ({
    meta: [
      { title: "Merchants — Paygate" },
      { name: "description", content: "Browse, filter and manage every merchant onboarded onto the platform." },
      { property: "og:title", content: "Merchants — Paygate" },
      { property: "og:description", content: "Browse, filter and manage every merchant onboarded onto the platform." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminPage>
      <MerchantsPage />
    </AdminPage>
  );
}
