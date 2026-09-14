import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/layout";
import type { FaqDictionary } from "@/types/dictionary";

// Pre-contact FAQ: licensing, uses and collaborations. Native details/summary
// keeps it usable without JavaScript; FAQPage schema mirrors the copy.
export function FaqSection({ dictionary }: { dictionary: FaqDictionary }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dictionary.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <section aria-labelledby="faq-title" className="rv-section overflow-hidden bg-background">
      <Container>
        <div className="max-w-4xl">
          <p className="rv-kicker mb-5">raw.vives / {dictionary.eyebrow}</p>
          <h2 id="faq-title" className="max-w-[14ch] font-serif text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.04em]">
            {dictionary.title}
          </h2>
          <p className="rv-intro mt-6">{dictionary.description}</p>
        </div>
        <div className="mt-12 max-w-3xl md:mt-16">
          {dictionary.items.map((item) => (
            <details key={item.q} className="group border-b border-border first:border-t">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left font-serif text-lg leading-snug tracking-[-0.01em] transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-[var(--color-text-muted)] transition-transform group-open:rotate-180" />
              </summary>
              <p className="rv-body-sm max-w-2xl pb-6 text-[var(--color-text-secondary)]">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </section>
  );
}
