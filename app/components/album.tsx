'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Work } from '@/lib/works'

const ease = [0.22, 1, 0.36, 1] as const

export function Album({ work, onClose }: Readonly<{ work: Work; onClose: () => void }>) {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)
  const images = work.images

  const go = useCallback(
    (dir: number) => setCurrent(i => (i + dir + images.length) % images.length),
    [images.length]
  )

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, go])

  useEffect(() => {
    const active = stripRef.current?.children[current] as HTMLElement | undefined
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [current])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="album-backdrop flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-8 py-4 md:py-5 shrink-0 border-b border-border">
          <div className="flex flex-col">
            <span className="text-accent text-[9px] tracking-[0.3em] uppercase font-sans">
              {work.category}
            </span>
            <span className="font-display text-text text-lg md:text-xl">{work.title}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close album"
            className="text-muted hover:text-text text-[11px] tracking-[0.25em] uppercase font-sans transition-colors duration-300 flex items-center gap-2 border border-border hover:border-border-strong px-4 py-2"
          >
            Close <span className="text-base leading-none">✕</span>
          </button>
        </div>

        {/* Stage */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 md:px-16 py-4">
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 text-muted hover:text-accent text-4xl transition-colors duration-300 p-2"
            >
              ‹
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <Image
                src={images[current].src}
                alt={images[current].alt}
                width={1600}
                height={1200}
                className="object-contain max-h-[70vh] md:max-h-[76vh] w-auto h-auto rounded-sm"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 text-muted hover:text-accent text-4xl transition-colors duration-300 p-2"
            >
              ›
            </button>
          )}
        </div>

        {/* Counter */}
        <div className="text-center text-dim text-[10px] tracking-[0.3em] font-sans py-2 shrink-0">
          {String(current + 1).padStart(2, '0')} — {String(images.length).padStart(2, '0')}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div
            ref={stripRef}
            className="no-scrollbar flex gap-2 overflow-x-auto px-5 md:px-8 pb-5 md:pb-7 shrink-0 justify-start md:justify-center"
          >
            {images.map((img, i) => (
              <button
                type="button"
                key={img.src}
                onClick={() => setCurrent(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden transition-all duration-300 ${
                  i === current
                    ? 'ring-2 ring-accent opacity-100'
                    : 'opacity-40 hover:opacity-80 ring-1 ring-border'
                }`}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
