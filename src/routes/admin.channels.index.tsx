import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { ChannelsPage } from "@/components/pages/channels-page";

export const Route = createFileRoute("/admin/channels/")({
  head: () => ({
    meta: [
      { title: "Payment Channels — Paygate" },
      { name: "description", content: "Every provider connection configured across the platform." },
      { property: "og:title", content: "Payment Channels — Paygate" },
      { property: "og:description", content: "Every provider connection configured across the platform." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminPage>
      <ChannelsPage scope="admin" />
    </AdminPage>
  );
}
