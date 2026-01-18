"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [cursorType, setCursorType] = useState<"default" | "hover" | "click">("default")
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    // Add hover effects for interactive elements
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, select, [role="button"], .cursor-hover'
      )

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          setIsHovering(true)
          setCursorType('hover')
        })
        el.addEventListener('mouseleave', () => {
          setIsHovering(false)
          setCursorType('default')
        })
        el.addEventListener('mousedown', () => {
          setCursorType('click')
        })
        el.addEventListener('mouseup', () => {
          setCursorType(isHovering ? 'hover' : 'default')
        })
      })
    }

    // Initial setup
    addHoverListeners()

    // Re-run when DOM changes
    const observer = new MutationObserver(addHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('resize', checkMobile)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      observer.disconnect()
    }
  }, [cursorX, cursorY, isHovering])

  // Hide default cursor only on desktop
  useEffect(() => {
    if (!isMobile) {
      document.body.style.cursor = 'none'
    }
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [isMobile])

  const getCursorSize = () => {
    switch (cursorType) {
      case 'hover':
        return 40
      case 'click':
        return 25
      default:
        return 32
    }
  }

  const getCursorColor = () => {
    switch (cursorType) {
      case 'hover':
        return 'rgba(var(--color-primary), 0.8)'
      case 'click':
        return 'rgba(var(--color-accent), 1)'
      default:
        return 'rgba(var(--color-primary), 0.6)'
    }
  }

  // Don't render cursor on mobile devices
  if (isMobile) {
    return null
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border-2 border-primary/80 backdrop-blur-sm"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: getCursorSize(),
          height: getCursorSize(),
          backgroundColor: getCursorColor(),
          borderColor: cursorType === 'click' ? 'rgba(var(--color-accent), 1)' : 'rgba(var(--color-primary), 0.8)',
          scale: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 400,
          scale: { duration: 0.2 }
        }}
      />
      
      {/* Cursor trail dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-40 w-2 h-2 bg-primary rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 0.8 : 0,
        }}
        transition={{
          opacity: { duration: 0.2 }
        }}
      />

      {/* Hover effect particles */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-30"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-50%',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent/60 rounded-full"
              animate={{
                x: Math.cos((i * Math.PI * 2) / 6) * 25,
                y: Math.sin((i * Math.PI * 2) / 6) * 25,
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      )}
    </>
  )
}