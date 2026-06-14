'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Move, BoxSelect, PenTool as PenIcon, Type,
  Eye, EyeOff, Minus, Square, X,
  Layers as LayersIcon, Folder, FileText, Settings2,
} from 'lucide-react'
import type { Work } from '@/lib/works'
import { Hero } from './hero'
import { Works } from './works'
import { Marquee } from './marquee'
import { About } from './about'
import { Skills } from './skills'
import { Process } from './process'
import { Contact } from './contact'

// ─── Photoshop app-icon badge ──────────────────────────────────────────────
function PsIcon({ size = 22 }: Readonly<{ size?: number }>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Photoshop"
    >
      <rect width="22" height="22" rx="4" fill="#001e36" />
      <text
        x="3"
        y="16"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontSize="13"
        fontWeight="900"
        fill="#31A8FF"
        letterSpacing="-0.5"
      >
        Ps
      </text>
    </svg>
  )
}

// ─── Types ─────────────────────────────────────────────────────────────────
type GroupKey = 'hero' | 'portfolio' | 'about' | 'contact'

type MenuItemDef =
  | { label: string; action?: string; disabled?: boolean }
  | { sep: true }

// ─── Static data ───────────────────────────────────────────────────────────
const TOOLS = [
  { id: 'V', label: 'Move Tool',    icon: Move,      target: '#hero',    group: 'hero'      as GroupKey },
  { id: 'M', label: 'Marquee Tool', icon: BoxSelect,  target: '#work',    group: 'portfolio' as GroupKey },
  { id: 'P', label: 'Pen Tool',     icon: PenIcon,   target: '#about',   group: 'about'     as GroupKey },
  { id: 'T', label: 'Type Tool',    icon: Type,      target: '#contact', group: 'contact'   as GroupKey },
]

const LAYERS: { key: GroupKey; label: string; type: 'Group' | 'Layer' }[] = [
  { key: 'hero',      label: 'Hero Section',     type: 'Group' },
  { key: 'portfolio', label: 'Selected Works',   type: 'Group' },
  { key: 'about',     label: 'Creative Process', type: 'Group' },
  { key: 'contact',   label: 'Contact',          type: 'Layer' },
]

const CV_URL = '/Leman%20Hajili%20-%20CV.pdf'

const MENU_DEFS: Record<string, MenuItemDef[]> = {
  File: [
    { label: 'Download CV…',    action: 'downloadCV' },
    { sep: true },
    { label: 'Share Portfolio', action: 'share' },
  ],
  Edit: [
    { label: 'Undo',            disabled: true },
    { label: 'Redo',            disabled: true },
    { sep: true },
    { label: 'Preferences…',    disabled: true },
  ],
  Image: [
    { label: 'Image Size…',     disabled: true },
    { label: 'Canvas Size…',    disabled: true },
    { sep: true },
    { label: 'Trim…',           disabled: true },
  ],
  Layer: [
    { label: 'New Layer',       disabled: true },
    { label: 'Duplicate…',      disabled: true },
    { sep: true },
    { label: 'Flatten Workspace', action: 'flatten' },
  ],
  Window: [
    { label: 'Toolbar',         action: 'toggleToolbar' },
    { label: 'Layers Panel',    action: 'toggleLayers'  },
    { sep: true },
    { label: 'Reset Workspace', action: 'resetWorkspace' },
  ],
  Help: [
    { label: 'About Laman Hajili',  disabled: true },
    { sep: true },
    { label: 'Keyboard Shortcuts',  disabled: true },
  ],
}

const MENU_LABELS = Object.keys(MENU_DEFS)

