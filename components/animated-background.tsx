"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particlesRef.current = []
      const particleCount = Math.min(50, Math.floor(canvas.width / 20))
      
      // Use deterministic seed-like values based on index to ensure consistent SSR/client rendering
      for (let i = 0; i < particleCount; i++) {
        const seedX = (i * 73 + 17) % 1000 / 1000  // Pseudo-random but deterministic
        const seedY = (i * 137 + 29) % 1000 / 1000
        const seedSize = (i * 41 + 7) % 100 / 100
        const seedSpeedX = (i * 23 + 11) % 200 / 200 - 0.5
        const seedSpeedY = (i * 89 + 37) % 200 / 200 - 0.5
        const seedOpacity = (i * 61 + 13) % 100 / 100
        
        particlesRef.current.push({
          id: i,
          x: seedX * canvas.width,
          y: seedY * canvas.height,
          size: seedSize * 3 + 1,
          speedX: seedSpeedX * 0.5,
          speedY: seedSpeedY * 0.5,
          opacity: seedOpacity * 0.5 + 0.1
        })
      }
    }

    const updateParticles = () => {
      particlesRef.current.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))
      })
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particlesRef.current.forEach(particle => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(87, 62, 47, ${particle.opacity})`
        ctx.fill()
      })

      // Draw connections between close particles
      particlesRef.current.forEach((particle1, i) => {
        particlesRef.current.slice(i + 1).forEach(particle2 => {
          const distance = Math.sqrt(
            Math.pow(particle1.x - particle2.x, 2) + Math.pow(particle1.y - particle2.y, 2)
          )
          
          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particle1.x, particle1.y)
            ctx.lineTo(particle2.x, particle2.y)
            ctx.strokeStyle = `rgba(87, 62, 47, ${0.1 * (1 - distance / 150)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })
    }

    const animate = () => {
      updateParticles()
      drawParticles()
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createParticles()
    animate()

    window.addEventListener('resize', () => {
      resizeCanvas()
      createParticles()
    })

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Gradient overlay - darker */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-background/95" />
      
      {/* Animated particles canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Floating geometric shapes - Fixed positions for hydration */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => {
          // Use deterministic values based on index to avoid hydration mismatch
          const positions = [
            { x: 100, y: 150, animX: 800, animY: 200 },
            { x: 300, y: 400, animX: 600, animY: 100 },
            { x: 700, y: 100, animX: 200, animY: 500 },
            { x: 900, y: 350, animX: 400, animY: 300 },
            { x: 200, y: 600, animX: 1000, animY: 150 },
            { x: 500, y: 200, animX: 300, animY: 450 },
            { x: 800, y: 500, animX: 150, animY: 350 },
            { x: 400, y: 300, animX: 750, animY: 600 }
          ]
          const pos = positions[i] || positions[0]
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/10 rounded-full"
              initial={{
                x: pos.x,
                y: pos.y,
              }}
              animate={{
                x: pos.animX,
                y: pos.animY,
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 20 + i * 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2,
              }}
            />
          )
        })}
      </div>

      {/* Subtle radial gradient - darker */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(87, 62, 47, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(110, 75, 60, 0.12) 0%, transparent 50%)'
        }}
      />
    </div>
  )
}