'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HEADER_OFFSET = 72

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/**
 * Buttery smooth scrolling (Lenis) + precise anchor navigation that
 * accounts for the fixed header and ignores image-driven layout shift.
 * Synced with GSAP ScrollTrigger so scrub animations stay accurate.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    window.__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Smooth anchor links (skip ones marked data-no-smooth)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a || a.dataset.noSmooth !== undefined) return
      const href = a.getAttribute('href')
      if (!href || href.length <= 1) return
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -HEADER_OFFSET })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
      window.__lenis = undefined
    }
  }, [])

  return null
}
