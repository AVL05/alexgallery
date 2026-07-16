"use client";

import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Container, PageShell } from "@/components/ui/layout";
import { useMotion } from "@/components/motion/motion-provider";
import { motionDuration, motionEase, motionStagger } from "@/lib/motion/config";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import type { Locale, NavDictionary } from "@/types/dictionary";
import { ArrowLeft, Award, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export function PoliticaClient({
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
        gsap.set(".policy-reveal", { opacity: 1, y: 0, x: 0 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: motionEase.standard, duration: motionDuration.normal } })
        .from(".policy-back", { opacity: 0, x: -16 })
        .from(".policy-reveal", { opacity: 0, y: 24, stagger: motionStagger.normal }, "-=0.2");
    },
    { dependencies: [prefersReducedMotion], scope: containerRef, revertOnUpdate: true },
  );

  return (
      <PageShell as="div">
        <div ref={containerRef}>
          <Navigation dictionary={navigation} currentLocale={locale} isHome={false} currentPath={`/${locale}/politica-uso`} />
          <main>
          <Container className="pb-20 pt-32 sm:pt-36 lg:pb-28">
            <Link href={`/${locale}`} className="policy-back rv-editorial-link mb-12">
              <ArrowLeft aria-hidden="true" className="size-4" />
              {spanish ? "Volver al inicio" : "Back to home"}
            </Link>

            <header className="policy-reveal mb-16 max-w-4xl border-b border-border pb-12 sm:mb-20 sm:pb-16">
              <p className="rv-kicker mb-5">raw.vives / Legal</p>
              <h1 className="rv-page-title mb-7">
                {spanish ? "Política de uso" : "Usage policy"}
              </h1>
              <p className="rv-intro">
                {spanish
                  ? "Términos y condiciones de uso de las fotografías de Alex Vicente."
                  : "Terms and conditions for the use of Alex Vicente's photographs."}
              </p>
            </header>

            <div className="max-w-4xl space-y-0">
              <section className="policy-reveal grid gap-5 border-b border-border py-10 sm:grid-cols-[3rem_1fr] sm:py-12">
                <Award aria-hidden="true" className="size-6 text-accent" />
                <div>
                  <h2 className="rv-card-title mb-5">© Copyright</h2>
                  <p className="rv-body">
                    {spanish
                      ? "Todas las fotografías mostradas en esta galería son propiedad intelectual de Alex Vicente y están protegidas por las leyes de copyright internacionales. Cada imagen contiene metadatos de copyright embebidos con la información del autor."
                      : "All photographs shown in this gallery are the intellectual property of Alex Vicente and are protected by international copyright laws. Each image contains embedded copyright metadata with author information."}
                  </p>
                </div>
              </section>

              <section className="policy-reveal grid gap-5 border-b border-border py-10 sm:grid-cols-[3rem_1fr] sm:py-12">
                <Download aria-hidden="true" className="size-6 text-[var(--color-error)]" />
                <div>
                  <h2 className="rv-card-title mb-5">
                    {spanish ? "Uso no autorizado" : "Unauthorized use"}
                  </h2>
                  <p className="rv-body mb-4">
                    {spanish ? "Queda estrictamente prohibido:" : "Strictly prohibited:"}
                  </p>
                  <ul className="rv-body list-disc space-y-3 pl-5 marker:text-[var(--color-text-muted)]">
                    <li>{spanish ? "Descargar, copiar o reproducir las imágenes sin autorización expresa" : "Downloading, copying, or reproducing images without express authorization"}</li>
                    <li>{spanish ? "Uso comercial sin licencia" : "Commercial use without a license"}</li>
                    <li>{spanish ? "Modificar, editar o manipular las fotografías" : "Modifying, editing, or manipulating the photographs"}</li>
                    <li>{spanish ? "Redistribuir o publicar en otros medios" : "Redistributing or publishing in other media"}</li>
                    <li>{spanish ? "Eliminar o alterar los metadatos de copyright" : "Removing or altering copyright metadata"}</li>
                  </ul>
                </div>
              </section>

              <section className="policy-reveal grid gap-5 py-10 sm:grid-cols-[3rem_1fr] sm:py-12">
                <Share2 aria-hidden="true" className="size-6 text-accent" />
                <div>
                  <h2 className="rv-card-title mb-5">
                    {spanish ? "Licencias disponibles" : "Available licenses"}
                  </h2>
                  <p className="rv-body mb-5">
                    {spanish
                      ? "Si quieres utilizar una fotografía en un proyecto comercial, editorial o publicitario, solicita permiso antes de publicarla."
                      : "If you want to use a photograph in a commercial, editorial, or advertising project, request permission before publishing it."}
                  </p>
                  <Link href={`/${locale}#contact`} className="rv-editorial-link">
                    {spanish ? "Abrir formulario de licencias" : "Open licensing form"}
                  </Link>
                </div>
              </section>
            </div>
          </Container>
          </main>
          <Footer currentLocale={locale} dictionary={navigation} />
        </div>
      </PageShell>
  );
}
