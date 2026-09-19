import type { ReactNode } from "react";
import { ArrowLeftRight, ShieldCheck } from "lucide-react";

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <div className="hidden flex-col justify-between bg-sidebar px-12 py-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ArrowLeftRight className="size-4" />
          </div>
          <span className="text-sm font-semibold text-sidebar-foreground">Paygate</span>
        </div>
        <div className="max-w-md space-y-5">
          <h2 className="text-3xl font-semibold leading-tight text-sidebar-foreground">
            One console for every provider, channel and collection.
          </h2>
          <p className="text-sm leading-relaxed text-sidebar-foreground/65">
            Onboard merchants, connect payment channels across providers and countries, and reconcile
            normalized transaction data in a single operational workspace.
          </p>
          <div className="grid gap-3 text-sm text-sidebar-foreground/70">
            {["Provider-agnostic channel management", "Unified transaction ledger", "Daily reconciliation with variance tracking"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-sidebar-primary" />
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
        <p className="text-xs text-sidebar-foreground/40">
          Sandbox environment · data shown is illustrative
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <ArrowLeftRight className="size-4" />
            </div>
            <span className="text-sm font-semibold">Paygate</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6 text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
