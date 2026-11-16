import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Nelson Frank — Fullstack Software Developer'
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

export default async function Image() {
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
    console.error('Failed to load dynamic fonts for OG image:', error)
  }

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
              FULLSTACK ENGINEER
            </span>
            <h1
              tw="text-5xl font-bold tracking-tight leading-tight mb-4 max-w-[920px]"
              style={{ color: '#e6edf3' }}
            >
              Building secure auth, transit backends and cloud infrastructure.
            </h1>
            <p tw="text-2xl leading-relaxed max-w-[820px]" style={{ color: '#9aa7b4' }}>
              TypeScript, Go and Python on Kubernetes. Based in Dar es Salaam, working with teams worldwide.
            </p>
          </div>

          {/* Bottom Row */}
          <div
            tw="flex flex-row items-center justify-between w-full pt-6"
            style={{ borderTop: '1px solid #1f2933' }}
          >
            <div tw="flex flex-row items-center">
              {['TypeScript', 'Go', 'Python', 'PostgreSQL', 'Kubernetes'].map((tech) => (
                <div
                  key={tech}
                  tw="px-3.5 py-1.5 rounded text-sm mr-3"
                  style={{
                    backgroundColor: '#0b0f14',
                    border: '1px solid #1f2933',
                    color: '#9aa7b4',
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
            <div tw="flex flex-row items-center">
              <div
                tw="w-2.5 h-2.5 rounded-full mr-2.5"
                style={{ backgroundColor: '#3ddbc8' }}
              />
              <span tw="text-sm" style={{ color: '#9aa7b4' }}>
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
