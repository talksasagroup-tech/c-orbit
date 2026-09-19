import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export type Scope = "admin" | "merchant";

export function TransactionLink({
  scope,
  id,
  children,
  className,
}: {
  scope: Scope;
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return scope === "admin" ? (
    <Link to="/admin/transactions/$transactionId" params={{ transactionId: id }} className={className}>
      {children}
    </Link>
  ) : (
    <Link to="/merchant/transactions/$transactionId" params={{ transactionId: id }} className={className}>
      {children}
    </Link>
  );
}

export function ChannelLink({
  scope,
  id,
  children,
  className,
}: {
  scope: Scope;
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return scope === "admin" ? (
    <Link to="/admin/channels/$channelId" params={{ channelId: id }} className={className}>
      {children}
    </Link>
  ) : (
    <Link to="/merchant/channels/$channelId" params={{ channelId: id }} className={className}>
      {children}
    </Link>
  );
}

export function MerchantLink({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link to="/admin/merchants/$merchantId" params={{ merchantId: id }} className={className}>
      {children}
    </Link>
  );
}
