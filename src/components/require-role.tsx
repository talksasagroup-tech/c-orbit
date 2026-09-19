import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/session";
import type { Role } from "@/lib/types";

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const session = useSession();
  const navigate = useNavigate();

  const allowed =
    session.role === role || (role === "merchant" && session.role === "admin" && session.isImpersonating);

  useEffect(() => {
    if (!session.ready) return;
    if (!session.role) {
      navigate({ to: "/login", replace: true });
    } else if (!allowed) {
      navigate({ to: "/access-denied", replace: true });
    }
  }, [session.ready, session.role, allowed, navigate]);

  if (!session.ready || !session.role || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Checking your session…
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
