import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { currentMerchantId, getMerchant } from "./mock-data";
import type { Role } from "./types";

interface SessionState {
  role: Role | null;
  email: string | null;
  impersonatingMerchantId: string | null;
}

interface SessionValue extends SessionState {
  ready: boolean;
  merchantId: string | null;
  merchantName: string | null;
  isImpersonating: boolean;
  signIn: (role: Role, email: string) => void;
  signOut: () => void;
  startImpersonation: (merchantId: string) => void;
  stopImpersonation: () => void;
}

const STORAGE_KEY = "orchestra.session";

const SessionContext = createContext<SessionValue | null>(null);

const empty: SessionState = { role: null, email: null, impersonatingMerchantId: null };

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...empty, ...JSON.parse(raw) });
    } catch {
      /* ignore malformed session */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: SessionState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo<SessionValue>(() => {
    const merchantId =
      state.role === "merchant"
        ? currentMerchantId
        : state.impersonatingMerchantId
          ? state.impersonatingMerchantId
          : null;
    return {
      ...state,
      ready,
      merchantId,
      merchantName: merchantId ? (getMerchant(merchantId)?.name ?? null) : null,
      isImpersonating: state.role === "admin" && !!state.impersonatingMerchantId,
      signIn: (role, email) => persist({ role, email, impersonatingMerchantId: null }),
      signOut: () => {
        persist(empty);
      },
      startImpersonation: (merchantId) => persist({ ...state, impersonatingMerchantId: merchantId }),
      stopImpersonation: () => persist({ ...state, impersonatingMerchantId: null }),
    };
  }, [state, ready, persist]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
