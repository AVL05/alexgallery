import { PhotoProcessComparison } from "@/components/photo-process/photo-process-comparison";
import type { Locale, PhotoProcessDictionary } from "@/types/dictionary";
import type { ResolvedPhotoProcess } from "@/types/photo-process";

export function PhotoProcessSection({ process, locale, dictionary }: {
  process: ResolvedPhotoProcess | null;
  locale: Locale;
  dictionary: PhotoProcessDictionary;
}) {
  if (!process) return null;
  const notes = process.notes?.[locale] || process.notes?.es;
  const steps = [...(process.steps || [])].sort((a, b) => a.order - b.order);
  return <section aria-labelledby="photo-process-title" className="mt-20 border-y border-border py-12 lg:mt-28 lg:py-20">
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <header className="lg:col-span-3">
        <p className="rv-kicker">05 / 08</p>
        <h2 id="photo-process-title" className="rv-section-title mt-5">{dictionary.title}</h2>
        <p className="rv-body-sm mt-5">{dictionary.intro}</p>
      </header>
      <div className="lg:col-span-9"><PhotoProcessComparison process={process} locale={locale} dictionary={dictionary} /></div>
    </div>
    {(notes || steps.length > 0) && <div className="mt-12 grid gap-8 border-t border-border pt-10 lg:grid-cols-12">
      {notes && <p className="rv-body lg:col-span-5">{notes}</p>}
      {steps.length > 0 && <ol className="space-y-6 lg:col-span-6 lg:col-start-7">
        {steps.map((step, index) => <li key={step.id} className="grid grid-cols-[2rem_1fr] gap-4 border-b border-border pb-6">
          <span className="rv-index">{String(index + 1).padStart(2, "0")}</span>
          <div><h3 className="rv-card-title">{step.title[locale] || step.title.es}</h3><p className="rv-body-sm mt-2">{step.description[locale] || step.description.es}</p>{step.tool && <p className="rv-meta mt-3">{dictionary.tools}: {step.tool[locale] || step.tool.es}</p>}</div>
        </li>)}
      </ol>}
    </div>}
  </section>;
}
