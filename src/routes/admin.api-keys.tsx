import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { ApiKeysPage } from "@/components/pages/api-keys-page";

export const Route = createFileRoute("/admin/api-keys")({
  head: () => ({
    meta: [
      { title: "API Keys — Paygate" },
      { name: "description", content: "Create, rotate and revoke platform API credentials." },
      { property: "og:title", content: "API Keys — Paygate" },
      { property: "og:description", content: "Create, rotate and revoke platform API credentials." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminPage>
      <ApiKeysPage scope="admin" />
    </AdminPage>
  );
}
