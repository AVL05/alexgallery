import { socialImage } from "@/lib/site-config";
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
        "x-default": "/en/privacidad",
      },
    },
    openGraph: { locale: locale === "es" ? "es_ES" : "en_US", url: canonical, images: [socialImage] },
    twitter: {
      card: "summary_large_image",
      title: locale === "es" ? "Privacidad | raw.vives" : "Privacy | raw.vives",
      description: locale === "es" ? "Cómo raw.vives trata los datos de navegación y de los formularios." : "How raw.vives handles browsing and form data.",
      images: [socialImage.url],
    },
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
          body: "Los campos preparan un borrador con nombre, correo electrónico, mensaje y, cuando corresponde, empresa, fotografía y uso previsto. La web no envía ni almacena estos datos. Solo se reciben si envías el correo desde tu aplicación.",
        },
        {
          title: "Finalidad y conservación",
          body: "Los datos se usan únicamente para responder a la consulta o gestionar una solicitud de licencia. Las respuestas se conservan en el correo del responsable durante el tiempo necesario para atender la conversación y obligaciones aplicables.",
        },
        {
          title: "Aplicación de correo",
          body: "Los enlaces mailto abren tu aplicación de correo con un borrador. Tú decides si lo envías. El envío se realiza mediante tu proveedor de correo, sujeto a sus propias condiciones y política de privacidad.",
        },
        {
          title: "Almacenamiento local y cookies",
          body: "El sitio usa una cookie funcional raw-vives-locale, con duración máxima de un año, para recordar exclusivamente la elección ES o EN. No contiene datos personales ni requiere un banner. sessionStorage recuerda durante la sesión si la intro ya se mostró y conserva temporalmente el contexto de retorno del archivo; no identifica al visitante.",
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
          body: "The fields prepare a draft containing name, email, message and, where applicable, company, photograph and intended use. This website does not send or store these details. They are only received if you send the email from your application.",
        },
        {
          title: "Purpose and retention",
          body: "Data is used only to reply to an enquiry or handle a licensing request. Replies remain in the controller's email for as long as needed to manage the conversation and applicable obligations.",
        },
        {
          title: "Email application",
          body: "Mailto links open your email application with a draft. You decide whether to send it. Delivery uses your email provider, subject to its own terms and privacy policy.",
        },
        {
          title: "Local storage and cookies",
          body: "The site uses the functional raw-vives-locale cookie for up to one year to remember only the ES or EN choice. It contains no personal data and requires no banner. sessionStorage remembers whether the intro has played and temporarily stores archive return context; it does not identify the visitor.",
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
            <p className="rv-kicker mb-5">raw.vives / {spanish ? "Privacidad" : "Privacy"}</p>
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
              {spanish ? "Última actualización: 15 de octubre de 2026." : "Last updated: 15 October 2026."}{" "}

            </p>
          </div>
        </Container>
      </main>
      <Footer currentLocale={locale} dictionary={dictionary.nav} />
    </PageShell>
  );
}
