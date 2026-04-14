"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function Navigation({ dictionary, currentLocale }: { dictionary: any; currentLocale: string }) {
  const items = [
    { name: dictionary.home, href: "#hero" },
    { name: dictionary.gallery, href: "#gallery" },
    { name: dictionary.contact, href: "#contact" },
    { name: dictionary.policies || "Políticas", href: `/${currentLocale}/politica-uso` },
    { name: "Portfolio", href: "https://aleviclop.vercel.app/", external: true },
  ]

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          isScrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-4" : "bg-transparent py-8"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <a href="#hero" className="text-2xl font-black uppercase tracking-tighter text-white">
            ALEX <span className="text-accent italic">VICENTE</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-12">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ))}

            <div className="flex items-center gap-4 border-l border-white/10 pl-12 text-[10px] font-bold">
               <a href="/es" className={currentLocale === 'es' ? 'text-accent' : 'text-white/30'}>ES</a>
               <a href="/en" className={currentLocale === 'en' ? 'text-accent' : 'text-white/30'}>EN</a>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black z-[90] md:hidden transition-transform duration-500 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-3xl font-black uppercase tracking-tighter transition-colors text-white"
              >
                {item.name}
              </a>
            ))}
        </div>
      </div>
    </>
  )
}
