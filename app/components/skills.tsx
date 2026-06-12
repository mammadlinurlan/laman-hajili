'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const TOOLS = [
  'Adobe Photoshop',
  'Adobe Illustrator',
  'Adobe InDesign',
  'Adobe Dimension',
  'Adobe After Effects',
]

const CREATIVE = [
  'Branding',
  'Logo Design',
  'Visual Identity',
  'Typography',
  'Social Media Design',
  'Print Design',
  'Motion Design',
  'Layout Design',
]

function Group({
  label,
  items,
  delay,
}: Readonly<{ label: string; items: string[]; delay: number }>) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease, delay }}
    >
      <p className="text-accent text-[11px] tracking-[0.3em] uppercase font-sans mb-7">{label}</p>
      <div className="flex flex-wrap gap-2.5">
        {items.map((item, i) => (
          <motion.span
            key={item}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: delay + i * 0.05, ease }}
            className="inline-flex items-center px-4 py-2.5 border border-border text-text text-[12px] tracking-[0.08em] font-sans bg-surface/50 hover:bg-primary hover:border-border-strong transition-all duration-300"
          >
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

export function Skills() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <section className="px-6 md:px-10 py-20 md:py-32 border-t border-border">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 26 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        className="mb-14 md:mb-20"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent accent-glow" />
          <p className="text-muted text-[11px] tracking-[0.32em] uppercase font-sans">Expertise</p>
        </div>
        <h2
          className="font-display text-text leading-[0.95] font-light"
          style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}
        >
          Skills &amp; Tools
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-24">
        <Group label="Design Tools" items={TOOLS} delay={0} />
        <Group label="Creative Skills" items={CREATIVE} delay={0.1} />
      </div>
    </section>
  )
}
