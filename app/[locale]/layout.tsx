import { InteractionBootstrap } from "@/components/interactions/interaction-bootstrap";
import { DocumentLanguage } from "@/components/document-language";
import { getDictionary, isLocale, locales } from "@/lib/dictionary";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return (
    <>
      <DocumentLanguage locale={locale} />
      <InteractionBootstrap dictionary={dictionary.cursor} />
      {children}
    </>
  );
}
