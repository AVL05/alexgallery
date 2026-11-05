import { AboutBio } from "@/components/about/about-bio";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";
import { getArchiveSummary } from "@/lib/home/selectors";
import type { AboutDictionary, HomeDictionary, Locale } from "@/types/dictionary";

// End credits: the authorial statement set like a closing title card, then
// the plain facts of the archive as a credit roll. Every line comes from the
// dictionary or the catalogue; nothing is invented.
export function HomeManifesto({
  home,
  about,
  locale,
}: {
  home: HomeDictionary;
  about: AboutDictionary;
  locale: Locale;
}) {
  const summary = getArchiveSummary();
  const credits = [
    [home.credits.photography, "Alex Vicente"],
    [home.credits.archive, `${summary.total} ${home.series.photographs} · ${summary.startYear}–${summary.endYear}`],
    [home.credits.from, about.location],
    [home.credits.language, home.credits.languages],
  ] as const;

  return (
    <section id="about" aria-labelledby="about-title" className="rv-section rv-credits">
      <Container>
        <Reveal className="rv-credits__card">
          <p className="rv-slate justify-center">{home.credits.label}</p>
          <p className="rv-credits__statement">{home.manifesto.title}</p>
          <p className="rv-credits__lead">{home.manifesto.lead}</p>
        </Reveal>

        <div className="rv-credits__body">
          <Reveal>
            <h2 id="about-title" className="rv-home-heading">{about.title}</h2>
            <dl className="rv-credits__roll">
              {credits.map(([role, value]) => (
                <div key={role}>
                  <dt>{role}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.08}>
            <AboutBio about={about} locale={locale} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
