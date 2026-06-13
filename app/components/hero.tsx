'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from 'framer-motion'
import { PenTool } from './pen-tool'

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

const BG_WORDS = [
  'BRANDING', 'TYPOGRAPHY', 'IDENTITY', 'PACKAGING',
  'MOTION', 'EDITORIAL', 'LAYOUT', 'COLOR THEORY',
  'LOGOMARK', 'ART DIRECTION', 'GRID SYSTEMS', 'COMPOSITION',
]

const KEYWORD_IMAGES: Record<string, string> = {
  branding: '/works/boreal-gin/first.jpg',
  packaging: '/works/jardin-secret/first.jpg',
  motion: '/works/spotify-cover/first.jpg',
}

// ─── Available badge ───────────────────────────────────────────────────────


// ─── Magnetic CTA button ───────────────────────────────────────────────────
interface MagneticProps {
  readonly children: React.ReactNode
  readonly href: string
  readonly className: string
}

function MagneticLink({ children, href, className }: Readonly<MagneticProps>) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.32)
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.32)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.a>
  )
}

// ─── Keyword hover image popup ─────────────────────────────────────────────
interface KeywordProps {
  readonly word: string
  readonly imageKey: string
  readonly onActivate: (key: string | null) => void
}

function KeywordSpan({ word, imageKey, onActivate }: Readonly<KeywordProps>) {
  return (
    <span
      aria-hidden="true"
      onMouseEnter={() => onActivate(imageKey)}
      onMouseLeave={() => onActivate(null)}
      className="relative inline-block italic text-accent cursor-default origin-bottom transition-transform duration-300 hover:scale-110
                 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:bg-accent
                 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
    >
      {word}
    </span>
  )
}

