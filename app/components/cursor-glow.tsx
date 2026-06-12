'use client'

import { useEffect, useRef } from 'react'

/**
 * A soft emerald glow that trails the pointer.
 * The native cursor stays fully visible — this is purely additive.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip on touch / coarse pointers
    if (window.matchMedia('(pointer: coarse)').matches) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let cx = x
    let cy = y
    let raf = 0

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
    }

    const tick = () => {
      cx += (x - cx) * 0.14
      cy += (y - cy) * 0.14
      const el = ref.current
      if (el) el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="cursor-glow hidden md:block" aria-hidden />
}
