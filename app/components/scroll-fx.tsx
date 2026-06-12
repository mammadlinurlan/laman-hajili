'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Top scroll-progress bar driven by GSAP ScrollTrigger.
 * Also exposes a global parallax for any [data-parallax] element.
 */
export function ScrollFX() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const ctx = gsap.context(() => {
      // progress bar
      gsap.to(bar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      })

      // parallax elements
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.dataset.parallax || '0.2')
        gsap.to(el, {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return <div ref={barRef} className="scroll-progress" aria-hidden />
}
