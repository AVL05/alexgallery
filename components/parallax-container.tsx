"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

interface ParallaxContainerProps {
  children: React.ReactNode
  speed?: number
  offset?: number
  className?: string
}

export function ParallaxContainer({ 
  children, 
  speed = 0.5, 
  offset = 0,
  className = "" 
}: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [offset, offset + speed * 1000])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y: smoothY }}>
        {children}
      </motion.div>
    </div>
  )
}

interface ParallaxTextProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function ParallaxText({ children, speed = 0.3, className = "" }: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const x = useTransform(scrollYProgress, [0, 1], [-speed * 300, speed * 300])
  const smoothX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ x: smoothX }} className="whitespace-nowrap">
        {children}
      </motion.div>
    </div>
  )
}

interface FloatingElementProps {
  children: React.ReactNode
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
}

export function FloatingElement({ 
  children, 
  speed = 0.2, 
  direction = "up",
  className = "" 
}: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const getTransform = () => {
    switch (direction) {
      case "up":
        return useTransform(scrollYProgress, [0, 1], [0, -speed * 500])
      case "down":
        return useTransform(scrollYProgress, [0, 1], [0, speed * 500])
      case "left":
        return useTransform(scrollYProgress, [0, 1], [0, -speed * 500])
      case "right":
        return useTransform(scrollYProgress, [0, 1], [0, speed * 500])
      default:
        return useTransform(scrollYProgress, [0, 1], [0, -speed * 500])
    }
  }

  const transform = getTransform()
  const smoothTransform = useSpring(transform, { stiffness: 100, damping: 30, restDelta: 0.001 })

  const style = direction === "left" || direction === "right" 
    ? { x: smoothTransform }
    : { y: smoothTransform }

  return (
    <div ref={ref} className={className}>
      <motion.div style={style}>
        {children}
      </motion.div>
    </div>
  )
}

export function ParallaxSection({ 
  children, 
  className = "",
  backgroundElements = []
}: {
  children: React.ReactNode
  className?: string
  backgroundElements?: React.ReactNode[]
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Background parallax elements */}
      {backgroundElements.map((element, index) => (
        <ParallaxContainer 
          key={index}
          speed={0.2 + (index * 0.1)} 
          className="absolute inset-0 pointer-events-none"
        >
          {element}
        </ParallaxContainer>
      ))}
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}