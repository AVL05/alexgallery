import { developerUrl, instagramUrl } from "@/lib/site-config";
import type { AboutDictionary, Locale } from "@/types/dictionary";

// Personal bio column: role, short texts, location and secondary links.
// Used on Home (#about) and reusable for a future /about page.
export function AboutBio({
  about,
  locale,
}: {
  about: AboutDictionary;
  locale: Locale;
}) {
  const externalNote =
    locale === "es" ? "(abre en una pestaña nueva)" : "(opens in a new tab)";
  return (
    <div>
      <p className="rv-meta text-accent">{about.role}</p>
      <p className="mt-5 max-w-md text-sm leading-7 text-[var(--color-text-secondary)] md:text-base">
        {about.body}
      </p>
      <p className="mt-5 max-w-md text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
        {about.body2}
      </p>
      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          data-press-feedback
          className="rv-editorial-link"
        >
          Instagram
          <span className="sr-only"> {externalNote}</span>
        </a>
        <a
          href={developerUrl}
          target="_blank"
          rel="noreferrer"
          data-press-feedback
          className="rv-editorial-link text-[var(--color-text-secondary)]"
        >
          aleviclop.dev
          <span className="sr-only"> {externalNote}</span>
        </a>
      </div>
      <p className="rv-meta mt-8">{about.location}</p>
    </div>
  );
}
