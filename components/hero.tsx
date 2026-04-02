'use client'

import { useTypewriter } from '@/hooks/use-typewriter'
import { ArrowDown } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export function Hero({ dictionary }: { dictionary: any }) {
  const containerRef = useRef<HTMLElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)
  const image1Ref = useRef<HTMLDivElement>(null)
  const image2Ref = useRef<HTMLDivElement>(null)
  const explorerBtnRef = useRef<HTMLButtonElement>(null)

  const { text: typewriterText, isTypingComplete } = useTypewriter({
    words: [dictionary.title],
    typeSpeed: 80,
    loop: false,
  })

  useGSAP(() => {
    // Initial entrance animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from(leftColRef.current, {
      x: -50,
      opacity: 0,
      duration: 1.2
    })
    .from('p.hero-tag', {
      opacity: 0,
      duration: 0.6
    }, '-=0.8')
    .from('p.hero-desc', {
      y: 20,
      opacity: 0,
      duration: 0.8
    }, '-=0.6')
    .from('.hero-buttons', {
      y: 20,
      opacity: 0,
      duration: 0.8
    }, '-=0.6')

    gsap.from(rightColRef.current, {
      x: 50,
      opacity: 0,
      duration: 1.2,
      delay: 0.4,
      ease: 'power3.out'
    })

    gsap.from([image1Ref.current, image2Ref.current], {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      delay: 0.6,
      ease: 'back.out(1.7)'
    })

    // Cursor pulse
    if (!isTypingComplete) {
      gsap.to('.typewriter-cursor', {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.5,
        ease: 'none'
      })
    } else {
      gsap.to('.typewriter-cursor', { opacity: 0, duration: 0.3 })
    }

    // Parallax scroll effects
    gsap.to(image1Ref.current, {
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })

    gsap.to(image2Ref.current, {
      y: -150,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })

    // Explorer button bounce
    gsap.to(explorerBtnRef.current, {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'sine.inOut'
    })

  }, { scope: containerRef, dependencies: [isTypingComplete] })

  const scrollToGallery = () => {
    const element = document.getElementById('gallery')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      <div className="container mx-auto px-6 lg:px-12 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Typography */}
          <div ref={leftColRef} className="space-y-8">
            <div className="space-y-4">
              <p className="hero-tag text-accent/60 text-xs sm:text-sm tracking-[0.3em] font-mono lowercase">
                &lt;visual-storytelling /&gt;
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter leading-[0.9] text-balance font-serif">
                <span className="text-accent">
                  {typewriterText}
                  <span
                    className="typewriter-cursor inline-block w-1 h-[0.9em] bg-accent ml-1 align-middle"
                    aria-hidden="true"
                  >
                    |
                  </span>
                </span>
              </h1>
            </div>

            <p className="hero-desc text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              {dictionary.description}
            </p>

            <div className="hero-buttons flex flex-wrap gap-4 pt-4">
              <button
                onClick={scrollToGallery}
                className="group px-8 py-4 bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-all flex items-center gap-2 rounded-lg shadow-lg hover:shadow-xl cursor-hover"
              >
                {dictionary.cta}
                <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column - Image Grid */}
          <div ref={rightColRef} className="relative h-[400px] md:h-[600px] lg:h-[700px]">
            <div
              ref={image1Ref}
              className="absolute top-0 right-0 w-[80%] h-[70%] md:w-[70%] md:h-[60%] overflow-hidden rounded-lg shadow-2xl z-10 bg-black/40"
            >
              <Image
                src="/photos/optimized/original/14.webp"
                alt="Landscape Highlights"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 80vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
            </div>

            <div
              ref={image2Ref}
              className="absolute bottom-0 left-0 w-[70%] h-[60%] md:w-[60%] md:h-[50%] border-4 border-accent overflow-hidden rounded-lg shadow-xl z-20 bg-background"
            >
              <Image
                src="/photos/optimized/original/39.webp"
                alt="Urban Selection"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 70vw, 40vw"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        ref={explorerBtnRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 p-3 rounded-full glass border border-accent/20 hover:bg-accent/10 transition-colors z-20"
        onClick={scrollToGallery}
      >
        <ArrowDown className="h-6 w-6 text-accent" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          {dictionary.explore}
        </span>
      </button>
    </section>
  )
}
