import { createFileRoute } from "@tanstack/react-router";
import { MerchantPage } from "@/components/scoped-page";
import { DevelopersPage } from "@/components/pages/developers-page";

export const Route = createFileRoute("/merchant/developers")({
  head: () => ({
    meta: [
      { title: "Developers — Paygate" },
      { name: "description", content: "Integrate with the collections API using provider-agnostic endpoints." },
      { property: "og:title", content: "Developers — Paygate" },
      { property: "og:description", content: "Integrate with the collections API using provider-agnostic endpoints." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MerchantPage>{(merchantId) => <DevelopersPage scope="merchant" />}</MerchantPage>
  );
}
