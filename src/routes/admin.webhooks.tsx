import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { WebhooksPage } from "@/components/pages/webhooks-page";

export const Route = createFileRoute("/admin/webhooks")({
  head: () => ({
    meta: [
      { title: "Webhooks — Paygate" },
      { name: "description", content: "Outbound event delivery configured across merchant workspaces." },
      { property: "og:title", content: "Webhooks — Paygate" },
      { property: "og:description", content: "Outbound event delivery configured across merchant workspaces." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminPage>
      <WebhooksPage scope="admin" />
    </AdminPage>
  );
}
