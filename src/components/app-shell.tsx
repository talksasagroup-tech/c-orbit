import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Bell,
  Building2,
  Code2,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Scale,
  Settings,
  ShieldCheck,
  Webhook,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/merchants", label: "Merchants", icon: Building2 },
  { to: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/admin/channels", label: "Payment Channels", icon: CreditCard },
  { to: "/admin/reconciliation", label: "Reconciliation", icon: Scale },
  { to: "/admin/webhooks", label: "Webhooks", icon: Webhook },
  { to: "/admin/developers", label: "Developers", icon: Code2 },
  { to: "/admin/api-keys", label: "API Keys", icon: KeyRound },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

const merchantNav = [
  { to: "/merchant", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/merchant/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/merchant/channels", label: "Payment Channels", icon: CreditCard },
  { to: "/merchant/reconciliation", label: "Reconciliation", icon: Scale },
  { to: "/merchant/webhooks", label: "Webhooks", icon: Webhook },
  { to: "/merchant/developers", label: "Developers", icon: Code2 },
  { to: "/merchant/api-keys", label: "API Keys", icon: KeyRound },
  { to: "/merchant/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <div className="grid size-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <ArrowLeftRight className="size-4" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-sidebar-foreground">Paygate</p>
        <p className="text-[0.6875rem] uppercase tracking-wider text-sidebar-foreground/55">
          Payment Orchestration
        </p>
      </div>
    </div>
  );
}

function SidebarNav({ scope, onNavigate }: { scope: "admin" | "merchant"; onNavigate?: () => void }) {
  const items = scope === "admin" ? adminNav : merchantNav;
  return (
    <nav className="flex-1 space-y-0.5 px-3 pb-6">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: "exact" in item ? item.exact : false }}
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium" }}
        >
          <item.icon className="size-4 shrink-0" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({
  scope,
  children,
}: {
  scope: "admin" | "merchant";
  children: ReactNode;
}) {
  const session = useSession();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const impersonating = session.isImpersonating && scope === "merchant";
  const accountLabel = impersonating
    ? (session.merchantName ?? "Merchant")
    : scope === "admin"
      ? "Platform Administrator"
      : (session.merchantName ?? "Merchant");

  return (
    <div className="min-h-screen bg-background">
      {impersonating ? (
        <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-2 bg-warning px-4 py-2.5 text-sm text-warning-foreground">
          <span className="flex items-center gap-2 font-medium">
            <ShieldCheck className="size-4" />
            You are viewing {session.merchantName} as an administrator
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-7 border-warning-foreground/30 bg-warning-foreground/10 text-warning-foreground hover:bg-warning-foreground/20"
            onClick={() => {
              session.stopImpersonation();
              navigate({ to: "/admin/merchants" });
            }}
          >
            Exit impersonation
          </Button>
        </div>
      ) : null}

      <div className="flex">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-sidebar lg:flex">
          <Brand />
          <SidebarNav scope={scope} />
          <div className="border-t border-sidebar-border px-5 py-4 text-[0.6875rem] text-sidebar-foreground/50">
            {scope === "admin" ? "Admin workspace" : "Merchant workspace"}
          </div>
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              aria-label="Close navigation"
              className="absolute inset-0 bg-foreground/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative flex h-full w-64 flex-col bg-sidebar">
              <div className="flex items-center justify-between pr-3">
                <Brand />
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-sidebar-foreground hover:bg-sidebar-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <SidebarNav scope={scope} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="flex min-h-screen w-full flex-col lg:pl-60">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6">
            <Button size="icon" variant="ghost" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="size-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted-foreground">{pathname}</p>
            </div>
            <Button size="icon" variant="ghost" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-primary text-[0.625rem] font-semibold text-primary-foreground">
                    {accountLabel.slice(0, 1)}
                  </span>
                  <span className="hidden max-w-40 truncate sm:inline">{accountLabel}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
                  {session.email ?? "signed in"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={scope === "admin" ? "/admin/settings" : "/merchant/settings"}>Settings</Link>
                </DropdownMenuItem>
                {impersonating ? (
                  <DropdownMenuItem
                    onClick={() => {
                      session.stopImpersonation();
                      navigate({ to: "/admin/merchants" });
                    }}
                  >
                    Exit impersonation
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    session.signOut();
                    navigate({ to: "/login" });
                  }}
                >
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className={cn("mx-auto w-full max-w-[1400px] flex-1 space-y-6 px-4 py-6 sm:px-6")}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
