'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const STEPS = [
  { num: '01', title: 'Discovery', desc: 'Understanding goals, audience, and the story the brand wants to tell.' },
  { num: '02', title: 'Research', desc: 'Gathering inspiration, studying references, and forming a creative strategy.' },
  { num: '03', title: 'Concept Development', desc: 'Building creative directions and refining the strongest visual language.' },
  { num: '04', title: 'Design', desc: 'Crafting precise visual solutions and iterating until every detail is right.' },
  { num: '05', title: 'Delivery', desc: 'Preparing final assets and guidelines so the work lands exactly as intended.' },
]

function Step({ step, index }: Readonly<{ step: typeof STEPS[0]; index: number }>) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease, delay: index * 0.08 }}
      className="group grid grid-cols-[3.5rem_1fr] md:grid-cols-[5rem_1fr] gap-5 md:gap-8 py-7 border-t border-border hover:bg-surface/40 transition-colors duration-500 px-2 -mx-2"
    >
      <span className="font-display text-dim text-2xl md:text-3xl group-hover:text-accent transition-colors duration-500 tabular-nums">
        {step.num}
      </span>
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-12">
        <h3 className="font-display text-text text-xl md:text-2xl md:w-72 shrink-0 group-hover:translate-x-1 transition-transform duration-300">
          {step.title}
        </h3>
        <p className="text-muted text-[14px] leading-[1.75] max-w-md">{step.desc}</p>
      </div>
    </motion.div>
  )
}

export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <section className="px-6 md:px-10 py-20 md:py-32 border-t border-border">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 26 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        className="mb-12 md:mb-16"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent accent-glow" />
          <p className="text-muted text-[11px] tracking-[0.32em] uppercase font-sans">Workflow</p>
        </div>
        <h2
          className="font-display text-text leading-[0.95] font-light"
          style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}
        >
          Design Process
        </h2>
      </motion.div>

      <div className="border-b border-border">
        {STEPS.map((s, i) => (
          <Step key={s.num} step={s} index={i} />
        ))}
      </div>
    </section>
  )
}
