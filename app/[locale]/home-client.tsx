"use client";

import { Contact } from "@/components/contact";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { LoadingScreen } from "@/components/loading-screen";
import { Navigation } from "@/components/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

export default function HomeClient({ dictionary, locale }: { dictionary: any; locale: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    // Delay content appearance to match loading screen exit animation
    setTimeout(() => setShowContent(true), 100);
  }, []);

  // Auto-complete loading after 3 seconds as fallback
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        handleLoadingComplete();
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [isLoading, handleLoadingComplete]);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {showContent && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen relative"
          role="main"
        >
          <Navigation dictionary={dictionary.nav} currentLocale={locale} />
          <Hero dictionary={dictionary.hero} />
          <Gallery dictionary={dictionary.gallery} />
          <Contact dictionary={dictionary.contact} />
        </motion.main>
      )}
    </div>
  );
}
