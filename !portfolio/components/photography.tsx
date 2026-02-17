"use client";

import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import { Camera, ExternalLink, Globe, Instagram } from "lucide-react";
import Image from "next/image";

// Enlaces a tus redes de fotografía
const photographyLinks = {
  website: "https://alexgallery.alexviclop.workers.dev/", // Tu galería fotográfica
  instagram: "https://www.instagram.com/raw.vives/", // Tu Instagram de fotografía
  portfolio: "https://galeria-fotografica.vercel.app/", // Tu galería principal
};

export function Photography() {
  const { ref, isInView } = useScrollReveal();
  // Use a simpler approach for the showcase image
  const imagePath = "/photography/hero.webp";
  const hasHeroImage = true; // Set to true by default or use a single check

  return (
    <section
      id="photography"
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="max-w-4xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="h-8 w-8 text-primary" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Fotografía
            </h2>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explora mi mundo a través del lente. Capturando momentos, emociones
            y la belleza que nos rodea.
          </p>
        </motion.div>

        {/* Photography Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          {/* Main showcase card */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br from-primary/10 via-background to-accent/10 border border-border/50 backdrop-blur-sm">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-accent/20" />
            </div>

            <div className="relative p-8 sm:p-12 lg:p-16">
              {/* Hero image */}
              <motion.div className="relative aspect-video sm:aspect-21/9 rounded-xl sm:rounded-2xl overflow-hidden mb-8 bg-linear-to-br from-primary/20 via-accent/30 to-secondary/20">
                {/* Conditional image rendering */}
                {hasHeroImage ? (
                  <Image
                    src={imagePath}
                    alt="Fotografía destacada - Alex Vicente López"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                ) : (
                  // Placeholder when no image is available
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="h-16 w-16 sm:h-20 sm:w-20 text-white/30" />
                  </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                {/* Featured text overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.h3
                    className="text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Explorando el Mundo a Través del Lente
                  </motion.h3>
                  <motion.p
                    className="text-white/80 text-sm sm:text-base"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    Paisajes, retratos, vida urbana y momentos únicos capturados
                    con pasión
                  </motion.p>
                </div>
              </motion.div>

              {/* Description and stats */}
              <div className="text-center mb-8">
                <motion.h3
                  className="text-2xl sm:text-3xl font-bold mb-4 bg-linear-to-r from-primary to-accent bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  Mi Mundo Fotográfico
                </motion.h3>
                <motion.p
                  className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  Descubre mi colección completa de fotografías donde cada
                  imagen cuenta una historia. Desde paisajes impresionantes
                  hasta retratos emotivos, explora mi visión artística en mi
                  sitio web dedicado.
                </motion.p>
              </div>

              {/* Action buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                {/* Main CTA Button */}
                <motion.a
                  href={photographyLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Button
                    size="lg"
                    className="bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-6 rounded-full text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                  >
                    <Globe className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Ver Galería Completa
                    <ExternalLink className="ml-3 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </motion.a>

                {/* Secondary button */}
                <motion.a
                  href={photographyLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-primary/20 hover:border-primary/40 bg-background/50 backdrop-blur-sm hover:bg-primary/5 px-6 py-6 rounded-full text-base font-medium transition-all duration-300"
                  >
                    <Instagram className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Sígueme en Instagram
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
