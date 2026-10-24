"use client";

import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Container, PageShell } from "@/components/ui/layout";
import { useMotion } from "@/components/motion/motion-provider";
import { motionDuration, motionEase, motionStagger } from "@/lib/motion/config";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { siteUrl } from "@/lib/site-config";
import type { Locale, NavDictionary } from "@/types/dictionary";
import { ArrowRight, FileCheck2, Images, Newspaper, Store } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

// Conversion page for photography licensing: license types, request process
// and a deep link into the contact license tab (?form=license). It stays
// clear of the FAQ copy: no Q&A here, only offer and next step.
export function LicenciasClient({
  locale,
  navigation,
}: {
  locale: Locale;
  navigation: NavDictionary;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spanish = locale === "es";
  const { prefersReducedMotion } = useMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(".license-reveal", { opacity: 1, y: 0, x: 0 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: motionEase.standard, duration: motionDuration.normal } })
        .from(".license-reveal", { opacity: 0, y: 24, stagger: motionStagger.normal });
    },
    { dependencies: [prefersReducedMotion], scope: containerRef, revertOnUpdate: true },
  );

  const title = spanish ? "Licenciar una fotografía" : "License a photograph";
  const types = [
    {
      icon: Images,
      name: spanish ? "Personal" : "Personal",
      description: spanish
        ? "Usos no comerciales: impresiones para tu hogar, regalos o proyectos propios sin difusión pública."
        : "Non-commercial uses: prints for your home, gifts or personal projects without public distribution.",
    },
    {
      icon: Newspaper,
      name: spanish ? "Editorial" : "Editorial",
      description: spanish
        ? "Prensa, publicaciones, blogs y documentales donde la imagen ilustra una historia con crédito visible."
        : "Press, publications, blogs and documentaries where the image illustrates a story with visible credit.",
    },
    {
      icon: Store,
      name: spanish ? "Comercial" : "Commercial",
      description: spanish
        ? "Publicidad, marcas, campañas y productos. Condiciones a medida según medio, duración y alcance."
        : "Advertising, brands, campaigns and products. Tailored terms by medium, duration and reach.",
    },
  ];
  const steps = spanish
    ? [
        { name: "Elige la foto", detail: "Anota el ID o el título tal como aparece en el archivo." },
        { name: "Cuéntame el uso", detail: "Tipo de licencia, medio, duración y alcance previsto." },
        { name: "Hablamos de las condiciones", detail: "Reviso la consulta en mi tiempo libre y acordamos el uso antes de compartir el archivo." },
      ]
    : [
        { name: "Pick the photo", detail: "Note the ID or title exactly as shown in the archive." },
        { name: "Describe the use", detail: "License type, medium, duration and expected reach." },
        { name: "Discuss the terms", detail: "I review requests in my free time, and we agree on the use before I share the file." },
      ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        description: spanish
          ? "Tipos de licencia fotográfica y proceso de solicitud en raw.vives."
          : "Photography license types and request process at raw.vives.",
        url: `${siteUrl}/${locale}/licencias`,
        inLanguage: locale,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: navigation.home, item: `${siteUrl}/${locale}` },
          { "@type": "ListItem", position: 2, name: title },
        ],
      },
    ],
  };

  return (
    <PageShell as="div">
      <div ref={containerRef}>
        <Navigation dictionary={navigation} currentLocale={locale} isHome={false} currentPath={`/${locale}/licencias`} />
        <main id="main-content" tabIndex={-1}>
          <Container className="pb-20 pt-32 sm:pt-36 lg:pb-28">
            <Breadcrumbs
              ariaLabel={navigation.breadcrumb}
              items={[
                { label: navigation.home, href: `/${locale}` },
                { label: title },
              ]}
              className="license-reveal mb-10"
            />

            <header className="license-reveal mb-16 max-w-4xl border-b border-border pb-12 sm:mb-20 sm:pb-16">
              <p className="rv-kicker mb-5">raw.vives / {navigation.licensing}</p>
              <h1 className="rv-page-title mb-7">{title}</h1>
              <p className="rv-intro">
                {spanish
                  ? "La fotografía es mi afición. Si quieres usar una imagen del archivo, cuéntame la idea y consultamos las condiciones."
                  : "Photography is my hobby. If you'd like to use an image from the archive, tell me your idea and we can discuss the terms."}
              </p>
            </header>

            <div className="max-w-4xl">
              <h2 className="license-reveal rv-card-title mb-8">
                {spanish ? "Tipos de licencia" : "License types"}
              </h2>
              <div className="grid gap-px border border-border bg-[var(--color-border)] sm:grid-cols-3">
                {types.map((type) => (
                  <div key={type.name} className="license-reveal bg-background p-8">
                    <type.icon aria-hidden="true" className="size-6 text-accent" />
                    <h3 className="mt-6 font-serif text-xl leading-tight tracking-[-0.02em]">{type.name}</h3>
                    <p className="rv-body-sm mt-4 text-[var(--color-text-secondary)]">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 max-w-4xl sm:mt-20">
              <h2 className="license-reveal rv-card-title mb-8">
                {spanish ? "Cómo solicitarla" : "How to request one"}
              </h2>
              <ol className="border-t border-border">
                {steps.map((step, index) => (
                  <li key={step.name} className="license-reveal grid gap-2 border-b border-border py-6 sm:grid-cols-12 sm:gap-6">
                    <span aria-hidden="true" className="rv-index sm:col-span-2">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="sm:col-span-10">
                      <h3 className="font-serif text-lg leading-snug">{step.name}</h3>
                      <p className="rv-body-sm mt-2 text-[var(--color-text-secondary)]">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="license-reveal mt-16 flex max-w-4xl flex-col gap-6 border-t border-border pt-12 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href={`/${locale}?form=license#contact`}>
                    {spanish ? "Solicitar licencia" : "Request a license"}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href={`/${locale}/politica-uso`}>
                    {spanish ? "Leer condiciones de uso" : "Read terms of use"}
                  </Link>
                </Button>
              </div>
              <p className="rv-body-sm flex items-center gap-2 text-[var(--color-text-muted)]">
                <FileCheck2 aria-hidden="true" className="size-4" />
                {spanish ? "Sin compromiso: primero la propuesta." : "No commitment: proposal first."}
              </p>
            </div>
          </Container>
        </main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Footer currentLocale={locale} dictionary={navigation} />
      </div>
    </PageShell>
  );
}
