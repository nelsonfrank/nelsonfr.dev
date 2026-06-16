import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import './globals.css'
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

const appUrl = process.env.NEXT_PUBLIC_APP_URL
  ? (process.env.NEXT_PUBLIC_APP_URL.startsWith('http') ? process.env.NEXT_PUBLIC_APP_URL : `https://${process.env.NEXT_PUBLIC_APP_URL}`)
  : 'https://nelsonfrank.dev'

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Nelson Frank - Fullstack Software Developer',
    template: '%s | Nelson Frank',
  },
  description: 'Fullstack software developer interested in tech and building robust software using latest technology.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nelsonfrank.dev',
    siteName: 'Nelson Frank',
    title: 'Nelson Frank - Fullstack Software Developer',
    description: 'Fullstack software developer interested in tech and building robust software using latest technology.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nelson Frank - Fullstack Software Developer',
    description: 'Fullstack software developer interested in tech and building robust software using latest technology.',
  },
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
    <html lang="en" className={cn("bg-background", GeistSans.variable, GeistMono.variable, GeistPixelSquare.variable)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (typeof window !== 'undefined' && window.sessionStorage.getItem('preloader-shown') === 'true') {
                  document.write('<style>.preloader { display: none !important; }</style>');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={cn("antialiased relative")} >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Google Analytics Script */}
          {process.env.NODE_ENV === 'production' && (
            <>
              <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-1EKCMNQFJR"
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-1EKCMNQFJR');
                `}
              </Script>
            </>
          )}
          {children}
          <ThemeToggle />
          <Toaster />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}

