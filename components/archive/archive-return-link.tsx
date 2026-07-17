"use client";

import { useArchiveReturnHref } from "@/hooks/use-archive-return-href";
import type { Locale } from "@/types/dictionary";
import Link from "next/link";
import type { ReactNode } from "react";

export function ArchiveReturnLink({
  locale,
  photoId,
  fallbackHref,
  className,
  children,
}: {
  locale: Locale;
  photoId: number;
  fallbackHref: string;
  className?: string;
  children: ReactNode;
}) {
  const href = useArchiveReturnHref(locale, photoId, fallbackHref);
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