// ─── Helpers ───────────────────────────────────────────────────────────────
function scrollToTarget(sel: string) {
  const el = document.querySelector(sel)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el as HTMLElement, { offset: -48 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

// ─── Workspace ─────────────────────────────────────────────────────────────
export function Workspace({ works }: Readonly<{ works: Work[] }>) {
  const [activeTool,     setActiveTool]     = useState('V')
  const [visible,        setVisible]        = useState<Record<GroupKey, boolean>>({
    hero: true, portfolio: true, about: true, contact: true,
  })
  const [openMenu,       setOpenMenu]       = useState<string | null>(null)
  const [showToolbar,    setShowToolbar]    = useState(true)
  const [showLayersPanel, setShowLayersPanel] = useState(true)

  const menuBarRef = useRef<HTMLElement>(null)

  const toggle = (key: GroupKey) =>
    setVisible(v => ({ ...v, [key]: !v[key] }))

  const selectTool = (id: string, target: string) => {
    setActiveTool(id)
    scrollToTarget(target)
  }

  // Sync active tool to section in viewport
  useEffect(() => {
    const ids = ['hero', 'work', 'about', 'contact']
    const map: Record<string, string> = { hero: 'V', work: 'M', about: 'P', contact: 'T' }
    const obs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting && map[e.target.id]) setActiveTool(map[e.target.id])
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  // Close dropdown when clicking outside the menu bar
  useEffect(() => {
    if (!openMenu) return
    const handler = (e: MouseEvent) => {
      if (!menuBarRef.current?.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openMenu])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleAction = (action: string) => {
    setOpenMenu(null)
    switch (action) {
      case 'downloadCV':
        window.open(CV_URL, '_blank')
        break
      case 'share':
        navigator.clipboard?.writeText(globalThis.location.href)
        break
      case 'flatten':
        setShowToolbar(false)
        setShowLayersPanel(false)
        break
      case 'toggleToolbar':
        setShowToolbar(v => !v)
        break
      case 'toggleLayers':
        setShowLayersPanel(v => !v)
        break
      case 'resetWorkspace':
        setShowToolbar(true)
        setShowLayersPanel(true)
        break
    }
  }

  const hide = (key: GroupKey) => (visible[key] ? '' : 'hidden')

  return (
    <div className="relative min-h-screen bg-[#1e1e1e]">

      {/* ── Desktop Top App Bar (with interactive dropdowns) ── */}
      <header
        ref={menuBarRef}
        className="hidden md:flex fixed top-0 inset-x-0 h-8 bg-[#2b2b2b] border-b border-[#1a1a1a] items-center px-3 gap-1 text-xs text-gray-400 z-50"
      >
        <PsIcon size={20} />
        <div className="w-2 shrink-0" />

        {/* Menu triggers + dropdowns */}
        {MENU_LABELS.map(label => (
          <div key={label} className="relative">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={openMenu === label}
              onClick={() => setOpenMenu(o => (o === label ? null : label))}
              className={`px-2.5 py-1 rounded-sm transition-colors select-none ${
                openMenu === label
                  ? 'bg-[#3d3d3d] text-white'
                  : 'hover:bg-[#3d3d3d] hover:text-white'
              }`}
            >
              {label}
            </button>

            <AnimatePresence>
              {openMenu === label && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0,  scale: 1     }}
                  exit={{    opacity: 0, y: -6, scale: 0.97  }}
                  transition={{ duration: 0.11, ease: 'easeOut' }}
                  className="absolute top-full left-0 mt-0.5 w-44 bg-[#2b2b2b] border border-[#1a1a1a] shadow-2xl py-1 z-60"
                >
                  {MENU_DEFS[label].map((item, i) => {
                    if ('sep' in item) {
                      return <hr key={`${label}-sep-${i}`} className="border-[#3a3a3a] my-1 mx-2" />
                    }
                    const isChecked =
                      (item.action === 'toggleToolbar'    && showToolbar) ||
                      (item.action === 'toggleLayers'     && showLayersPanel)
                    return (
                      <button
                        key={item.label}
                        type="button"
                        role="menuitem"
                        disabled={item.disabled}
                        onClick={() => item.action && handleAction(item.action)}
                        className={`w-full text-left flex items-center gap-2 px-3 py-1.25 transition-colors ${
                          item.disabled
                            ? 'text-gray-600 cursor-default text-[11px]'
                            : 'text-gray-200 hover:bg-[#1473e6] hover:text-white cursor-pointer text-[11px]'
                        }`}
                      >
                        <span className="w-3 shrink-0 text-[10px] text-blue-400">
                          {isChecked ? '✓' : ''}
                        </span>
                        {item.label}
                        {item.action === 'downloadCV' && (
                          <span className="ml-auto text-[9px] text-gray-500">PDF</span>
                        )}
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Window controls */}
        <div className="ml-auto flex items-center gap-4 text-gray-500">
          <Minus size={13} className="hover:text-white transition-colors cursor-pointer" />
          <Square size={11} className="hover:text-white transition-colors cursor-pointer" />
          <X size={14} className="hover:text-red-400 transition-colors cursor-pointer" />
        </div>
      </header>

      {/* ── Mobile Top App Bar ──────────────────────────────── */}
      <header className="md:hidden fixed top-0 inset-x-0 h-10 bg-[#2b2b2b] border-b border-[#1a1a1a] flex items-center justify-between px-4 z-50 text-xs">
        <PsIcon size={22} />
        <span className="text-gray-400 text-[11px] tracking-wider">Laman_Portfolio.psd</span>
        <div className="flex items-center gap-3">
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white text-[10px] tracking-widest uppercase transition-colors"
          >
            CV
          </a>
          <Settings2 size={15} className="text-gray-400" />
        </div>
      </header>

      {/* ── Desktop Left Toolbar (hideable via Window menu) ── */}
      {showToolbar && (
        <aside className="hidden md:flex fixed left-0 top-8 bottom-0 w-14 bg-[#2b2b2b] border-r border-[#1a1a1a] flex-col items-center py-4 gap-2 z-50">
          {TOOLS.map(t => {
            const Icon = t.icon
            const on = activeTool === t.id
            return (
              <button
                key={t.id}
                type="button"
                title={`${t.label} (${t.id})`}
                onClick={() => selectTool(t.id, t.target)}
                className={`relative w-9 h-9 grid place-items-center rounded-sm transition-colors ${
                  on ? 'bg-[#3a3a3a] text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#333]'
                }`}
              >
                <Icon size={18} />
                <span className="absolute bottom-0.5 right-1 text-[8px] text-gray-500">{t.id}</span>
              </button>
            )
          })}
        </aside>
      )}

      {/* ── Desktop Right Layers Panel (hideable via Window menu) ── */}
      {showLayersPanel && (
        <aside className="hidden md:flex fixed right-0 top-8 bottom-0 w-64 bg-[#2b2b2b] border-l border-[#1a1a1a] flex-col z-50 text-xs text-gray-300">
          <div className="h-9 border-b border-[#1a1a1a] flex items-center px-3 gap-4 shrink-0">
            <span className="text-white border-b-2 border-blue-500 pb-1.5 -mb-px">Layers</span>
            <span className="text-gray-500 hover:text-gray-300 cursor-pointer">Channels</span>
            <span className="text-gray-500 hover:text-gray-300 cursor-pointer">Paths</span>
          </div>
          <div className="px-3 py-2 border-b border-[#1a1a1a] text-[11px] text-gray-500 flex items-center gap-2 shrink-0">
            <LayersIcon size={12} /> Normal · 100%
          </div>
          <div className="flex-1 overflow-y-auto">
            {LAYERS.map(l => (
              <div
                key={l.key}
                className="flex items-center gap-2.5 px-3 py-2.5 border-b border-[#252525] hover:bg-[#343434] transition-colors"
              >
                <button
                  type="button"
                  aria-label={`Toggle ${l.label}`}
                  onClick={() => toggle(l.key)}
                  className="shrink-0 text-gray-400 hover:text-white transition-colors"
                >
                  {visible[l.key]
                    ? <Eye size={15} />
                    : <EyeOff size={15} className="text-gray-600" />}
                </button>
                <span className="shrink-0">
                  {l.type === 'Group'
                    ? <Folder size={14} className="text-blue-400/80" />
                    : <FileText size={13} className="text-amber-400/80" />}
                </span>
                <span className={`text-[11px] leading-tight truncate ${visible[l.key] ? 'text-gray-200' : 'text-gray-600'}`}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-8 border-t border-[#1a1a1a] shrink-0" />
        </aside>
      )}

      {/* ── Mobile Bottom Toolbar Dock ──────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-12 bg-[#2b2b2b] border-t border-[#1a1a1a] flex items-center justify-around z-50">
        {TOOLS.map(t => {
          const Icon = t.icon
          const on = activeTool === t.id
          return (
            <button
              key={t.id}
              type="button"
              title={t.label}
              onClick={() => selectTool(t.id, t.target)}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-colors ${
                on ? 'text-blue-400' : 'text-gray-500 active:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="text-[8px] tracking-widest">{t.id}</span>
            </button>
          )
        })}
      </nav>

      {/* ── Canvas + Artboard ─────────────────────────────────
          Left/right padding collapses when panels are toggled off via Window menu.
          Mobile: pt-10 pb-12 clears fixed top/bottom bars.
          Desktop: pt-8 + dynamic pl/pr tracks open panels.              */}
      <div
        className={`pt-10 pb-12 md:pt-8 md:pb-0 min-h-screen transition-all duration-300 ease-in-out ${
          showToolbar     ? 'md:pl-14' : 'md:pl-0'
        } ${
          showLayersPanel ? 'md:pr-64' : 'md:pr-0'
        }`}
      >
        <div className="px-3 py-3 md:p-6">

          {/* White artboard.
              md:overflow-hidden clips hero bleed + preserves rounded corners on desktop.
              No overflow-hidden on mobile so position:sticky (card deck) works.      */}
          <div className="bg-white rounded-sm shadow-md md:shadow-2xl md:overflow-hidden md:max-w-5xl md:mx-auto">

            {/* PSD document title bar */}
            <div className="h-6 md:h-7 flex items-center justify-center bg-[#ebebeb] border-b border-[#d4d4d4] font-sans md:sticky md:top-8 md:z-30">
              <span className="md:hidden text-[10px] text-gray-500">Laman_Portfolio.psd</span>
              <span className="hidden md:inline text-[11px] text-gray-600">
                Laman_Hajili_Portfolio_2026.psd @ 100% (RGB/8)
              </span>
            </div>

            <div id="hero" className={hide('hero')}>
              <Hero />
            </div>

            <div className={hide('portfolio')}>
              <Works works={works} />
              <Marquee />
            </div>

            <div className={hide('about')}>
              <About />
              <Skills />
              <Process />
            </div>

            <div className={hide('contact')}>
              <Contact />
            </div>

            <footer className="border-t border-border px-6 md:px-10 py-6 flex items-center justify-between text-dim text-[10px] tracking-[0.2em] uppercase font-sans">
              <span>Laman Hajili © {new Date().getFullYear()}</span>
              <span className="hidden md:inline">Designed in "Photoshop"</span>
              <span className="md:hidden">© Crafted by HJ</span>
            </footer>
          </div>

        </div>
      </div>
    </div>
  )
}
