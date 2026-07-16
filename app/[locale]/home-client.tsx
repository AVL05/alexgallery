"use client";

import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Gallery } from "@/components/gallery";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { IntroOverlay } from "@/components/intro/intro-overlay";
import { Navigation } from "@/components/navigation";
import { useMotion } from "@/components/motion/motion-provider";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import type { Dictionary, Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import { useCallback, useRef, useState } from "react";

export default function HomeClient({
  dictionary,
  locale,
  imagesData,
}: {
  dictionary: Dictionary;
  locale: Locale;
  imagesData: ImagesData;
}) {
  const mainRef = useRef<HTMLDivElement>(null);
  const [heroEntryReady, setHeroEntryReady] = useState(false);
  const { prefersReducedMotion, isTouchDevice } = useMotion();
  const handleIntroSettled = useCallback(() => setHeroEntryReady(true), []);

  useGSAP(() => {
    if (!prefersReducedMotion && !isTouchDevice) {
      gsap.to(".global-bg-text", {
        xPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
      });
    }
  }, { dependencies: [isTouchDevice, prefersReducedMotion], scope: mainRef, revertOnUpdate: true });

  return (
    <div className="relative">
      <IntroOverlay
        dictionary={dictionary.intro}
        locale={locale}
        onInitialSettled={handleIntroSettled}
      />

      <div
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className="relative min-h-screen"
        role="main"
      >
        <div className="pointer-events-none fixed inset-0 -z-10 flex select-none items-center overflow-hidden" aria-hidden="true">
          <span className="global-bg-text translate-x-1/2 whitespace-nowrap font-serif text-[40vh] leading-none tracking-[-0.06em] text-white/[0.015] md:text-[60vh]">
            raw.vives // raw.vives
          </span>
        </div>

        <Navigation dictionary={dictionary.nav} currentLocale={locale} />
        <Hero
          dictionary={dictionary.hero}
          imagesData={imagesData}
          entryReady={heroEntryReady}
        />
        <About dictionary={dictionary.about} />
        <Gallery dictionary={{ ...dictionary.gallery, locale }} imagesData={imagesData} />
        <Contact dictionary={dictionary.contact} />
        <Footer currentLocale={locale} dictionary={dictionary.nav} />
      </div>
    </div>
  );
}
