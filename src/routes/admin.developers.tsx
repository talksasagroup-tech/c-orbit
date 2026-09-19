import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { DevelopersPage } from "@/components/pages/developers-page";

export const Route = createFileRoute("/admin/developers")({
  head: () => ({
    meta: [
      { title: "Developers — Paygate" },
      { name: "description", content: "API environments, payload shapes and integration references." },
      { property: "og:title", content: "Developers — Paygate" },
      { property: "og:description", content: "API environments, payload shapes and integration references." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminPage>
      <DevelopersPage scope="admin" />
    </AdminPage>
  );
}
