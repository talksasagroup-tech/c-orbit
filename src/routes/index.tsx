import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Paygate — Payment Orchestration Console" },
      {
        name: "description",
        content:
          "Sign in to Paygate to manage merchants, payment channels, transactions and reconciliation across providers.",
      },
      { property: "og:title", content: "Paygate — Payment Orchestration Console" },
      {
        property: "og:description",
        content:
          "Sign in to Paygate to manage merchants, payment channels, transactions and reconciliation across providers.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session.ready) return;
    if (session.role === "admin") navigate({ to: "/admin", replace: true });
    else if (session.role === "merchant") navigate({ to: "/merchant", replace: true });
    else navigate({ to: "/login", replace: true });
  }, [session.ready, session.role, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading your workspace…
      </span>
    </div>
  );
}
