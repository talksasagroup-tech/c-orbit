import { createFileRoute } from "@tanstack/react-router";
import { MerchantPage } from "@/components/scoped-page";
import { MerchantDashboard } from "@/components/pages/merchant-dashboard";

export const Route = createFileRoute("/merchant/")({
  head: () => ({
    meta: [
      { title: "Merchant Dashboard — Paygate" },
      { name: "description", content: "Your collections, payment channels and settlement activity." },
      { property: "og:title", content: "Merchant Dashboard — Paygate" },
      { property: "og:description", content: "Your collections, payment channels and settlement activity." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MerchantPage>{(merchantId) => <MerchantDashboard merchantId={merchantId} />}</MerchantPage>
  );
}
