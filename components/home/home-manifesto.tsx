import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import { SectionMarker } from "@/components/home/section-marker";
import type { AboutDictionary, HomeDictionary } from "@/types/dictionary";

export function HomeManifesto({
  home,
  about,
}: {
  home: HomeDictionary;
  about: AboutDictionary;
}) {
  return (
    <section id="about" className="rv-section bg-[var(--color-background)]">
      <Container>
        <Reveal className="border-t border-border pt-8">
          <SectionMarker current={2} label={home.chapterLabel} />
        </Reveal>
        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-8">
            <h2 className="max-w-[15ch] font-serif text-[clamp(2.6rem,6vw,6.75rem)] leading-[0.98] tracking-[-0.045em]">
              {home.manifesto.title}
            </h2>
            <p className="mt-8 max-w-2xl text-[clamp(1.1rem,2vw,1.55rem)] leading-relaxed text-[var(--color-text-secondary)] md:mt-12">
              {home.manifesto.lead}
            </p>
          </Reveal>
          <Reveal className="self-end border-l border-border pl-6 lg:col-span-4 lg:pl-8" delay={0.08}>
            <p className="rv-meta text-accent">{about.role}</p>
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--color-text-secondary)] md:text-base">
              {about.body}
            </p>
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--color-text-muted)]">
              {home.manifesto.archiveNote}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
