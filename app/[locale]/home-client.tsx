"use client";

import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Gallery } from "@/components/gallery";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { LoadingScreen } from "@/components/loading-screen";
import { Navigation } from "@/components/navigation";
import { SmoothScroll } from "@/components/smooth-scroll";
import type { Dictionary, Locale } from "@/types/dictionary";
import type { ImagesData } from "@/types/photo";
import { useCallback, useEffect, useState, useRef } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

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

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    setShowContent(true);
  }, []);

  useGSAP(() => {
    if (!showContent) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    gsap.fromTo(
      mainRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: prefersReducedMotion ? 0.01 : 0.45, ease: 'power2.out' }
    )

    if (!prefersReducedMotion) {
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
  }, [showContent]);

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
      {isLoading && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {showContent && (
        <SmoothScroll>
          <div
            ref={mainRef}
            className="min-h-screen relative opacity-0"
            role="main"
          >
            <div className="fixed inset-0 -z-10 flex select-none items-center overflow-hidden pointer-events-none" aria-hidden="true">
                <span className="global-bg-text translate-x-1/2 whitespace-nowrap font-serif text-[40vh] leading-none tracking-[-0.06em] text-white/[0.015] will-change-transform md:text-[60vh]">
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
        </SmoothScroll>
      )}
    </div>
  );
}
