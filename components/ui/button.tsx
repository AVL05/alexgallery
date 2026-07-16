import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-transparent px-5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-[background-color,border-color,color,opacity,transform] duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-foreground hover:bg-[var(--color-accent-strong)] active:translate-y-px",
        destructive:
          "bg-destructive text-background hover:brightness-110",
        outline:
          "border-border bg-transparent text-foreground hover:border-[var(--color-border-strong)] hover:bg-[var(--color-hover)]",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-elevated)]",
        ghost:
          "text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-foreground",
        link: "min-h-11 px-0 text-foreground underline decoration-border underline-offset-8 hover:text-accent hover:decoration-accent",
      },
      size: {
        default: "min-h-11 px-5",
        sm: "min-h-11 px-4 text-[10px]",
        lg: "min-h-12 px-7",
        icon: "size-11 p-0",
        "icon-sm": "size-11 p-0",
        "icon-lg": "size-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
