import { createFileRoute } from "@tanstack/react-router";
import { MerchantPage } from "@/components/scoped-page";
import { ChannelsPage } from "@/components/pages/channels-page";

export const Route = createFileRoute("/merchant/channels/")({
  head: () => ({
    meta: [
      { title: "My Payment Channels — Paygate" },
      { name: "description", content: "Provider connections collecting funds on behalf of your business." },
      { property: "og:title", content: "My Payment Channels — Paygate" },
      { property: "og:description", content: "Provider connections collecting funds on behalf of your business." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MerchantPage>{(merchantId) => <ChannelsPage scope="merchant" merchantId={merchantId} />}</MerchantPage>
  );
}
