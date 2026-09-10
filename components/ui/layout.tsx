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


