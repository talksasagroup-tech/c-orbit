import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { SettingsPage } from "@/components/pages/settings-page";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Platform Settings — Paygate" },
      { name: "description", content: "Platform-level defaults, provider availability and security policy." },
      { property: "og:title", content: "Platform Settings — Paygate" },
      { property: "og:description", content: "Platform-level defaults, provider availability and security policy." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminPage>
      <SettingsPage scope="admin" />
    </AdminPage>
  );
}
