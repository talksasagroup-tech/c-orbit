import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { AdminAddChannel } from "@/components/pages/admin-add-channel";

export const Route = createFileRoute("/admin/merchants/$merchantId/channels/new")({
  head: () => ({
    meta: [
      { title: "Add payment channel — Paygate" },
      { name: "description", content: "Connect an additional provider account on behalf of a merchant." },
      { property: "og:title", content: "Add payment channel — Paygate" },
      { property: "og:description", content: "Connect an additional provider account on behalf of a merchant." },
    ],
  }),
  component: Page,
});

function Page() {
  const { merchantId } = Route.useParams();
  return (
    <AdminPage>
      <AdminAddChannel merchantId={merchantId} />
    </AdminPage>
  );
}