// ─── Background marquee row ────────────────────────────────────────────────
function BgMarqueeRow({ reverse = false }: Readonly<{ reverse?: boolean }>) {
  const words = [...BG_WORDS, ...BG_WORDS]
  return (
    <div className="flex whitespace-nowrap opacity-[0.028] overflow-hidden">
      <motion.div
        className="flex shrink-0"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
      >
        {words.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="font-display font-light px-8 text-text select-none"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', letterSpacing: '-0.01em' }}
          >
            {w}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Vertical marquee (mobile editorial right column) ─────────────────────
function VerticalMarquee() {
  const items = ['DESIGN', '•', 'IDENTITY', '•', 'MOTION', '•', '2026', '•']
  const set = [...items, ...items, ...items] // fill the column height
  return (
    <div className="absolute inset-0 flex justify-center overflow-hidden">
      <motion.div
        className="flex flex-col items-center gap-7"
        animate={{ y: ['-50%', '0%'] }}
        transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
      >
        {[...set, ...set].map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="text-bg/85 font-display font-semibold text-lg select-none"
            style={{ writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: '0.05em' }}
          >
            {w}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null)

  // Mouse-following blob
  const rawX = useMotionValue(50)
  const rawY = useMotionValue(50)
  const blobX = useSpring(rawX, { stiffness: 50, damping: 20, mass: 0.5 })
  const blobY = useSpring(rawY, { stiffness: 50, damping: 20, mass: 0.5 })
  const blobBg = useMotionTemplate`radial-gradient(circle at ${blobX}% ${blobY}%, rgba(79,70,229,0.10) 0%, transparent 58%)`

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      rawX.set(((e.clientX - rect.left) / rect.width) * 100)
      rawY.set(((e.clientY - rect.top) / rect.height) * 100)
    }
    globalThis.addEventListener('mousemove', onMove)
    return () => globalThis.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-screen flex flex-col justify-center overflow-hidden md:px-10 md:pt-28 md:pb-20"
    >
      {/* Designer grid overlay */}
      <div className="absolute inset-0 pointer-events-none grid-overlay" />

      {/* Pen Tool — live vector-path mouse interaction (desktop only) */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <PenTool />
      </div>

      {/* Mouse-follow blob (desktop only) */}
      <motion.div className="absolute inset-0 pointer-events-none hidden md:block" style={{ background: blobBg }} />

      {/* Static accent glow top-right */}
      <div
        className="absolute -top-24 right-[-8%] w-[55vw] h-[55vw] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 65%)' }}
      />

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, #F8F9FA 92%)' }}
      />

      {/* Background marquee — desktop only (overlaps name on mobile) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 -z-10 pointer-events-none select-none hidden md:flex flex-col gap-4">
        <BgMarqueeRow />
        <BgMarqueeRow reverse />
      </div>

      {/* Hover-to-reveal preview — sits in the clean right-side workspace (desktop) */}
      <div className="hidden lg:block absolute top-1/2 right-[7%] -translate-y-1/2 z-10 w-72 xl:w-80 aspect-[3/4] pointer-events-none">
        <AnimatePresence mode="wait">
          {activeKeyword && KEYWORD_IMAGES[activeKeyword] && (
            <motion.div
              key={activeKeyword}
              className="absolute inset-0 overflow-hidden rounded-sm ring-1 ring-border shadow-2xl shadow-black/10 bg-surface"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease }}
            >
              <img
                src={KEYWORD_IMAGES[activeKeyword]}
                alt=""
                className="w-full h-full object-cover block"
                draggable={false}
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/70 to-transparent">
                <span className="text-white/90 text-[10px] tracking-[0.28em] uppercase font-sans">
                  {activeKeyword}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile editorial layout — 75/25 split with vertical marquee ── */}
      <div className="md:hidden relative z-20 flex min-h-screen w-full">
        {/* Left column (≈75%): typography + buttons */}
        <div className="flex-1 flex flex-col justify-between pl-6 pr-5 pt-28 pb-12">
          {/* Top: eyebrow + status */}
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent accent-glow" />
              <p className="text-muted text-[10px] tracking-[0.3em] uppercase font-sans">
                Graphic Designer
              </p>
            </div>
          </div>

          {/* Middle: name + bio */}
          <div>
            <h1 className="font-display text-black font-light leading-[0.88] tracking-[-0.02em] text-6xl">
              Laman
              <br />
              Hajili
            </h1>
            <p className="text-muted text-[14px] leading-[1.7] font-sans mt-7 max-w-[16rem]">
              Junior graphic designer crafting{' '}
              <KeywordSpan word="branding" imageKey="branding" onActivate={setActiveKeyword} />,{' '}
              <KeywordSpan word="packaging" imageKey="packaging" onActivate={setActiveKeyword} /> &amp;{' '}
              <KeywordSpan word="motion" imageKey="motion" onActivate={setActiveKeyword} /> for
              meaningful brand experiences.
            </p>
          </div>

          {/* Bottom: stacked editorial buttons */}
          <div className="flex flex-col gap-3 w-full">
            <a
              href="#work"
              className="w-full text-center px-6 py-4 bg-accent text-bg text-[11px] tracking-[0.25em] uppercase font-sans"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="w-full text-center px-6 py-4 border border-text text-text text-[11px] tracking-[0.25em] uppercase font-sans"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Right column (≈25%): solid indigo + vertical marquee */}
        <div className="w-1/4 bg-accent relative overflow-hidden">
          <VerticalMarquee />
        </div>
      </div>

      {/* Main content — desktop */}
      <motion.div
        className="hidden md:block relative z-20 w-full max-w-400 mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow + Available badge */}

        {/* Name */}
        <div className="overflow-hidden pb-[0.06em]">
          <motion.h1
            variants={clip}
            className="font-display text-text leading-[0.92] tracking-[-0.02em] font-light text-glow pb-[0.12em] text-5xl sm:text-7xl md:text-8xl lg:text-[11rem]"
          >
            Laman
          </motion.h1>
        </div>
        <div className="overflow-hidden pb-[0.06em] mb-10 md:mb-14 md:pl-32">
          <motion.h1
            variants={clip}
            className="font-display leading-[0.92] tracking-[-0.02em] font-light pb-[0.12em] text-5xl sm:text-7xl md:text-8xl lg:text-[11rem]"
            style={{
              background: 'linear-gradient(90deg, #111111 0%, #4F46E5 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Hajili
          </motion.h1>
        </div>

        {/* Bio + magnetic CTAs */}
        <motion.div
          variants={fade}
          className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-t border-border pt-8"
        >
          <p className="text-muted text-[15px] leading-[1.75] max-w-md font-sans">
            Junior graphic designer passionate about visual storytelling,{' '}
            <KeywordSpan word="branding" imageKey="branding" onActivate={setActiveKeyword} />, and crafting
            meaningful brand experiences — from identity systems to{' '}
            <KeywordSpan word="packaging" imageKey="packaging" onActivate={setActiveKeyword} /> and{' '}
            <KeywordSpan word="motion" imageKey="motion" onActivate={setActiveKeyword} />.
          </p>

          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto shrink-0">
            <MagneticLink
              href="#work"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-7 py-3.5 bg-accent text-bg text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-accent-soft transition-colors duration-300"
            >
              View Work
            </MagneticLink>
            <MagneticLink
              href="#contact"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-7 py-3.5 border border-border-strong text-text text-[11px] tracking-[0.2em] uppercase font-sans hover:bg-surface2 transition-all duration-300"
            >
              Get in Touch
            </MagneticLink>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
