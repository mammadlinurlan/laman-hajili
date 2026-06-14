'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

/**
 * Award-style custom cursor: a soft dot that tracks instantly + a ring that
 * lags behind with spring smoothing. Over elements carrying [data-cursor],
 * the ring expands and reveals a contextual label (e.g. "VIEW").
 * Disabled on coarse pointers (touch).
 */
export function LuxuryCursor() {
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState<string | null>(null)
  const [hovering, setHovering] = useState(false)
  const [down, setDown] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  // Ring lags (softer spring); dot is near-instant (stiffer spring).
  const ringX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 })
  const dotX = useSpring(x, { stiffness: 900, damping: 50, mass: 0.3 })
  const dotY = useSpring(y, { stiffness: 900, damping: 50, mass: 0.3 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    setEnabled(true)
    document.documentElement.classList.add('luxury-cursor-on')

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        '[data-cursor], a, button'
      )
      if (target) {
        setHovering(true)
        setLabel(target.getAttribute('data-cursor'))
      } else {
        setHovering(false)
        setLabel(null)
      }
    }
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      document.documentElement.classList.remove('luxury-cursor-on')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [x, y])

  if (!enabled) return null

  let ringScale = 1
  if (label) ringScale = 2.9
  else if (hovering) ringScale = 1.7
  if (down) ringScale *= 0.85

  return (
    <>
      {/* Ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/50"
          style={{ width: 38, height: 38, backgroundColor: label ? 'rgba(79,70,229,0.92)' : 'transparent', borderColor: label ? 'rgba(79,70,229,0)' : 'rgba(79,70,229,0.5)' }}
          animate={{ scale: ringScale }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                key={label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 grid place-items-center text-bg font-sans uppercase"
                style={{ fontSize: 4.2, letterSpacing: '0.18em' }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{ x: dotX, y: dotY }}
      >
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          style={{ width: 6, height: 6 }}
          animate={{ opacity: label ? 0 : 1, scale: down ? 0.6 : 1 }}
          transition={{ duration: 0.18 }}
        />
      </motion.div>
    </>
  )
}
