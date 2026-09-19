import { createFileRoute } from "@tanstack/react-router";
import { MerchantPage } from "@/components/scoped-page";
import { ApiKeysPage } from "@/components/pages/api-keys-page";

export const Route = createFileRoute("/merchant/api-keys")({
  head: () => ({
    meta: [
      { title: "My API Keys — Paygate" },
      { name: "description", content: "Create and revoke the keys your servers use to call the API." },
      { property: "og:title", content: "My API Keys — Paygate" },
      { property: "og:description", content: "Create and revoke the keys your servers use to call the API." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MerchantPage>{(merchantId) => <ApiKeysPage scope="merchant" merchantId={merchantId} />}</MerchantPage>
  );
}
