'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
}
const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
}
const clip = {
  hidden: { opacity: 0, y: 70 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease } },
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-10 pt-28 pb-20 overflow-hidden">
      {/* Subtle warm wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(212,163,115,0.07) 52%, transparent 100%)',
        }}
      />
      {/* Accent glow */}
      <div
        className="absolute -top-32 right-[-10%] w-[60vw] h-[60vw] pointer-events-none"
        data-parallax="0.15"
        style={{
          background: 'radial-gradient(circle, rgba(212,163,115,0.18) 0%, transparent 60%)',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, #F7F7F5 92%)' }}
      />

      <motion.div
        className="relative z-10 w-full max-w-[1600px] mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow */}
        <motion.div variants={fade} className="flex items-center gap-4 mb-8 md:mb-10">
          <span className="h-1.5 w-1.5 rounded-full bg-accent accent-glow" />
          <p className="text-muted text-[11px] tracking-[0.32em] uppercase font-sans">
            Graphic Designer &amp; Visual Storyteller
          </p>
        </motion.div>

        {/* Name */}
        <div className="overflow-hidden pb-[0.06em]">
          <motion.h1
            variants={clip}
            className="font-display text-text leading-[0.92] tracking-[-0.02em] font-light text-glow pb-[0.12em]"
            style={{ fontSize: 'clamp(3.5rem, 13vw, 12rem)' }}
          >
            Laman
          </motion.h1>
        </div>
        <div className="overflow-hidden pb-[0.06em] mb-10 md:mb-14">
          <motion.h1
            variants={clip}
            className="font-display leading-[0.92] tracking-[-0.02em] font-light pb-[0.12em]"
            style={{
              fontSize: 'clamp(3.5rem, 13vw, 12rem)',
              background: 'linear-gradient(90deg, #1C1C1A 0%, #D4A373 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Hajili
          </motion.h1>
        </div>

        {/* Bottom row */}
        <motion.div
          variants={fade}
          className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-t border-border pt-8"
        >
          <p className="text-muted text-[15px] leading-[1.75] max-w-md font-sans">
            Junior graphic designer passionate about visual storytelling, branding, and crafting
            meaningful brand experiences — from identity systems to packaging and motion.
          </p>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#work"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-bg text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-accent-soft transition-colors duration-300"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-border-strong text-text text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-surface2 transition-all duration-300"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>
      </motion.div>

    </section>
  )
}
