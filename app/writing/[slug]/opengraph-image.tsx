import { ImageResponse } from 'next/og'
import { getPost } from "@/lib/posts"

export const alt = 'Nelson Frank — Blog Post'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

let fontRegularPromise: Promise<ArrayBuffer> | null = null
let fontBoldPromise: Promise<ArrayBuffer> | null = null

function getFontRegular() {
  if (!fontRegularPromise) {
    fontRegularPromise = fetch(
      new URL('https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-400-normal.ttf')
    ).then((res) => {
      if (!res.ok) throw new Error('Failed to fetch regular font')
      return res.arrayBuffer()
    })
  }
  return fontRegularPromise
}

function getFontBold() {
  if (!fontBoldPromise) {
    fontBoldPromise = fetch(
      new URL('https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-700-normal.ttf')
    ).then((res) => {
      if (!res.ok) throw new Error('Failed to fetch bold font')
      return res.arrayBuffer()
    })
  }
  return fontBoldPromise
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)

  let fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }[] = []
  try {
    const [regularData, boldData] = await Promise.all([
      getFontRegular(),
      getFontBold(),
    ])
    fonts = [
      {
        name: 'Geist',
        data: regularData,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Geist',
        data: boldData,
        weight: 700,
        style: 'normal',
      },
    ]
  } catch (error) {
    console.error('Failed to load dynamic fonts for writing OG image:', error)
  }

  const title = post?.title || 'Blog Post'
  const excerpt = post?.excerpt || 'Read the full article on Nelson Frank\'s engineering blog.'
  const date = post?.date || ''
  const readTime = post?.readTime || ''

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full p-12 justify-between"
        style={{
          fontFamily: 'Geist, sans-serif',
          backgroundColor: '#0b0f14',
          color: '#e6edf3',
        }}
      >
        <div
          tw="flex flex-col w-full h-full rounded-[12px] p-12 justify-between"
          style={{
            backgroundColor: '#0f151c',
            border: '1px solid #1f2933',
          }}
        >
          {/* Top Row */}
          <div tw="flex flex-row justify-between items-center w-full">
            <span tw="text-xl font-bold tracking-tight" style={{ color: '#e6edf3' }}>
              Nelson Frank
            </span>
            <span tw="text-lg font-bold" style={{ color: '#3ddbc8' }}>
              nelsonfrank.dev
            </span>
          </div>

          {/* Middle Content */}
          <div tw="flex flex-col justify-center items-start">
            <span
              tw="text-xs font-bold uppercase mb-4"
              style={{ color: '#3ddbc8', letterSpacing: '0.08em' }}
            >
              WRITING
            </span>
            <h1
              tw="text-5xl font-bold tracking-tight leading-snug mb-4"
              style={{
                color: '#e6edf3',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </h1>
            <p
              tw="text-xl leading-relaxed max-w-[950px]"
              style={{
                color: '#9aa7b4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {excerpt}
            </p>
          </div>

          {/* Bottom Row */}
          <div
            tw="flex flex-row items-center justify-between w-full pt-6"
            style={{ borderTop: '1px solid #1f2933' }}
          >
            <div tw="flex flex-row items-center text-sm" style={{ color: '#9aa7b4' }}>
              {date && <span>{date}</span>}
              {date && readTime && <span tw="mx-2.5">·</span>}
              {readTime && <span>{readTime}</span>}
            </div>

            <div tw="flex flex-row items-center">
              <span tw="text-sm mr-2" style={{ color: '#9aa7b4' }}>
                Read article at
              </span>
              <span tw="text-sm font-bold" style={{ color: '#3ddbc8' }}>
                nelsonfrank.dev
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  )
}
