import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/session";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Paygate" },
      { name: "description", content: "Sign in to the Paygate payment orchestration console." },
      { property: "og:title", content: "Sign in — Paygate" },
      { property: "og:description", content: "Sign in to the Paygate payment orchestration console." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const session = useSession();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("ops@paygate.io");
  const [password, setPassword] = useState("demo-password");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      session.signIn(role, email);
      toast.success(`Signed in as ${role === "admin" ? "platform administrator" : "merchant"}`);
      navigate({ to: role === "admin" ? "/admin" : "/merchant" });
    }, 600);
  }

  return (
    <AuthLayout
      title="Sign in"
      description="Access the orchestration console with your platform credentials."
      footer={
        <span>
          Trouble signing in?{" "}
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Reset your password
          </Link>
        </span>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-2">
          <Label>Sign in as</Label>
          <Tabs value={role} onValueChange={(v) => {
            const next = v as Role;
            setRole(next);
            setEmail(next === "admin" ? "ops@paygate.io" : "grace.mwangi@abcdistributors.co.ke");
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">Administrator</TabsTrigger>
              <TabsTrigger value="merchant">Merchant</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-md border border-destructive/25 bg-danger-soft px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitting ? "Signing in…" : "Sign in"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Demo environment — any password of 6+ characters works.
        </p>
      </form>
    </AuthLayout>
  );
}
