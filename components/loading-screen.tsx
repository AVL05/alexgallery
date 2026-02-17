"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let progress = 0;

    const updateProgress = () => {
      // Simulate progress: faster and more responsive
      const remaining = 100 - progress;

      // Increased increments for a snappier feel
      const increment = Math.random() * (remaining > 20 ? 1.0 : 0.5);

      progress = Math.min(100, progress + increment);
      setLoadingProgress(progress);

      if (progress < 100) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          if (onComplete) onComplete();
        }, 400);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 1.2,
              ease: [0.7, 0, 0.3, 1],
              delay: 0.1,
            },
          }}
        >
          {/* High-end ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative flex flex-col items-center w-full max-w-sm px-8">
            {/* Typographic Logo Section */}
            <div className="relative mb-12 flex flex-col items-center">
              <div className="relative h-24 sm:h-32 mb-4 overflow-visible">
                <svg
                  width="240"
                  height="120"
                  viewBox="0 0 240 120"
                  className="overflow-visible"
                >
                  <defs>
                    <linearGradient
                      id="logo-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--accent)" />
                    </linearGradient>
                  </defs>

                  {/* Background Stroke Lettering */}
                  <motion.text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="text-6xl sm:text-7xl font-bold fill-none stroke-white/10"
                    strokeWidth="0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                      letterSpacing: "0.15em",
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                    }}
                  >
                    AVL
                  </motion.text>

                  {/* Foreground Animated Filling Lettering */}
                  <motion.text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="text-6xl sm:text-7xl font-bold"
                    fill="url(#logo-gradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      letterSpacing: "0.15em",
                      fontFamily: "var(--font-space-grotesk), sans-serif",
                      clipPath: `inset(0 ${100 - loadingProgress}% 0 0)`,
                    }}
                  >
                    AVL
                  </motion.text>
                </svg>
              </div>

              {/* Name and Roles */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-center space-y-3"
              >
                <h2 className="text-xs sm:text-sm uppercase tracking-[0.5em] text-white/40 font-light">
                  Alex Vicente López
                </h2>
                <div className="flex items-center justify-center gap-3 text-[9px] sm:text-[10px] tracking-[0.3em] text-primary/60 uppercase font-medium">
                  <span>Digital Developer</span>
                  <span className="w-1 h-1 bg-primary/30 rounded-full" />
                  <span>Visual Artist</span>
                </div>
              </motion.div>
            </div>

            {/* Bottom Progress Area */}
            <div className="w-full flex flex-col items-center gap-6 mt-8">
              {/* Minimal Progress Line */}
              <div className="w-full h-px bg-white/5 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 30,
                    restDelta: 0.01,
                  }}
                />
              </div>

              {/* Elegant Counter */}
              <div className="flex justify-between w-full px-1 items-baseline">
                <motion.span className="text-[10px] tracking-widest text-white/20 uppercase font-mono">
                  System Initializing
                </motion.span>
                <motion.span
                  className="text-2xl font-mono text-white/30 tabular-nums"
                  key={Math.floor(loadingProgress)}
                >
                  {Math.floor(loadingProgress).toString().padStart(3, "0")}
                </motion.span>
              </div>
            </div>
          </div>

          {/* Decorative Corner Framing */}
          <div className="absolute inset-8 sm:inset-12 pointer-events-none opacity-30">
            <motion.div
              className="absolute top-0 left-0 w-12 h-px bg-primary/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ originX: 0 }}
            />
            <motion.div
              className="absolute top-0 left-0 w-px h-12 bg-primary/50"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ originY: 0 }}
            />

            <motion.div
              className="absolute bottom-0 right-0 w-12 h-px bg-primary/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ originX: 1 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-px h-12 bg-primary/50"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ originY: 1 }}
            />
          </div>

          {/* Shutter reveal panels for exit animation */}
          <motion.div
            className="absolute inset-0 z-[-1] flex flex-col"
            exit={{ opacity: 1 }}
          >
            <motion.div className="flex-1 bg-[#0a0a0a]" />
            <motion.div className="flex-1 bg-[#0a0a0a]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
