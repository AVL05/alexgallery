"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let stepIndex = 0
    const steps = [8, 12, 7, 15, 10, 13, 9, 11, 6, 14, 5, 16] // Predefined increments
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const increment = steps[stepIndex % steps.length]
        stepIndex++
        const newProgress = Math.min(prev + increment, 100)
        
        if (newProgress >= 100) {
          clearInterval(timer)
          setIsComplete(true)
          setTimeout(() => onComplete(), 500)
        }
        
        return newProgress
      })
    }, 150)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 bg-background z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      transition={{ duration: 0.5, delay: isComplete ? 0.2 : 0 }}
    >
      <div className="flex flex-col items-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo/Brand */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            Alex Vicente López
          </h1>
        </motion.div>

        {/* Loading animation circles */}
        <div className="relative w-32 h-32">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-primary/20 rounded-full"
              style={{
                borderTopColor: i === 0 ? 'rgba(var(--color-primary), 0.8)' : 
                                i === 1 ? 'rgba(var(--color-accent), 0.6)' : 
                                'rgba(var(--color-primary), 0.4)'
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
          
          {/* Center dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Cargando...</span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Loading text with typewriter effect */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-sm text-muted-foreground">
            {progress < 30 && "Preparando experiencia visual..."}
            {progress >= 30 && progress < 60 && "Cargando portafolio..."}
            {progress >= 60 && progress < 90 && "Optimizando imágenes..."}
            {progress >= 90 && "¡Casi listo!"}
          </div>
        </motion.div>

        {/* Floating particles - Fixed positions for hydration */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => {
            // Use deterministic values based on index to avoid hydration mismatch
            const positions = [
              { left: 10, top: 15 }, { left: 25, top: 80 }, { left: 45, top: 35 }, { left: 60, top: 70 },
              { left: 75, top: 20 }, { left: 85, top: 50 }, { left: 15, top: 90 }, { left: 35, top: 25 },
              { left: 55, top: 85 }, { left: 90, top: 10 }, { left: 5, top: 45 }, { left: 70, top: 95 },
              { left: 40, top: 5 }, { left: 95, top: 75 }, { left: 20, top: 60 }, { left: 80, top: 40 },
              { left: 30, top: 85 }, { left: 65, top: 15 }, { left: 50, top: 75 }, { left: 85, top: 30 }
            ]
            const pos = positions[i] || positions[0]
            
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`
                }}
                animate={{
                  y: [-20, -60],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + (i % 5),
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}