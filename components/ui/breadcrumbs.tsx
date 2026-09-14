import Link from "next/link";
import { Fragment } from "react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

// Editorial breadcrumb trail rendered above archive children (photo detail,
// series detail). Links keep 44px touch targets; the current page is plain
// text with aria-current.
export function Breadcrumbs({
  items,
  ariaLabel,
  className = "",
}: {
  items: BreadcrumbItem[];
  ariaLabel: string;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? (
                <span aria-hidden="true" className="font-mono text-[10px] text-[var(--color-text-muted)]">
                  /
                </span>
              ) : null}
              <li className="flex items-center">
                {item.href && !isCurrent ? (
                  <Link
                    href={item.href}
                    data-press-feedback
                    className="inline-flex min-h-11 items-center font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] underline decoration-transparent underline-offset-8 transition-colors hover:text-foreground hover:decoration-accent"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isCurrent ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center font-mono text-[10px] uppercase tracking-[0.16em] ${
                      isCurrent ? "text-foreground" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
