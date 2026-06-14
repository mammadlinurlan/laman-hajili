'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CV_URL = '/Leman%20Hajili%20-%20CV.pdf'
const ITEMS = ['Work', 'About', 'Contact'] as const

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) window.__lenis?.stop()
    else window.__lenis?.start()
    return () => { document.body.style.overflow = '' }
  }, [open])

  const toTop = () => {
    setOpen(false)
    if (window.__lenis) window.__lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Mobile menu link: close the overlay first, then smooth-scroll to target.
  const goTo = (id: string) => {
    setOpen(false)
    requestAnimationFrame(() => {
      const el = document.querySelector(id)
      if (el) window.__lenis?.scrollTo(el as HTMLElement, { offset: -72 })
    })
  }

  return (
    <>

      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-[105] flex items-center justify-between px-6 md:px-10 pt-7 pb-4 md:py-5 transition-all duration-500 bg-bg/80 backdrop-blur-md border-b border-border ${scrolled ? '' : 'md:bg-transparent md:backdrop-blur-none md:border-transparent'
          }`}
      >
        <button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          className="font-display text-text text-xl md:text-2xl tracking-tight hover:text-accent transition-colors duration-300 leading-none"
        >
          {" "}
        </button>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-9">
          {ITEMS.map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-muted hover:text-text text-[11px] tracking-[0.18em] uppercase font-sans transition-colors duration-300"
            >
              {label}
            </a>
          ))}
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.18em] uppercase font-sans text-bg bg-accent hover:bg-accent-soft px-4 py-2 transition-colors duration-300"
          >
            CV
          </a>
        </nav>

        {/* Burger (mobile) */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="md:hidden relative z-[110] mr-2 flex flex-col items-center justify-center gap-1.5 w-8 h-8"
        >
          <span
            className={`block h-px bg-text transition-all duration-300 ${open ? 'w-6 translate-y-[3px] rotate-45' : 'w-6'}`}
          />
          <span
            className={`block h-px bg-text transition-all duration-300 ${open ? 'w-6 -translate-y-[3px] -rotate-45' : 'w-4'}`}
          />
        </button>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="md:hidden fixed inset-0 z-[100] bg-bg/97 backdrop-blur-lg flex flex-col justify-center px-8"
          >
            <nav className="flex flex-col gap-2">
              {ITEMS.map((label, i) => (
                <motion.a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  data-no-smooth
                  onClick={e => {
                    e.preventDefault()
                    goTo(`#${label.toLowerCase()}`)
                  }}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-text text-5xl py-2 hover:text-accent transition-colors duration-300"
                >
                  {label}
                </motion.a>
              ))}
              <motion.a
                href={CV_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + ITEMS.length * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-accent text-5xl py-2 transition-colors duration-300"
              >
                CV ↗
              </motion.a>
            </nav>

            <div className="absolute bottom-10 left-8 right-8 flex items-center justify-between text-dim text-[10px] tracking-[0.2em] uppercase font-sans">
              <span>Graphic Designer</span>
              <span>Azerbaijan</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
