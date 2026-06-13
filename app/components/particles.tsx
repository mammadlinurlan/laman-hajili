'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Fewer particles on phones to keep it smooth.
const COUNT =
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
    ? 700
    : 1600

// Indigo palette — matches the site's design tokens
const PALETTE = [
  new THREE.Color('#4F46E5'), // accent
  new THREE.Color('#818CF8'), // accent-soft
  new THREE.Color('#C7D2FE'), // pale indigo
  new THREE.Color('#E5E7EB'), // near-white
]

function Field() {
  const ref = useRef<THREE.Points>(null)
  const { size, viewport } = useThree()
  const mouse = useRef<[number, number]>([9999, 9999])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / size.width) * 2 - 1,
        -(e.clientY / size.height) * 2 + 1,
      ]
    }
    globalThis.addEventListener('mousemove', onMove)
    return () => globalThis.removeEventListener('mousemove', onMove)
  }, [size])

  const { positions, origins, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const origins = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      // Spread wider than viewport so edges don't look empty
      const x = (Math.random() - 0.5) * 16
      const y = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 2

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      origins[i * 3] = x
      origins[i * 3 + 1] = y
      origins[i * 3 + 2] = z

      // Weighted toward indigo colors
      const weights = [0.35, 0.30, 0.20, 0.15]
      let r = Math.random()
      let pick = 0
      for (let w = 0; w < weights.length; w++) {
        r -= weights[w]
        if (r <= 0) { pick = w; break }
      }
      const c = PALETTE[pick]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    return { positions, origins, colors }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    const t = clock.elapsedTime

    // Convert mouse NDC → world coords
    const mx = mouse.current[0] * (viewport.width / 2)
    const my = mouse.current[1] * (viewport.height / 2)
    const REPEL_R = 1.8

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3

      // Gentle organic drift (each particle has unique phase)
      const wave =
        Math.sin(t * 0.38 + origins[i3] * 0.42 + i * 0.003) * 0.10 +
        Math.cos(t * 0.22 + origins[i3 + 1] * 0.38) * 0.05

      // Default target: resting origin + wave
      let tx = origins[i3]
      let ty = origins[i3 + 1] + wave

      // Mouse repulsion
      const dx = pos[i3] - mx
      const dy = pos[i3 + 1] - my
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < REPEL_R && dist > 0.001) {
        const t2 = (REPEL_R - dist) / REPEL_R
        const force = t2 * t2 * 0.9          // quadratic falloff
        tx += (dx / dist) * force * REPEL_R
        ty += (dy / dist) * force * REPEL_R
      }

      // Smooth lerp toward target (spring-like)
      pos[i3] += (tx - pos[i3]) * 0.048
      pos[i3 + 1] += (ty - pos[i3 + 1]) * 0.048
    }

    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.024}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export function ParticlesCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      frameloop="always"
    >
      <Field />
    </Canvas>
  )
}
