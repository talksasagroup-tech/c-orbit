import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { RequireRole } from "@/components/require-role";
import { useSession } from "@/lib/session";
import { currentMerchantId } from "@/lib/mock-data";

export function AdminPage({ children }: { children: ReactNode }) {
  return (
    <RequireRole role="admin">
      <AppShell scope="admin">{children}</AppShell>
    </RequireRole>
  );
}

export function MerchantPage({ children }: { children: (merchantId: string) => ReactNode }) {
  return (
    <RequireRole role="merchant">
      <AppShell scope="merchant">
        <MerchantScope>{children}</MerchantScope>
      </AppShell>
    </RequireRole>
  );
}

function MerchantScope({ children }: { children: (merchantId: string) => ReactNode }) {
  const session = useSession();
  return <>{children(session.merchantId ?? currentMerchantId)}</>;
}
