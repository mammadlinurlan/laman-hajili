'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

function Reveal({
  children,
  delay = 0,
  className = '',
}: Readonly<{ children: React.ReactNode; delay?: number; className?: string }>) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

const values = [
  { n: '01', title: 'Visual Storytelling', desc: 'Every design tells a story — I craft visuals that communicate ideas with clarity and emotion.' },
  { n: '02', title: 'Attention to Detail', desc: 'Typography, spacing, colour — the smallest decisions shape the biggest impressions.' },
  { n: '03', title: 'Creative Curiosity', desc: 'Constantly exploring new tools and aesthetics to push creative boundaries forward.' },
  { n: '04', title: 'Continuous Learning', desc: "Design keeps evolving — I stay sharp by studying the world's best work every day." },
]

export function About() {
  return (
    <section id="about" className="px-6 md:px-10 py-20 md:py-32 border-t border-border">
      <Reveal>
        <div className="flex items-center gap-3 mb-12 md:mb-16">
          <span className="h-1.5 w-1.5 rounded-full bg-accent accent-glow" />
          <p className="text-muted text-[11px] tracking-[0.32em] uppercase font-sans">About</p>
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mb-16 md:mb-24">
        <blockquote
          className="font-display text-text leading-[1.15] max-w-5xl font-light"
          style={{ fontSize: 'clamp(1.7rem, 4.2vw, 3.4rem)' }}
        >
          I create brand identities, packaging, and visual experiences that help brands find their
          voice — <span className="text-accent">beautifully</span>, and with intent.
        </blockquote>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-12 md:gap-24">
        <Reveal delay={0.08}>
          <p className="text-muted text-[15px] leading-[1.85] mb-6">
            I&apos;m Laman — a graphic designer based in Azerbaijan with a deep passion for branding,
            motion design, and visual storytelling. I believe great design isn&apos;t only beautiful;
            it communicates, connects, and leaves a lasting impression.
          </p>
          <p className="text-muted text-[15px] leading-[1.85]">
            My work spans brand identity systems, packaging, social-media creatives, and print —
            always crafted with intention and a relentless eye for detail.
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-9">
            {values.map(v => (
              <div key={v.n} className="group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-accent text-[11px] font-sans tracking-widest">{v.n}</span>
                  <div className="h-px flex-1 bg-border group-hover:bg-border-strong transition-colors duration-300" />
                </div>
                <h4 className="font-display text-text text-lg mb-1.5 group-hover:text-accent transition-colors duration-300">{v.title}</h4>
                <p className="text-muted text-[13px] leading-[1.7]">{v.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
