import { createFileRoute, Link } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/unauthorized")({
  head: () => ({
    meta: [
      { title: "Session expired — Paygate" },
      { name: "description", content: "Your Paygate session has expired. Sign in again to continue." },
      { property: "og:title", content: "Session expired — Paygate" },
      { property: "og:description", content: "Your Paygate session has expired. Sign in again to continue." },
    ],
  }),
  component: Unauthorized,
});

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
          <LockKeyhole className="size-5" />
        </div>
        <h1 className="mt-5 text-xl font-semibold">Your session has expired</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          For your security we ended this session. Sign in again to return to the console.
        </p>
        <Button asChild className="mt-6">
          <Link to="/login">Sign in again</Link>
        </Button>
      </div>
    </div>
  );
}
