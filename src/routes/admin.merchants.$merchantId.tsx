import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { MerchantDetail } from "@/components/pages/merchant-detail";

export const Route = createFileRoute("/admin/merchants/$merchantId")({
  head: () => ({
    meta: [
      { title: "Merchant details — Paygate" },
      { name: "description", content: "Business profile, contacts, payment channels and recent collections." },
      { property: "og:title", content: "Merchant details — Paygate" },
      {
        property: "og:description",
        content: "Business profile, contacts, payment channels and recent collections.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { merchantId } = Route.useParams();
  return (
    <AdminPage>
      <MerchantDetail merchantId={merchantId} />
    </AdminPage>
  );
}
