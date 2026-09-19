import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { AdminDashboard } from "@/components/pages/admin-dashboard";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Platform Dashboard — Paygate" },
      { name: "description", content: "Platform-wide collections, merchant activity and provider health." },
      { property: "og:title", content: "Platform Dashboard — Paygate" },
      { property: "og:description", content: "Platform-wide collections, merchant activity and provider health." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminPage>
      <AdminDashboard />
    </AdminPage>
  );
}
