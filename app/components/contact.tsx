'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const LINKS = [
  { label: 'Email', value: 'leman.hacili14@gmail.com', href: 'mailto:leman.hacili14@gmail.com' },
  { label: 'Instagram', value: '@craftedbyhj', href: 'https://www.instagram.com/craftedbyhj/' },
  { label: 'Behance', value: 'View profile', href: 'https://www.behance.net/lemanhajili' },
]

const CV_URL = '/Leman%20Hajili%20-%20CV.pdf'

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
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

export function Contact() {
  return (
    <section
      id="contact"
      className="relative px-6 md:px-10 py-20 md:py-32 border-t border-border overflow-hidden"
    >
      {/* glow */}
      <div
        className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vw] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 65%)' }}
      />

      <div className="relative z-10">
        <Reveal>
          <div className="flex items-center gap-3 mb-12 md:mb-16">
            <span className="h-1.5 w-1.5 rounded-full bg-accent accent-glow" />
            <p className="text-muted text-[11px] tracking-[0.32em] uppercase font-sans">Contact</p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2
            className="font-display text-text leading-[0.92] font-light mb-14 md:mb-20"
            style={{ fontSize: 'clamp(2.6rem, 8vw, 7rem)' }}
          >
            Let&apos;s work
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #111111 0%, #4F46E5 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              together
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-l border-border max-w-4xl">
            {LINKS.map(({ label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex flex-col gap-2 p-6 border-r border-b border-border hover:bg-primary transition-colors duration-300"
              >
                <span className="text-dim group-hover:text-accent-soft text-[9px] tracking-[0.28em] uppercase font-sans transition-colors duration-300">
                  {label}
                </span>
                <span className="font-display text-text group-hover:text-accent text-base md:text-[17px] transition-colors duration-300 break-words">
                  {value}
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        {/* Footer bar */}
        <Reveal delay={0.15}>
          <div className="mt-24 md:mt-32 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <p className="text-muted text-[13px] leading-relaxed max-w-xs">
              Available for freelance projects &amp; collaborations.
            </p>
            <div className="flex items-center gap-6">
              <a
                href={CV_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text text-[10px] tracking-[0.2em] uppercase font-sans hover:text-accent transition-colors duration-300"
              >
                View CV ↗
              </a>
              <span className="text-dim text-[10px] tracking-widest font-sans">
                © {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
