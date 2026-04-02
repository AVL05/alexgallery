"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export function Navigation({ dictionary, currentLocale }: { dictionary: any; currentLocale: string }) {
  const items = [
    { name: dictionary.home, href: "#hero" },
    { name: dictionary.gallery, href: "#gallery" },
    { name: dictionary.contact, href: "#contact" },
    { name: dictionary.policies || "Políticas", href: `/${currentLocale}/politica-uso` },
    { name: "Portfolio", href: "https://aleviclop.vercel.app/" },
  ]

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  
  const progressBarRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Scroll progress bar
    gsap.to(progressBarRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3
      }
    })

    // Entrance animation for nav
    gsap.from(navRef.current, {
      y: -100,
      duration: 1,
      ease: "power3.out"
    })
  }, { scope: navRef })

  // Mobile menu animation
  useGSAP(() => {
    if (isMobileMenuOpen) {
      gsap.fromTo(mobileMenuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      )
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      const sections = ["hero", "gallery", "contact"]
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 150 && rect.bottom >= 150
        }
        return false
      })
      
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary origin-left z-50 scale-x-0"
      />
      
      <nav
        ref={navRef}
        className={`fixed top-1 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled ? "bg-background/90 backdrop-blur-md border border-border/50 rounded-2xl mx-2 sm:mx-4 shadow-2xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="#hero" className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Alex Vicente
            </a>

            <div className="hidden md:flex items-center gap-4">
              {items.map((item) => {
                const isActive = item.href.startsWith('#') && activeSection === item.href.substring(1)
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target={item.href.startsWith('http') ? "_blank" : undefined}
                    className={`text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {item.name}
                  </a>
                )
              })}
              
              <div className="flex items-center gap-1 ml-4 pl-4 border-l border-white/10 uppercase font-bold text-[10px]">
                <a href="/es" className={`px-2 py-1 rounded ${currentLocale === 'es' ? 'bg-primary text-black' : 'opacity-50 hover:opacity-100'}`}>ES</a>
                <a href="/en" className={`px-2 py-1 rounded ${currentLocale === 'en' ? 'bg-primary text-black' : 'opacity-50 hover:opacity-100'}`}>EN</a>
              </div>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden bg-background/95 backdrop-blur-lg border-t border-white/5 p-4 space-y-4"
          >
            {items.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="flex gap-4 pt-4 border-t border-white/5">
                <a href="/es" className={currentLocale === 'es' ? 'text-primary' : ''}>ESPAÑOL</a>
                <a href="/en" className={currentLocale === 'en' ? 'text-primary' : ''}>ENGLISH</a>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
