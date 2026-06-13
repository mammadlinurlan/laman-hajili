'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Work } from '@/lib/works'

const ease = [0.22, 1, 0.36, 1] as const

// Desktop heights → asymmetric, gallery feels hand-arranged.
// (Mobile ignores these — images go full-width, stacked vertically.)
const HEIGHTS = ['md:h-[72vh]', 'md:h-[58vh]', 'md:h-[66vh]', 'md:h-[80vh]', 'md:h-[62vh]']

export function CaseStudy({
  work,
  onClose,
}: Readonly<{ work: Work; onClose: () => void }>) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const images = work.images

  useEffect(() => setMounted(true), [])

  // Lock body scroll + Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      window.__lenis?.start()
    }
  }, [onClose])

  // Desktop only: vertical wheel → horizontal scroll.
  // On mobile the layout scrolls vertically, so leave the wheel untouched.
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    if (!el) return
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    if (!isDesktop) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY
    }
  }

  if (!mounted) return null

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] bg-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      {/* Close button */}
      <motion.button
        type="button"
        onClick={onClose}
        aria-label="Close case study"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
        exit={{ opacity: 0 }}
        className="fixed top-5 right-5 md:top-7 md:right-8 z-[210] flex items-center gap-2 text-muted hover:text-text text-[11px] tracking-[0.25em] uppercase font-sans transition-colors duration-300 border border-border hover:border-border-strong bg-surface/80 backdrop-blur-md px-4 py-2.5"
      >
        Close <span className="text-base leading-none">✕</span>
      </motion.button>

      {/* Gallery — vertical scroll on mobile, horizontal on desktop.
          data-lenis-prevent: stop Lenis from hijacking touch/wheel here. */}
      <div
        ref={scrollRef}
        onWheel={onWheel}
        data-lenis-prevent
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
        className="no-scrollbar h-full w-full flex flex-col md:flex-row md:items-center overflow-y-auto overflow-x-hidden md:overflow-y-hidden md:overflow-x-auto"
      >
        {/* Info panel — top on mobile, sticky-left on desktop */}
        <div className="shrink-0 w-full md:w-[420px] md:h-full flex flex-col justify-center px-6 md:px-12 pt-24 pb-10 md:py-0 md:sticky md:left-0 md:z-20 bg-bg">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.7, ease } }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent accent-glow" />
              <span className="text-accent text-[10px] tracking-[0.3em] uppercase font-sans">
                {work.category}
              </span>
            </div>

            <h2
              className="font-display text-text leading-[0.95] font-light mb-6"
              style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)' }}
            >
              {work.title}
            </h2>

            <p className="text-muted text-[14px] leading-[1.7] font-sans max-w-xs mb-8">
              A curated selection of visuals from the {work.title} project.
            </p>

            <div className="flex items-center gap-6 text-dim">
              <span className="text-[10px] tracking-[0.25em] uppercase font-sans">
                {String(images.length).padStart(2, '0')} Visuals
              </span>
              <span className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase font-sans">
                <span className="md:hidden">Scroll down</span>
                <span className="hidden md:inline">Scroll</span>
                <span className="text-accent text-sm leading-none md:rotate-0 rotate-90 inline-block">→</span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* Images */}
        {images.map((img, i) => {
          const heightClass = HEIGHTS[i % HEIGHTS.length]
          const isHero = i === 0

          return (
            <div
              key={img.src}
              className="shrink-0 w-full md:w-auto md:h-full flex items-center justify-center md:justify-start px-6 md:px-0 md:pr-8 mb-5 md:mb-0 last:mb-10 md:last:mb-0"
            >
              {isHero ? (
                <motion.div
                  layoutId={`work-${work.slug}`}
                  className={`relative w-full md:w-auto aspect-[3/4] ${heightClass} overflow-hidden ring-1 ring-border`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30, x: 0 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.2 + i * 0.05, duration: 0.8, ease },
                  }}
                  className={`relative w-full md:w-auto ${heightClass} overflow-hidden ring-1 ring-border`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto md:h-full md:w-auto object-cover block max-w-none"
                    loading="lazy"
                    draggable={false}
                  />
                </motion.div>
              )}
            </div>
          )
        })}

        {/* End cap */}
        <div className="shrink-0 w-full md:w-[260px] h-auto md:h-full flex items-center justify-center px-10 py-16 md:py-0">
          <button
            type="button"
            onClick={onClose}
            className="flex flex-col items-center gap-3 text-dim hover:text-accent transition-colors duration-300 group"
          >
            <span className="text-3xl leading-none group-hover:-translate-y-1 transition-transform duration-300">
              ↑
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans">
              Back to work
            </span>
          </button>
        </div>
      </div>
    </motion.div>,
    document.body
  )
}
