import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/scoped-page";
import { ChannelDetail } from "@/components/pages/channel-detail";

export const Route = createFileRoute("/admin/channels/$channelId")({
  head: () => ({
    meta: [
      { title: "Payment channel — Paygate" },
      { name: "description", content: "Provider configuration status, credentials and channel performance." },
      { property: "og:title", content: "Payment channel — Paygate" },
      { property: "og:description", content: "Provider configuration status, credentials and channel performance." },
    ],
  }),
  component: Page,
});

function Page() {
  const { channelId } = Route.useParams();
  return (
    <AdminPage>
      <ChannelDetail scope="admin" channelId={channelId} />
    </AdminPage>
  );
}
