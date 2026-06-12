import fs from 'fs'
import path from 'path'

export type WorkImage = {
  src: string
  alt: string
}

export type Work = {
  slug: string
  title: string
  category: string
  cover: string
  images: WorkImage[]
  index: number
}

const WORKS_DIR = path.join(process.cwd(), 'public', 'works')
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'])
const COVER_NAMES = ['cover.jpg', 'cover.png', 'cover.webp', 'first.jpg', 'first.png']

// Optional category override — new slugs default to "Design"
const CATEGORIES: Record<string, string> = {
  'avengers': 'Print Design',
  'boreal-gin': 'Brand Identity',
  'cleaver-butcher': 'Brand Identity',
  'dripwall': 'Visual Identity',
  'in-n-out-burger': 'Advertising',
  'jardin-secret': 'Packaging Design',
  'jysk': 'Print Design',
  'mcdonalds': 'Advertising',
  'spotify-cover': 'Social Media Design',
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function getAllWorks(): Work[] {
  if (!fs.existsSync(WORKS_DIR)) return []

  const slugs = fs
    .readdirSync(WORKS_DIR)
    .filter(name => fs.statSync(path.join(WORKS_DIR, name)).isDirectory())
    .sort()

  return slugs.map((slug, index) => {
    const dir = path.join(WORKS_DIR, slug)
    const files = fs
      .readdirSync(dir)
      .filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()))

    // cover: prefer cover.jpg/first.jpg, otherwise first alphabetically
    const coverFile =
      COVER_NAMES.find(n => files.includes(n)) ??
      [...files].sort()[0] ??
      ''

    const cover = coverFile ? `/works/${slug}/${coverFile}` : ''

    // gallery: cover first, then remaining sorted
    const rest = [...files]
      .filter(f => f !== coverFile)
      .sort()
      .map(f => ({ src: `/works/${slug}/${f}`, alt: `${slugToTitle(slug)}` }))

    const images: WorkImage[] = [
      ...(cover ? [{ src: cover, alt: slugToTitle(slug) }] : []),
      ...rest,
    ]

    return {
      slug,
      title: slugToTitle(slug),
      category: CATEGORIES[slug] ?? 'Design',
      cover,
      images,
      index,
    }
  })
}

export function getWorkBySlug(slug: string): Work | undefined {
  return getAllWorks().find(w => w.slug === slug)
}

export function getAdjacentWorks(slug: string): { prev: Work | null; next: Work | null } {
  const all = getAllWorks()
  const idx = all.findIndex(w => w.slug === slug)
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  }
}
