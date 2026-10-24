import { AboutBio } from "@/components/about/about-bio";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import type { AboutDictionary, HomeDictionary, Locale } from "@/types/dictionary";

export function HomeManifesto({
  home,
  about,
  locale,
}: {
  home: HomeDictionary;
  about: AboutDictionary;
  locale: Locale;
}) {
  return (
    <section id="about" className="rv-section border-t border-border bg-[var(--color-background)]">
      <Container>
        <div className="grid gap-14 md:grid-cols-12 md:gap-8 lg:gap-12">
          <Reveal className="md:col-span-5">
            <p className="rv-kicker">{about.label}</p>
            <h2 className="rv-home-heading mt-5">
              {about.title}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
              {home.manifesto.lead}
            </p>
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7" delay={0.08}>
            <AboutBio about={about} locale={locale} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
