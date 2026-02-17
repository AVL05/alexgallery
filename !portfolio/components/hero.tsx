"use client";

import { motion } from "framer-motion";
import { Camera, Github, Instagram, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";

const TypewriterText = ({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay, text]);

  useEffect(() => {
    if (!isStarted) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, isStarted]);

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-0.5 h-6 bg-white/80 ml-1"
      />
    </span>
  );
};

const FloatingElements = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/10 rounded-full animate-float-up"
          style={{
            left: `${Math.random() * 100}%`,
            top: "100%",
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 4 + 3}s`,
            opacity: 0,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          80% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-120vh)
              translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up ease-in infinite;
        }
      `}</style>
    </div>
  );
};

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 gradient-bg relative overflow-hidden"
    >
      <FloatingElements />

      {/* Parallax background - reduced opacity for better contrast */}
      <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-amber-500/5" />

      <div className="max-w-4xl mx-auto text-center flex-1 flex flex-col items-center justify-center z-10">
        <motion.div
          className="space-y-6 sm:space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white/95 text-balance leading-tight px-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            <TypewriterText text="Alex Vicente López" delay={200} />
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="px-4"
          >
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto text-pretty leading-relaxed font-light text-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Estudiante de Desarrollo Web | Fotógrafo Creativo
              </motion.span>
            </p>
          </motion.div>

          <motion.p
            className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto text-pretty leading-relaxed px-4 text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Transformo ideas en experiencias digitales únicas, combinando
            desarrollo web con creatividad visual para crear soluciones que
            realmente conectan.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-4 sm:gap-6 pt-4 px-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {[
              {
                icon: Github,
                href: "https://github.com/AVL05",
                label: "GitHub",
              },
              {
                icon: Linkedin,
                href: "https://www.linkedin.com/in/alex-vicente-lopez-083821309/",
                label: "LinkedIn",
              },
              {
                icon: Instagram,
                href: "https://www.instagram.com/aleexx_005/",
                label: "Instagram",
              },
              { icon: Camera, href: "#photography", label: "Fotografía" },
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  social.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="text-white/70 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10 backdrop-blur-sm"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.6 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <social.icon className="h-6 w-6" />
                <span className="sr-only">{social.label}</span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.span
          className="text-sm font-medium"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll down
        </motion.span>
        <motion.div
          className="w-6 h-10 border-2 border-white/70 rounded-full flex items-start justify-center p-2"
          animate={{
            boxShadow: [
              "0 0 0px rgba(255,255,255,0)",
              "0 0 20px rgba(255,255,255,0.3)",
              "0 0 0px rgba(255,255,255,0)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-2 bg-white/70 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.a>
    </section>
  );
}
