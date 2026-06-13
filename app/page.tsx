import { getAllWorks } from '@/lib/works'
import { SmoothScroll } from './components/smooth-scroll'
import { CursorGlow } from './components/cursor-glow'
import { ScrollFX } from './components/scroll-fx'
import { Workspace } from './components/workspace'

export default function Home() {
  const works = getAllWorks()

  return (
    <main className="min-h-screen bg-[#1e1e1e]">
      <SmoothScroll />
      <ScrollFX />
      <CursorGlow />
      <Workspace works={works} />
    </main>
  )
}
