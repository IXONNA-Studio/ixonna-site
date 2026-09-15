import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, [role="button"]'

// A small fixed-position ring that trails the pointer and grows over
// anything clickable — the one "technology lab" touch that only shows up
// for people with a mouse, on a system that hasn't asked for less motion.
function Cursor() {
  const reduceMotion = useReducedMotion()
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    if (reduceMotion || !enabled) return

    function handleMove(event: MouseEvent) {
      x.set(event.clientX)
      y.set(event.clientY)
    }
    function handleOver(event: MouseEvent) {
      const target = event.target
      if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) {
        setHovering(true)
      }
    }
    function handleOut(event: MouseEvent) {
      const target = event.target
      if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) {
        setHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseover', handleOver)
    window.addEventListener('mouseout', handleOut)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
      window.removeEventListener('mouseout', handleOut)
    }
  }, [reduceMotion, enabled, x, y])

  if (!enabled || reduceMotion) return null

  return (
    <motion.div
      className="cursor-ring"
      style={{ left: springX, top: springY }}
      animate={{ scale: hovering ? 2.2 : 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      aria-hidden="true"
    />
  )
}

export default Cursor
