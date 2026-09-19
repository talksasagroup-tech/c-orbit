import { createFileRoute } from "@tanstack/react-router";
import { MerchantPage } from "@/components/scoped-page";
import { ChannelDetail } from "@/components/pages/channel-detail";

export const Route = createFileRoute("/merchant/channels/$channelId")({
  head: () => ({
    meta: [
      { title: "Payment channel — Paygate" },
      { name: "description", content: "Configuration status, masked credentials and performance for this channel." },
      { property: "og:title", content: "Payment channel — Paygate" },
      {
        property: "og:description",
        content: "Configuration status, masked credentials and performance for this channel.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const { channelId } = Route.useParams();
  return <MerchantPage>{() => <ChannelDetail scope="merchant" channelId={channelId} />}</MerchantPage>;
}
