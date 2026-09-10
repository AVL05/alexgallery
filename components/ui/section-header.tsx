import { cn } from "@/lib/utils";
import type React from "react";

// Editorial page/section header: eyebrow + display title + intro. Covers the
// two treatments used today (series index page, archive section) so future
// work/archive/films/about/contact pages share one base.
const titleTones = {
  page: "mt-8 max-w-[12ch] font-serif text-[clamp(3.2rem,8vw,8rem)] leading-[0.9] tracking-[-0.05em]",
  section: "rv-section-title mt-5 max-w-[12ch] text-[clamp(3rem,7vw,7rem)]",
} as const;

const introTones = {
  page: "mt-8 max-w-2xl text-lg leading-8 text-[var(--color-text-secondary)]",
  section: "rv-intro mt-6 max-w-2xl",
} as const;

export function SectionHeader({
  eyebrow,
  title,
  intro,
  as: Tag = "h1",
  tone = "page",
  titleId,
  className,
  titleClassName,
  introClassName,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  intro?: React.ReactNode;
  as?: "h1" | "h2";
  tone?: keyof typeof titleTones;
  titleId?: string;
  className?: string;
  titleClassName?: string;
  introClassName?: string;
}) {
  return (
    <header className={cn("border-t border-border pt-8", className)}>
      {eyebrow ? <p className="rv-kicker">{eyebrow}</p> : null}
      <Tag id={titleId} className={cn(titleTones[tone], titleClassName)}>
        {title}
      </Tag>
      {intro ? <p className={cn(introTones[tone], introClassName)}>{intro}</p> : null}
    </header>
  );
}
