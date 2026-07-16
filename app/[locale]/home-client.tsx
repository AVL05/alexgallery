"use client";

import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Gallery } from "@/components/gallery";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { LoadingScreen } from "@/components/loading-screen";
import { Navigation } from "@/components/navigation";
import { useMotion } from "@/components/motion/motion-provider";
import { motionDuration, motionEase } from "@/lib/motion/config";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import type { Dictionary, Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import { useCallback, useEffect, useState, useRef } from "react";

export default function HomeClient({
  dictionary,
  locale,
  imagesData,
}: {
  dictionary: Dictionary;
  locale: Locale;
  imagesData: ImagesData;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, isTouchDevice } = useMotion();

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    setShowContent(true);
  }, []);

  useGSAP(() => {
    if (!showContent) return

    gsap.fromTo(
      mainRef.current,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: prefersReducedMotion ? motionDuration.instant : motionDuration.normal,
        ease: motionEase.standard,
      },
    )

    if (!prefersReducedMotion && !isTouchDevice) {
      gsap.to('.global-bg-text', {
        xPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
      })
    }
  }, { dependencies: [isTouchDevice, prefersReducedMotion, showContent], scope: mainRef, revertOnUpdate: true });

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        handleLoadingComplete();
      }
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [isLoading, handleLoadingComplete]);

  return (
    <div className="relative">
      <noscript>
        <style>{`.rv-loading-screen { display: none !important; }`}</style>
      </noscript>
      {isLoading && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      <div
        ref={mainRef}
        className="relative min-h-screen"
        role="main"
      >
            <div className="fixed inset-0 -z-10 flex select-none items-center overflow-hidden pointer-events-none" aria-hidden="true">
                <span className="global-bg-text translate-x-1/2 whitespace-nowrap font-serif text-[40vh] leading-none tracking-[-0.06em] text-white/[0.015] md:text-[60vh]">
                   {dictionary.hero.title} // {dictionary.hero.title}
                </span>
            </div>

            <Navigation dictionary={dictionary.nav} currentLocale={locale} />
            <Hero dictionary={dictionary.hero} />
            <About dictionary={dictionary.about} />
            <Gallery dictionary={{ ...dictionary.gallery, locale }} imagesData={imagesData} />
            <Contact dictionary={dictionary.contact} />
            <Footer currentLocale={locale} dictionary={dictionary.nav} />
      </div>
    </div>
  );
}
