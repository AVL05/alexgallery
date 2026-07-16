import { cn } from "@/lib/utils";
import type React from "react";

type ElementProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function PageShell<T extends React.ElementType = "main">({
  as,
  className,
  children,
  ...props
}: ElementProps<T>) {
  const Component = as || "main";
  return (
    <Component
      className={cn("min-h-screen bg-background text-foreground", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Container<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...props
}: ElementProps<T>) {
  const Component = as || "div";
  return (
    <Component className={cn("rv-container", className)} {...props}>
      {children}
    </Component>
  );
}

export function EditorialContainer<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...props
}: ElementProps<T>) {
  const Component = as || "div";
  return (
    <Component className={cn("rv-editorial-container", className)} {...props}>
      {children}
    </Component>
  );
}

export function Section<T extends React.ElementType = "section">({
  as,
  className,
  children,
  ...props
}: ElementProps<T>) {
  const Component = as || "section";
  return (
    <Component className={cn("rv-section", className)} {...props}>
      {children}
    </Component>
  );
}

export function Stack({
  gap = "var(--space-6)",
  className,
  children,
  style,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { gap?: string }) {
  return (
    <div
      className={cn("flex flex-col", className)}
      style={{ gap, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Cluster({
  gap = "var(--space-4)",
  className,
  children,
  style,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { gap?: string }) {
  return (
    <div
      className={cn("flex flex-wrap items-center", className)}
      style={{ gap, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Grid({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("grid", className)} {...props}>
      {children}
    </div>
  );
}

export function Divider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"hr">) {
  return <hr className={cn("rv-divider", className)} {...props} />;
}

export function ScreenReaderOnly({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]",
        className,
      )}
      {...props}
    />
  );
}
