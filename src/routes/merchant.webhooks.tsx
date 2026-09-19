import { createFileRoute } from "@tanstack/react-router";
import { MerchantPage } from "@/components/scoped-page";
import { WebhooksPage } from "@/components/pages/webhooks-page";

export const Route = createFileRoute("/merchant/webhooks")({
  head: () => ({
    meta: [
      { title: "My Webhooks — Paygate" },
      { name: "description", content: "Receive real-time events for collections and reconciliation runs." },
      { property: "og:title", content: "My Webhooks — Paygate" },
      { property: "og:description", content: "Receive real-time events for collections and reconciliation runs." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MerchantPage>{(merchantId) => <WebhooksPage scope="merchant" merchantId={merchantId} />}</MerchantPage>
  );
}
