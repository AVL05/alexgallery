import { cn } from "@/lib/utils";
import type React from "react";

export function Metadata({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return <span className={cn("rv-meta", className)} {...props} />;
}

export function Tag({
  active = false,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & { active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center border px-2.5 font-mono text-[10px] uppercase tracking-[0.12em]",
        active
          ? "border-accent/50 bg-accent/10 text-accent"
          : "border-border text-[var(--color-text-muted)]",
        className,
      )}
      {...props}
    />
  );
}

export function PhotoIndex({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span className={cn("rv-index tabular-nums", className)}>
      {String(value).padStart(3, "0")}
    </span>
  );
}
