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
    <section id="about" className="rv-section bg-[var(--color-background)]">
      <Container>
        <div className="grid gap-14 md:grid-cols-12 md:gap-8 lg:gap-12">
          <Reveal className="md:col-span-7">
            <p className="rv-kicker">{about.label}</p>
            <h2 className="mt-6 max-w-[16ch] font-serif text-[clamp(2.4rem,5.5vw,5.5rem)] leading-[1.0] tracking-[-0.04em]">
              {home.manifesto.title}
            </h2>
            <p className="mt-8 max-w-xl text-[clamp(1.1rem,2vw,1.5rem)] leading-relaxed text-[var(--color-text-secondary)] md:mt-12">
              {home.manifesto.lead}
            </p>
          </Reveal>
          <Reveal className="md:col-span-4 md:col-start-9 md:self-end" delay={0.08}>
            <AboutBio about={about} locale={locale} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
