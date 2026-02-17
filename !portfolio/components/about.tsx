"use client";

import { Card } from "@/components/ui/card";
import {
  scrollRevealVariants,
  staggerChildrenVariants,
  useScrollReveal,
} from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";

export function About() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section
      id="about"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 opacity-50" />
      <motion.div
        className="absolute top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto relative z-10" ref={ref}>
        <motion.div
          className="space-y-6 text-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerChildrenVariants}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent px-2"
            variants={scrollRevealVariants}
          >
            Conoce al Desarrollador, No Solo el Código
          </motion.h2>

          <motion.div
            className="space-y-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed px-2"
            variants={staggerChildrenVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.p variants={scrollRevealVariants}>
              Soy estudiante de{" "}
              <motion.span className="text-foreground font-medium relative">
                Desarrollo de Aplicaciones Web
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-primary/50 block"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : { width: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </motion.span>
              , apasionado por crear experiencias digitales que combinan
              funcionalidad con estética visual.
            </motion.p>

            <motion.p variants={scrollRevealVariants}>
              Mi formación incluye un{" "}
              <motion.span className="text-foreground font-medium relative">
                Grado Medio en Sistemas Microinformáticos y Redes Locales
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-accent/50 block"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : { width: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                />
              </motion.span>
              , lo que me proporciona una base sólida en infraestructura
              tecnológica.
            </motion.p>

            <motion.p variants={scrollRevealVariants}>
              Además del desarrollo web, mi hobby es{" "}
              <motion.span className="text-foreground font-medium relative">
                la fotografía creativa y el diseño digital
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-primary/50 to-accent/50 block"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : { width: 0 }}
                  transition={{ delay: 2, duration: 0.8 }}
                />
              </motion.span>
              , con aprendizaje en Adobe Creative Suite. Esta combinación de
              habilidades me permite abordar proyectos desde múltiples
              perspectivas creativas.
            </motion.p>
          </motion.div>

          <motion.div className="pt-6" variants={scrollRevealVariants}>
            <div>
              <Card className="inline-block px-6 py-3 bg-primary/10 border-primary/20 backdrop-blur-sm hover:bg-primary/20 transition-colors">
                <p className="text-primary font-medium flex items-center gap-2">
                  <motion.span
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  Disponible para nuevos proyectos
                </p>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
