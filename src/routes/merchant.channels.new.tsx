import { createFileRoute } from "@tanstack/react-router";
import { MerchantPage } from "@/components/scoped-page";
import { AddChannel } from "@/components/pages/add-channel";

export const Route = createFileRoute("/merchant/channels/new")({
  head: () => ({
    meta: [
      { title: "Add Payment Channel — Paygate" },
      { name: "description", content: "Connect a new provider account to start collecting payments." },
      { property: "og:title", content: "Add Payment Channel — Paygate" },
      { property: "og:description", content: "Connect a new provider account to start collecting payments." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MerchantPage>{(merchantId) => <AddChannel />}</MerchantPage>
  );
}
