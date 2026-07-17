import { SectionMarker } from "@/components/home/section-marker";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import type { HomeDictionary } from "@/types/dictionary";
import Link from "next/link";
import { getCursorTargetAttributes } from "@/lib/interactions/cursor-target";

export function ClosingStatement({ dictionary }: { dictionary: HomeDictionary }) {
  return (
    <section id="closing-statement" className="rv-section bg-[var(--color-background)]">
      <Container>
        <Reveal className="border-t border-border pt-8">
          <SectionMarker current={8} label={dictionary.chapterLabel} />
          <h2 className="mt-12 max-w-[17ch] font-serif text-[clamp(2.7rem,7vw,7.4rem)] leading-[0.95] tracking-[-0.05em]">{dictionary.closing.title}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
            <p className="max-w-xl text-base leading-7 text-[var(--color-text-secondary)] md:col-span-7 md:text-lg md:leading-8">{dictionary.closing.description}</p>
            <div className="flex flex-wrap gap-7 md:col-span-5 md:justify-end">
              <Link href="#gallery" className="rv-editorial-link" data-press-feedback {...getCursorTargetAttributes({ type: "explore" })}>{dictionary.closing.archiveCta}</Link>
              <Link href="#contact" className="rv-editorial-link" data-press-feedback {...getCursorTargetAttributes({ type: "open" })}>{dictionary.closing.contactCta}</Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
