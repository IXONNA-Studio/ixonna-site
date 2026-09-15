import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import type { ReactNode } from 'react'

type MagneticProps = {
  children: ReactNode
  className?: string
}

// A small "the interface notices you" moment on the CTAs — the button drifts
// toward the cursor within its own bounds, then springs back on mouse leave.
function Magnetic({ children, className }: MagneticProps) {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 })
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 })

  if (reduceMotion) {
    return <span className={className}>{children}</span>
  }

  function handleMouseMove(event: React.MouseEvent<HTMLSpanElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.35)
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.35)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      className={className}
      style={{ display: 'inline-block', x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.span>
  )
}

export default Magnetic
