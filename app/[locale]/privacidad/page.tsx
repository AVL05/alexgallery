import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Container, PageShell } from "@/components/ui/layout";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/types/dictionary";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = `/${locale}/privacidad`;

  return {
    title: locale === "es" ? "Privacidad" : "Privacy",
    description:
      locale === "es"
        ? "Cómo raw.vives trata los datos de navegación y de los formularios."
        : "How raw.vives handles browsing and form data.",
    alternates: {
      canonical,
      languages: {
        "es-ES": "/es/privacidad",
        "en-US": "/en/privacidad",
        "x-default": "/es/privacidad",
      },
    },
    openGraph: { locale: locale === "es" ? "es_ES" : "en_US", url: canonical },
    robots: { index: false, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);
  const spanish = locale === "es";

  const sections = spanish
    ? [
        {
          title: "Responsable y alcance",
          body: "Alex Vicente es responsable de este archivo visual. Esta política cubre la navegación pública y los formularios de contacto y licencias.",
        },
        {
          title: "Datos que se tratan",
          body: "Los formularios transmiten el nombre, correo electrónico, mensaje y, cuando corresponde, empresa, fotografía solicitada y uso previsto. No se solicitan datos sensibles ni archivos adjuntos.",
        },
        {
          title: "Finalidad y conservación",
          body: "Los datos se usan únicamente para responder a la consulta o gestionar una solicitud de licencia. Las respuestas se conservan en el correo del responsable durante el tiempo necesario para atender la conversación y obligaciones aplicables.",
        },
        {
          title: "Proveedor del formulario",
          body: "Web3Forms procesa el envío y lo reenvía al correo del responsable. Según su documentación, no almacena las entregas del formulario, puede mantener logs técnicos con datos personales hasta dos meses y opera infraestructura en Estados Unidos.",
        },
        {
          title: "Almacenamiento local y cookies",
          body: "El sitio no instala cookies ni usa analítica. sessionStorage recuerda durante la sesión si la intro ya se mostró y conserva temporalmente el contexto de retorno del archivo; no identifica al visitante y se elimina al cerrar la sesión del navegador o al expirar el contexto.",
        },
        {
          title: "Derechos y contacto",
          body: "Puedes solicitar acceso, rectificación o supresión de los datos enviados escribiendo a alexviclop@gmail.com. También puedes usar ese correo sin enviar el formulario web.",
        },
      ]
    : [
        {
          title: "Controller and scope",
          body: "Alex Vicente is responsible for this visual archive. This policy covers public browsing and the contact and licensing forms.",
        },
        {
          title: "Data processed",
          body: "The forms send name, email, message and, where applicable, company, requested photograph and intended use. Sensitive data and file uploads are not requested.",
        },
        {
          title: "Purpose and retention",
          body: "Data is used only to reply to an enquiry or handle a licensing request. Replies remain in the controller's email for as long as needed to manage the conversation and applicable obligations.",
        },
        {
          title: "Form provider",
          body: "Web3Forms processes the submission and forwards it to the controller's email. Its documentation states that it does not store form submissions, may retain technical logs containing personal data for up to two months, and runs infrastructure in the United States.",
        },
        {
          title: "Local storage and cookies",
          body: "The site sets no cookies and uses no analytics. sessionStorage remembers whether the intro has played in the current session and temporarily stores archive return context; it does not identify the visitor and disappears when the browser session closes or the context expires.",
        },
        {
          title: "Rights and contact",
          body: "You can request access, correction or deletion of submitted data by emailing alexviclop@gmail.com. You can also use that address without submitting the web form.",
        },
      ];

  return (
    <PageShell as="div">
      <Navigation
        dictionary={dictionary.nav}
        currentLocale={locale}
        isHome={false}
        currentPath={`/${locale}/privacidad`}
      />
      <main id="main-content" tabIndex={-1}>
        <Container className="pb-20 pt-32 sm:pt-36 lg:pb-28">
          <Link href={`/${locale}`} className="rv-editorial-link mb-12">
            {spanish ? "Volver al inicio" : "Back to home"}
          </Link>
          <header className="mb-16 max-w-4xl border-b border-border pb-12 sm:mb-20 sm:pb-16">
            <p className="rv-kicker mb-5">raw.vives / Privacy</p>
            <h1 className="rv-page-title mb-7">{spanish ? "Privacidad" : "Privacy"}</h1>
            <p className="rv-intro">
              {spanish
                ? "Información clara sobre los datos necesarios para responder a tus solicitudes."
                : "Clear information about the data needed to respond to your requests."}
            </p>
          </header>
          <div className="max-w-4xl">
            {sections.map((section) => (
              <section key={section.title} className="border-b border-border py-10 sm:py-12">
                <h2 className="rv-card-title mb-5">{section.title}</h2>
                <p className="rv-body">{section.body}</p>
              </section>
            ))}
            <p className="rv-body-sm pt-10 text-[var(--color-text-muted)]">
              {spanish ? "Última actualización: 17 de julio de 2026." : "Last updated: 17 July 2026."}{" "}
              <a
                className="rv-editorial-link"
                href="https://docs.web3forms.com/getting-started/faq"
                target="_blank"
                rel="noreferrer"
              >
                {spanish ? "Privacidad de Web3Forms" : "Web3Forms privacy information"}
              </a>
            </p>
          </div>
        </Container>
      </main>
      <Footer currentLocale={locale} dictionary={dictionary.nav} />
    </PageShell>
  );
}
