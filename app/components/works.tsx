'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import type { Work } from '@/lib/works'
import { Album } from './album'

const ease = [0.22, 1, 0.36, 1] as const

function WorkCard({
  work,
  index,
  onOpen,
}: Readonly<{ work: Work; index: number; onOpen: () => void }>) {
  const ref = useRef<HTMLButtonElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease, delay: (index % 3) * 0.07 }}
      className="group block w-full text-left"
    >
      {/* Cover */}
      <div className="relative overflow-hidden bg-surface ring-1 ring-border group-hover:ring-border-strong transition-all duration-500">
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
            <span className="h-1 w-1 rounded-full bg-accent" /> Open Album
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
      </div>

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
    </motion.button>
  )
}

export function Works({ works }: Readonly<{ works: Work[] }>) {
  const [active, setActive] = useState<Work | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headerRef, { once: true })

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

      {/* Works grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 items-start">
        {works.map((w, i) => (
          <WorkCard key={w.slug} work={w} index={i} onOpen={() => setActive(w)} />
        ))}
      </div>

      {/* Album */}
      {active && <Album work={active} onClose={() => setActive(null)} />}
    </section>
  )
}
