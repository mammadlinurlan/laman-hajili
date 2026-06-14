'use client'

import { useRef, useState, useEffect } from 'react'
import {
  motion, useMotionValue, useSpring, useTransform,
  useMotionTemplate, AnimatePresence,
} from 'framer-motion'
import { PenTool } from './pen-tool'

const ease = [0.22, 1, 0.36, 1] as const

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.6 } },
}

// Premium load motion — Laman glides in from the left, Hajili rises from below,
// both resolve from soft blur to sharp.
const lamanV = {
  hidden: { opacity: 0, x: -90, filter: 'blur(16px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease } },
}
const hajiliV = {
  hidden: { opacity: 0, y: 90, filter: 'blur(16px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease, delay: 0.16 } },
}

// Background spotlight typography
const TYPE_ROWS = ['BRANDING', 'TYPOGRAPHY', 'IDENTITY', 'PACKAGING', 'MOTION', 'EDITORIAL']

const KEYWORD_IMAGES: Record<string, string> = {
  branding: '/works/boreal-gin/first.jpg',
  packaging: '/works/jardin-secret/first.jpg',
  motion: '/works/spotify-cover/first.jpg',
}

// ─── Magnetic CTA button ───────────────────────────────────────────────────
interface MagneticProps {
  readonly children: React.ReactNode
  readonly href: string
  readonly className: string
  readonly cursorLabel?: string
}

function MagneticLink({ children, href, className, cursorLabel }: Readonly<MagneticProps>) {
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
      data-cursor={cursorLabel}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
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

// ─── Floating design-system decor (ultra-low-opacity, decorative only) ─────
function DesignDecor() {
  const float = (dur: number, dy: number, dr = 0) => ({
    animate: { y: [0, dy, 0], rotate: [0, dr, 0] },
    transition: { duration: dur, ease: 'easeInOut' as const, repeat: Infinity },
  })
  const stroke = 'rgba(17,17,17,0.55)'
  const accent = 'rgba(79,70,229,0.75)'

  return (
    <div className="absolute inset-0 z-[-5] pointer-events-none hidden md:block">
      {/* Registration mark — top left */}
      <motion.svg
        className="absolute top-[16%] left-[8%] opacity-[0.10]"
        width="46" height="46" viewBox="0 0 46 46" fill="none"
        {...float(11, -10)}
      >
        <circle cx="23" cy="23" r="11" stroke={stroke} strokeWidth="1" />
        <path d="M23 1V45M1 23H45" stroke={stroke} strokeWidth="1" />
      </motion.svg>

      {/* Bezier curve + anchor handles — upper right */}
      <motion.svg
        className="absolute top-[20%] right-[16%] opacity-[0.12]"
        width="150" height="90" viewBox="0 0 150 90" fill="none"
        {...float(14, 12, 2)}
      >
        <path d="M6 84 C 40 6, 110 6, 144 84" stroke={accent} strokeWidth="1" />
        <line x1="6" y1="84" x2="40" y2="20" stroke={stroke} strokeWidth="0.75" strokeDasharray="3 3" />
        <line x1="144" y1="84" x2="110" y2="20" stroke={stroke} strokeWidth="0.75" strokeDasharray="3 3" />
        <rect x="2" y="80" width="8" height="8" fill={accent} />
        <rect x="140" y="80" width="8" height="8" fill={accent} />
        <circle cx="40" cy="20" r="3" stroke={stroke} strokeWidth="1" fill="none" />
        <circle cx="110" cy="20" r="3" stroke={stroke} strokeWidth="1" fill="none" />
      </motion.svg>

      {/* Measurement indicator — lower left */}
      <motion.svg
        className="absolute bottom-[22%] left-[12%] opacity-[0.11]"
        width="130" height="20" viewBox="0 0 130 20" fill="none"
        {...float(10, 8)}
      >
        <line x1="2" y1="10" x2="128" y2="10" stroke={stroke} strokeWidth="1" />
        <line x1="2" y1="3" x2="2" y2="17" stroke={stroke} strokeWidth="1" />
        <line x1="128" y1="3" x2="128" y2="17" stroke={stroke} strokeWidth="1" />
        <line x1="65" y1="5" x2="65" y2="15" stroke={stroke} strokeWidth="0.75" />
      </motion.svg>

      {/* Corner guide bracket — lower right */}
      <motion.svg
        className="absolute bottom-[18%] right-[10%] opacity-[0.12]"
        width="40" height="40" viewBox="0 0 40 40" fill="none"
        {...float(13, -12, -2)}
      >
        <path d="M2 14V2H14" stroke={accent} strokeWidth="1" />
        <path d="M38 26V38H26" stroke={accent} strokeWidth="1" />
      </motion.svg>

      {/* Plus / guide ticks — scattered */}
      <motion.svg
        className="absolute top-[58%] left-[46%] opacity-[0.10]"
        width="18" height="18" viewBox="0 0 18 18" fill="none"
        {...float(9, 6)}
      >
        <path d="M9 1V17M1 9H17" stroke={stroke} strokeWidth="1" />
      </motion.svg>
    </div>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null)

  // Normalised pointer (0..1) + raw pixel coords within the section.
  const mvX = useMotionValue(0.5)
  const mvY = useMotionValue(0.5)
  const pxX = useMotionValue(0)
  const pxY = useMotionValue(0)

  // 1 — Spotlight that follows the cursor (smooth, lerped via spring).
  const sbX = useSpring(mvX, { stiffness: 60, damping: 20, mass: 0.6 })
  const sbY = useSpring(mvY, { stiffness: 60, damping: 20, mass: 0.6 })
  const sbXpct = useTransform(sbX, v => `${v * 100}%`)
  const sbYpct = useTransform(sbY, v => `${v * 100}%`)
  const spotlight = useMotionTemplate`radial-gradient(620px circle at ${sbXpct} ${sbYpct}, rgba(79,70,229,0.13) 0%, rgba(79,70,229,0.04) 35%, transparent 62%)`

  // 7 — Reveal mask for background typography (tracks cursor in px).
  const rmX = useSpring(pxX, { stiffness: 140, damping: 24, mass: 0.4 })
  const rmY = useSpring(pxY, { stiffness: 140, damping: 24, mass: 0.4 })
  const revealMask = useMotionTemplate`radial-gradient(300px circle at ${rmX}px ${rmY}px, #000 0%, rgba(0,0,0,0.35) 50%, transparent 74%)`

  // 2 — Luxury grid parallax (extremely subtle).
  const gridX = useSpring(useTransform(mvX, [0, 1], [10, -10]), { stiffness: 50, damping: 18 })
  const gridY = useSpring(useTransform(mvY, [0, 1], [10, -10]), { stiffness: 50, damping: 18 })

  // 5 — 3D name-block tilt (max 3°).
  const rotY = useSpring(useTransform(mvX, [0, 1], [3, -3]), { stiffness: 80, damping: 14 })
  const rotX = useSpring(useTransform(mvY, [0, 1], [-3, 3]), { stiffness: 80, damping: 14 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      mvX.set(px / rect.width)
      mvY.set(py / rect.height)
      pxX.set(px)
      pxY.set(py)
    }
    globalThis.addEventListener('mousemove', onMove)
    return () => globalThis.removeEventListener('mousemove', onMove)
  }, [mvX, mvY, pxX, pxY])

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-screen flex flex-col justify-center overflow-hidden md:px-10 md:pt-28 md:pb-20"
    >
      {/* Luxury grid with subtle parallax depth */}
      <motion.div
        className="absolute -inset-8 pointer-events-none grid-overlay hidden md:block"
        style={{ x: gridX, y: gridY }}
      />
      <div className="absolute inset-0 pointer-events-none grid-overlay md:hidden" />

      {/* Pen Tool — live vector-path mouse interaction (desktop only) */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <PenTool />
      </div>

      {/* Background spotlight typography (revealed through the cursor mask) */}
      <div className="absolute inset-0 -z-10 hidden md:flex flex-col justify-center gap-1 px-10 select-none overflow-hidden pointer-events-none">
        {/* base — barely-there */}
        <div className="absolute inset-0 flex flex-col justify-center gap-1 px-10">
          {TYPE_ROWS.map(w => (
            <span
              key={`base-${w}`}
              className="font-display font-light text-text leading-[0.95] opacity-[0.022]"
              style={{ fontSize: 'clamp(3rem, 9vw, 9rem)', letterSpacing: '-0.02em' }}
            >
              {w}
            </span>
          ))}
        </div>
        {/* reveal — brighter copy unmasked only near the cursor */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-center gap-1 px-10"
          style={{ WebkitMaskImage: revealMask, maskImage: revealMask }}
        >
          {TYPE_ROWS.map(w => (
            <span
              key={`reveal-${w}`}
              className="font-display font-light text-accent leading-[0.95] opacity-[0.10]"
              style={{ fontSize: 'clamp(3rem, 9vw, 9rem)', letterSpacing: '-0.02em' }}
            >
              {w}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Cursor-following spotlight */}
      <motion.div className="absolute inset-0 pointer-events-none hidden md:block z-[-1]" style={{ background: spotlight }} />

      {/* Floating design-system decor */}
      <DesignDecor />

      {/* Static accent glow top-right */}
      <div
        className="absolute -top-24 right-[-8%] w-[55vw] h-[55vw] pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 65%)' }}
      />

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, #F8F9FA 92%)' }}
      />

      {/* Hover-to-reveal preview — sits in the clean right-side workspace (desktop) */}
      <div className="hidden lg:block absolute top-1/2 right-[7%] -translate-y-1/2 z-10 w-72 xl:w-80 aspect-3/4 pointer-events-none">
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

      {/* ── Mobile hero — clean workspace artboard layout ─── */}
      <div className="md:hidden relative z-20 px-6 pt-8 pb-10">
        <div className="flex items-center gap-3 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-accent accent-glow" />
          <p className="text-muted text-[10px] tracking-[0.3em] uppercase font-sans">
            Graphic Designer
          </p>
        </div>

        <div className="mb-10">
          <h1 className="font-display text-black font-light leading-[0.88] tracking-[-0.02em] text-[4.5rem]">
            Laman
            <br />
            Hajili
          </h1>
          <p className="text-muted text-[14px] leading-[1.7] font-sans mt-6 max-w-88">
            Junior graphic designer crafting{' '}
            <KeywordSpan word="branding" imageKey="branding" onActivate={setActiveKeyword} />,{' '}
            <KeywordSpan word="packaging" imageKey="packaging" onActivate={setActiveKeyword} /> &amp;{' '}
            <KeywordSpan word="motion" imageKey="motion" onActivate={setActiveKeyword} /> for
            meaningful brand experiences.
          </p>
        </div>

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

      {/* Main content — desktop */}
      <div className="hidden md:block relative z-20 w-full max-w-400 mx-auto" style={{ perspective: 1200 }}>
        {/* Name — 3D tilt block */}
        <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}>
          <div className="pb-[0.06em]">
            <motion.h1
              variants={lamanV}
              initial="hidden"
              animate="show"
              className="font-display text-text leading-[0.92] tracking-[-0.02em] font-light text-glow pb-[0.12em] text-5xl sm:text-7xl md:text-8xl lg:text-[11rem]"
            >
              Laman
            </motion.h1>
          </div>
          <div className="pb-[0.06em] mb-10 md:mb-14 md:pl-32">
            <motion.h1
              variants={hajiliV}
              initial="hidden"
              animate="show"
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
        </motion.div>

        {/* Bio + magnetic CTAs */}
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
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
              cursorLabel="View"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-7 py-3.5 bg-accent text-bg text-[11px] tracking-[0.2em] uppercase font-sans transition-[background-color,box-shadow] duration-300 hover:bg-accent-soft hover:shadow-[0_10px_30px_-8px_rgba(79,70,229,0.5)]"
            >
              View Work
            </MagneticLink>
            <MagneticLink
              href="#contact"
              cursorLabel="Say hi"
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-7 py-3.5 border border-border-strong text-text text-[11px] tracking-[0.2em] uppercase font-sans transition-[border-color,background-color] duration-300 hover:border-accent hover:bg-surface2"
            >
              Get in Touch
            </MagneticLink>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
