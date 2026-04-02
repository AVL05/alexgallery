"use client";

import { Contact } from "@/components/contact";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { LoadingScreen } from "@/components/loading-screen";
import { Navigation } from "@/components/navigation";
import { SmoothScroll } from "@/components/smooth-scroll";
import { useCallback, useEffect, useState, useRef } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HomeClient({ dictionary, locale }: { dictionary: any; locale: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    setShowContent(true);
  }, []);

  // Entrance animation for content
  useGSAP(() => {
    if (showContent) {
      gsap.fromTo(mainRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' }
      );
    }
  }, [showContent]);

  // Auto-complete loading after 3 seconds as fallback
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        handleLoadingComplete();
      }
    }, 5000); // Increased fallback for GSAP transition

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
            <Navigation dictionary={dictionary.nav} currentLocale={locale} />
            <Hero dictionary={dictionary.hero} />
            <Gallery dictionary={dictionary.gallery} />
            <Contact dictionary={dictionary.contact} />
          </div>
        </SmoothScroll>
      )}
    </div>
  );
}
