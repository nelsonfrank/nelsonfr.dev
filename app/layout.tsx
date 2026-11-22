import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Newsreader } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-display",
  display: "swap",
})

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
})

const appUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL.startsWith("http")
    ? process.env.NEXT_PUBLIC_APP_URL
    : `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : "https://nelsonfrank.dev"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  title: {
    default: "Nelson Frank · Full-stack software engineer",
    template: "%s · Nelson Frank",
  },
  description:
    "Full-stack software engineer in Dar es Salaam building reliable backend systems, web platforms, and mobile apps in TypeScript, Go, Java, and Next.js.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nelsonfrank.dev",
    siteName: "Nelson Frank",
    title: "Nelson Frank · Full-stack software engineer",
    description:
      "Full-stack software engineer in Dar es Salaam building reliable backend systems, web platforms, and mobile apps in TypeScript, Go, Java, and Next.js.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nelson Frank · Full-stack software engineer",
    description:
      "Full-stack software engineer in Dar es Salaam building reliable backend systems, web platforms, and mobile apps in TypeScript, Go, Java, and Next.js.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${newsreader.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
