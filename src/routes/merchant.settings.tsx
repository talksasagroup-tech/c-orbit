import { createFileRoute } from "@tanstack/react-router";
import { MerchantPage } from "@/components/scoped-page";
import { SettingsPage } from "@/components/pages/settings-page";

export const Route = createFileRoute("/merchant/settings")({
  head: () => ({
    meta: [
      { title: "My Settings — Paygate" },
      { name: "description", content: "Business profile, contact details, security and notifications." },
      { property: "og:title", content: "My Settings — Paygate" },
      { property: "og:description", content: "Business profile, contact details, security and notifications." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <MerchantPage>{(merchantId) => <SettingsPage scope="merchant" merchantId={merchantId} />}</MerchantPage>
  );
}
