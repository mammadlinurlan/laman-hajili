import { getAllWorks } from '@/lib/works'
import { SmoothScroll } from './components/smooth-scroll'
import { CursorGlow } from './components/cursor-glow'
import { ScrollFX } from './components/scroll-fx'
import { Nav } from './components/nav'
import { Hero } from './components/hero'
import { Works } from './components/works'
import { Marquee } from './components/marquee'
import { About } from './components/about'
import { Skills } from './components/skills'
import { Process } from './components/process'
import { Contact } from './components/contact'

export default function Home() {
  const works = getAllWorks()

  return (
    <main className="min-h-screen bg-bg text-text">
      <SmoothScroll />
      <ScrollFX />
      <CursorGlow />
      <Nav />
      <Hero />
      <Works works={works} />
      <Marquee />
      <About />
      <Skills />
      <Process />
      <Contact />
    </main>
  )
}
