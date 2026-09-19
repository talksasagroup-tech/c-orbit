import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/access-denied")({
  head: () => ({
    meta: [
      { title: "Access denied — Paygate" },
      { name: "description", content: "You do not have permission to view this area of the Paygate console." },
      { property: "og:title", content: "Access denied — Paygate" },
      {
        property: "og:description",
        content: "You do not have permission to view this area of the Paygate console.",
      },
    ],
  }),
  component: AccessDenied,
});

function AccessDenied() {
  const session = useSession();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-danger-soft text-destructive">
          <ShieldAlert className="size-5" />
        </div>
        <h1 className="mt-5 text-xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your role does not have permission to open this page. If you believe this is a mistake, contact your
          platform administrator.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          {session.role === "admin" ? (
            <Button asChild>
              <Link to="/admin">Back to admin dashboard</Link>
            </Button>
          ) : session.role === "merchant" ? (
            <Button asChild>
              <Link to="/merchant">Back to my dashboard</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
