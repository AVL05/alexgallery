'use client'

import { useTypewriter } from '@/hooks/use-typewriter'
import { ArrowDown } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function Hero({ dictionary }: { dictionary: any }) {
  const containerRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const { text: typewriterText } = useTypewriter({
    words: [dictionary.title],
    typeSpeed: 80,
    loop: false,
  })

  useGSAP(() => {
    gsap.from('.hero-text-reveal', {
      y: 100,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: 'power4.out'
    })

    gsap.to(imageRef.current, {
      y: 100,
      scale: 1.1,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })
  }, { scope: containerRef })

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[92vh] flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Background Image - Clean & Subtle */}
      <div 
        ref={imageRef}
        className="absolute inset-0 z-0 opacity-70"
      >
        <Image
          src="/photos/optimized/original/14.webp"
          alt="Atmosphere"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="space-y-6">
          <p className="hero-text-reveal text-accent text-[10px] sm:text-xs font-bold tracking-[0.24em] sm:tracking-[0.45em] uppercase max-w-[18rem] sm:max-w-none mx-auto leading-relaxed">
            {dictionary.eyebrow}
          </p>
          <h1 className="hero-text-reveal text-5xl sm:text-7xl md:text-[8rem] lg:text-[9.5rem] font-black uppercase tracking-normal leading-none text-white max-w-6xl mx-auto">
            {typewriterText}
          </h1>
          <p className="hero-text-reveal text-white/65 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            {dictionary.description}
          </p>
          
          <div className="hero-text-reveal pt-10">
            <button
               onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
               className="group flex flex-col items-center gap-4 mx-auto text-white/45 hover:text-white transition-colors"
            >
                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">{dictionary.cta}</span>
                <div className="w-px h-12 bg-current animate-bounce" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Framing */}
      <div className="absolute inset-x-12 bottom-12 h-px bg-white/10 pointer-events-none hidden lg:block" />
    </section>
  )
}
