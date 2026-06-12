'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const WORDS = [
  'Branding',
  'Logo Design',
  'Visual Identity',
  'Packaging',
  'Social Media',
  'Motion Design',
  'Typography',
  'Print Design',
]

export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    // animate across exactly half the track (content is duplicated)
    const tween = gsap.to(track, {
      xPercent: -50,
      ease: 'none',
      duration: 26,
      repeat: -1,
    })
    return () => { tween.kill() }
  }, [])

  const Row = () => (
    <>
      {WORDS.map(w => (
        <span key={w} className="inline-flex items-center">
          <span className="font-display text-text/90 px-6" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
            {w}
          </span>
          <span className="text-accent text-2xl px-2">✦</span>
        </span>
      ))}
    </>
  )

  return (
    <section className="py-12 md:py-20 border-y border-border overflow-hidden bg-surface2">
      <div ref={trackRef} className="marquee-track">
        <Row />
        <Row />
      </div>
    </section>
  )
}
