import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import './globals.css'
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Nelson Frank - Fullstack Software Developer',
  description: 'Fullstack software developer interested in tech and building robust software using latest technology.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("bg-background", GeistSans.variable, GeistMono.variable, GeistPixelSquare.variable)}>
      <body className={cn("antialiased")} >
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
