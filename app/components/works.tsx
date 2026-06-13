'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import type { Work } from '@/lib/works'
import { CaseStudy } from './case-study'

const ease = [0.22, 1, 0.36, 1] as const

function WorkCard({
  work,
  index,
  isActive,
  onOpen,
}: Readonly<{ work: Work; index: number; isActive: boolean; onOpen: () => void }>) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  return (
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease, delay: (index % 3) * 0.07 }}
      className="group block w-full text-left mb-5 break-inside-avoid cursor-pointer"
    >
      {/* Cover (shared layout element) */}
      <motion.div
        layoutId={`work-${work.slug}`}
        className="relative overflow-hidden bg-surface ring-1 ring-border group-hover:ring-border-strong transition-all duration-500"
        style={{ opacity: isActive ? 0 : 1 }}
      >
        {work.cover && (
          <Image
            src={work.cover}
            alt={work.title}
            width={800}
            height={1000}
            className="w-full h-auto block transition-transform duration-[850ms] ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(to top, rgba(28,28,26,0.88) 0%, rgba(28,28,26,0.25) 55%, transparent 100%)' }}
        />

        {/* Hover content */}
        <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
          <span className="inline-flex items-center gap-2 text-accent text-[10px] tracking-[0.25em] uppercase font-sans">
            <span className="h-1 w-1 rounded-full bg-accent" /> View Case Study
          </span>
          <span className="text-text/80 text-[10px] tracking-[0.2em] font-sans">
            {work.images.length} images
          </span>
        </div>

        {/* Count badge (idle) */}
        <div className="absolute top-3.5 right-3.5 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
          <span className="bg-[rgba(28,28,26,0.65)] text-accent-soft text-[9px] tracking-[0.15em] font-sans px-2 py-1 backdrop-blur-sm border border-white/10">
            {String(work.images.length).padStart(2, '0')}
          </span>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="pt-4 pb-1 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="font-display text-text text-xl md:text-2xl leading-tight group-hover:text-accent transition-colors duration-300">
            {work.title}
          </h3>
          <p className="text-dim text-[10px] tracking-[0.22em] uppercase font-sans mt-1.5">
            {work.category}
          </p>
        </div>
        <span className="text-dim/70 text-[11px] font-sans tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </motion.div>
  )
}

// ─── Mobile sticky-deck card ───────────────────────────────────────────────
function StackCard({
  work,
  index,
  total,
  progress,
  onOpen,
}: Readonly<{
  work: Work
  index: number
  total: number
  progress: MotionValue<number>
  onOpen: () => void
}>) {
  // Earlier cards (lower in the deck) shrink more for a layered depth effect.
  const targetScale = 1 - (total - 1 - index) * 0.035
  const start = index / total
  const scale = useTransform(progress, [start, 1], [1, targetScale])
  const dim = useTransform(progress, [start, 1], [0, 0.4])

  return (
    <div className="sticky" style={{ top: `${96 + index * 12}px` }}>
      <motion.div
        style={{ scale }}
        className="origin-top w-full bg-bg cursor-pointer pb-8"
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpen()
          }
        }}
      >
        <div className="relative aspect-[4/5] overflow-hidden ring-1 ring-border rounded-sm bg-surface">
          {work.cover && (
            <Image
              src={work.cover}
              alt={work.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          )}
          {/* dim overlay as the card gets covered */}
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: dim }}
          />
          {/* count badge */}
          <div className="absolute top-3.5 right-3.5">
            <span className="bg-[rgba(28,28,26,0.65)] text-accent-soft text-[9px] tracking-[0.15em] font-sans px-2 py-1 backdrop-blur-sm border border-white/10">
              {String(work.images.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Footer — left-aligned, tight, Hero-matched counter */}
        <div className="pt-4 flex items-baseline justify-between gap-3">
          <div>
            <h3 className="font-display text-text text-3xl leading-[1.02] tracking-[-0.01em]">
              {work.title}
            </h3>
            <p className="text-dim text-[10px] tracking-[0.22em] uppercase font-sans mt-2">
              {work.category}
            </p>
          </div>
          <span className="text-dim text-[11px] tracking-[0.2em] font-sans tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export function Works({ works }: Readonly<{ works: Work[] }>) {
  const [active, setActive] = useState<Work | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headerRef, { once: true })

  // Mobile sticky-deck scroll progress
  const stackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section id="work" className="px-6 md:px-10 py-20 md:py-28">
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        className="mb-12 md:mb-16 flex items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent accent-glow" />
            <p className="text-muted text-[11px] tracking-[0.32em] uppercase font-sans">
              Selected Work
            </p>
          </div>
          <h2
            className="font-display text-text leading-[0.95] font-light"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
          >
            Portfolio
          </h2>
        </div>
        <span className="text-dim text-[11px] tracking-widest font-sans shrink-0 mb-2">
          {String(works.length).padStart(2, '0')} Projects
        </span>
      </motion.div>

      {/* Masonry grid — desktop / tablet */}
      <div className="hidden md:block columns-2 lg:columns-3 gap-5">
        {works.map((w, i) => (
          <WorkCard
            key={w.slug}
            work={w}
            index={i}
            isActive={active?.slug === w.slug}
            onOpen={() => setActive(w)}
          />
        ))}
      </div>

      {/* Sticky-deck stack — mobile */}
      <div ref={stackRef} className="md:hidden relative">
        {works.map((w, i) => (
          <StackCard
            key={w.slug}
            work={w}
            index={i}
            total={works.length}
            progress={scrollYProgress}
            onOpen={() => setActive(w)}
          />
        ))}
      </div>

      {/* Case study (shared-layout expand) */}
      <AnimatePresence>
        {active && <CaseStudy key={active.slug} work={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  )
}
