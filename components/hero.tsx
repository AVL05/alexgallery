'use client'

import { useTypewriter } from '@/hooks/use-typewriter'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import Image from 'next/image'

export function Hero() {
  const { text: typewriterText, isTypingComplete } = useTypewriter({
    words: ['CAPTURANDO MOMENTOS'],
    typeSpeed: 80,
    loop: false,
  })

  const scrollToGallery = () => {
    const element = document.getElementById('gallery')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      <div className="container mx-auto px-6 lg:px-12 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Typography */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="space-y-4">
              <motion.p
                className="text-accent/60 text-xs sm:text-sm tracking-[0.3em] font-mono lowercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                &lt;visual-storytelling /&gt;
              </motion.p>
              <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter leading-[0.9] text-balance font-serif">
                <span className="text-accent">
                  {typewriterText}
                  <motion.span
                    className="inline-block w-1 h-[0.9em] bg-accent ml-1 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      duration: 1,
                      repeat: isTypingComplete ? 0 : Infinity,
                      ease: 'easeInOut',
                    }}
                    aria-hidden="true"
                  >
                    |
                  </motion.span>
                </span>
              </h1>
            </div>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Un viaje visual a través de paisajes, cultura y emociones. Cada
              fotograma cuenta una historia que vale la pena recordar.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <button
                onClick={scrollToGallery}
                className="group px-8 py-4 bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-all flex items-center gap-2 rounded-lg shadow-lg hover:shadow-xl cursor-hover"
              >
                Ver trabajo
                <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column - Enhanced Image Grid */}
          <motion.div
            className="relative h-[400px] md:h-[600px] lg:h-[700px]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            {/* Main large image */}
            <motion.div
              className="absolute top-0 right-0 w-[80%] h-[70%] md:w-[70%] md:h-[60%] overflow-hidden rounded-lg shadow-2xl z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Image
                src="/14.webp"
                alt="Fotografía de paisaje destacado"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 80vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
            </motion.div>

            {/* Secondary image */}
            <motion.div
              className="absolute bottom-0 left-0 w-[70%] h-[60%] md:w-[60%] md:h-[50%] border-4 border-accent overflow-hidden rounded-lg shadow-xl z-20 bg-background"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Image
                src="/39.webp"
                alt="Fotografía urbana destacada"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 70vw, 40vw"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 p-3 rounded-full glass border border-accent/20 hover:bg-accent/10 transition-colors z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={scrollToGallery}
        aria-label="Desplazarse a la galería"
      >
        <ArrowDown className="h-6 w-6 text-accent" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          Explorar
        </span>
      </motion.button>
    </section>
  )
}
