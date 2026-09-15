import { motion, useReducedMotion } from 'framer-motion'

type HeroMarkProps = {
  className?: string
}

// A quiet "atom" mark behind the hero copy: a fixed serif I — set in the
// same face as the IXONNA wordmark next to it — with two thin purple orbit
// rings turning slowly and independently around it, the way electron shells
// do in a real atom diagram. Reduced motion holds the rings at their
// starting tilt instead of animating.
function HeroMark({ className }: HeroMarkProps) {
  const reduceMotion = useReducedMotion()

  return (
    <svg
      className={className}
      viewBox="0 0 260 260"
      fill="none"
      aria-hidden="true"
    >
      <motion.ellipse
        cx="128"
        cy="130"
        rx="128"
        ry="58"
        strokeWidth="2.1"
        style={{ stroke: 'var(--accent)', opacity: 0.6, transformOrigin: '130px 130px' }}
        initial={{ rotate: 35 }}
        animate={reduceMotion ? undefined : { rotate: [35, 395] }}
        transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
      />
      <motion.ellipse
        cx="128"
        cy="130"
        rx="128"
        ry="58"
        strokeWidth="2.1"
        style={{ stroke: 'var(--accent)', opacity: 0.6, transformOrigin: '130px 130px' }}
        initial={{ rotate: -35 }}
        animate={reduceMotion ? undefined : { rotate: [-35, -395] }}
        transition={{ repeat: Infinity, duration: 65, ease: 'linear' }}
      />
      <text
        x="130"
        y="130"
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fill: 'var(--text-h)',
          fontFamily: 'var(--heading)',
          fontSize: '247px',
          fontWeight: 600,
        }}
      >
        I
      </text>
    </svg>
  )
}

export default HeroMark
