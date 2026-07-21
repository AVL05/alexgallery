import type { Metadata } from "next";
import { rootLocaleFallbackScript } from "@/lib/i18n/locale-routing";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/en",
    languages: { es: "/es", en: "/en", "x-default": "/en" },
  },
};

export default function RootPage() {
  return <script dangerouslySetInnerHTML={{ __html: rootLocaleFallbackScript }} />;
}
