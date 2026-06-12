import type { Metadata } from 'next'
import { Fraunces, DM_Sans } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Laman Hajili — Graphic Designer & Visual Storyteller',
  description:
    'Portfolio of Laman Hajili — Graphic Designer specializing in brand identity, packaging design, and visual storytelling.',
  keywords: ['Laman Hajili', 'graphic designer', 'brand identity', 'packaging design', 'visual storytelling', 'Azerbaijan'],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Pliant&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
