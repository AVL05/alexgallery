import { cn } from "@/lib/utils";
import type React from "react";

// Editorial metadata rows (photo facts, series period/location, archive
// stats): label in rv-meta tone with a value line below.
export function MetaList({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"dl">) {
  return (
    <dl className={cn("grid grid-cols-2", className)} {...props}>
      {children}
    </dl>
  );
}

export function MetaItem({
  label,
  children,
  className,
  valueClassName,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={className}>
      <dt className="rv-meta">{label}</dt>
      <dd className={cn("mt-2 text-sm", valueClassName)}>{children}</dd>
    </div>
  );
}
