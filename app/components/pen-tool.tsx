'use client'

import { useEffect, useRef } from 'react'

const ACCENT = '79, 70, 229' // indigo, matches --color-accent
const GRID = 92 // anchor point spacing (px)
const RADIUS = 190 // cursor → anchor connection radius (px)
const TRAIL_MS = 520 // pen-path lifetime before it fades out

type Pt = { x: number; y: number }
type TrailPt = { x: number; y: number; t: number }

/**
 * Figma/Illustrator "Pen Tool" background. A transparent canvas overlay that
 * draws glowing vector paths from the cursor to nearby invisible grid anchors,
 * plus a short fading trail of the cursor path — a live vector-drawing feel.
 */
export function PenTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let anchors: Pt[] = []
    let trail: TrailPt[] = []
    const mouse = { x: -9999, y: -9999, active: false }
    let raf = 0

    const buildAnchors = () => {
      anchors = []
      for (let x = GRID / 2; x < width; x += GRID) {
        for (let y = GRID / 2; y < height; y += GRID) {
          anchors.push({ x, y })
        }
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildAnchors()
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      mouse.x = x
      mouse.y = y
      mouse.active = x >= 0 && y >= 0 && x <= width && y <= height
      if (mouse.active) trail.push({ x, y, t: performance.now() })
    }
    const onLeave = () => {
      mouse.active = false
    }

    const draw = () => {
      raf = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, width, height)
      const now = performance.now()

      // Fading pen path
      trail = trail.filter(p => now - p.t < TRAIL_MS)
      if (trail.length > 1) {
        ctx.lineCap = 'round'
        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1]
          const p1 = trail[i]
          const a = (1 - (now - p1.t) / TRAIL_MS) * 0.85
          ctx.strokeStyle = `rgba(${ACCENT}, ${a})`
          ctx.lineWidth = 1.4
          ctx.shadowBlur = 10
          ctx.shadowColor = `rgba(${ACCENT}, ${a})`
          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(p1.x, p1.y)
          ctx.stroke()
        }
      }

      if (mouse.active) {
        // Vector connections to nearby anchors
        for (const anchor of anchors) {
          const dx = anchor.x - mouse.x
          const dy = anchor.y - mouse.y
          const d = Math.hypot(dx, dy)
          if (d >= RADIUS) continue
          const o = 1 - d / RADIUS
          // path segment
          ctx.strokeStyle = `rgba(${ACCENT}, ${o * 0.5})`
          ctx.lineWidth = 1
          ctx.shadowBlur = 8
          ctx.shadowColor = `rgba(${ACCENT}, ${o * 0.6})`
          ctx.beginPath()
          ctx.moveTo(mouse.x, mouse.y)
          ctx.lineTo(anchor.x, anchor.y)
          ctx.stroke()
          // anchor handle (small square, like a vector node)
          const s = 2.4
          ctx.shadowBlur = 0
          ctx.fillStyle = `rgba(${ACCENT}, ${o * 0.9})`
          ctx.fillRect(anchor.x - s, anchor.y - s, s * 2, s * 2)
        }

        // Pen tip node + selection ring
        ctx.shadowBlur = 14
        ctx.shadowColor = `rgba(${ACCENT}, 0.9)`
        ctx.fillStyle = `rgba(${ACCENT}, 0.95)`
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.strokeStyle = `rgba(${ACCENT}, 0.5)`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 9, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    resize()
    draw()
    globalThis.addEventListener('resize', resize)
    globalThis.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      globalThis.removeEventListener('resize', resize)
      globalThis.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}
