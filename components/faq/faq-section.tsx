import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/layout";
import type { FaqDictionary } from "@/types/dictionary";

// Archive FAQ: licensing and personal context. Native details/summary
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
    <section aria-labelledby="faq-title" className="rv-section overflow-hidden bg-[var(--color-background-secondary)]">
      <Container>
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <h2 id="faq-title" className="max-w-[14ch] font-serif text-[clamp(1.5rem,2.5vw,2rem)] leading-tight tracking-[-0.025em]">
              {dictionary.title}
            </h2>
            <p className="rv-body-sm mt-5">{dictionary.description}</p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            {dictionary.items.map((item) => (
              <details key={item.q} className="group border-b border-border first:border-t">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-sm leading-relaxed transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-[var(--color-text-muted)] transition-transform group-open:rotate-180" />
                </summary>
                <p className="rv-body-sm max-w-2xl pb-6 text-[var(--color-text-secondary)]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </section>
  );
}
