import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Nelson Frank — Fullstack Software Developer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Module-level caching for loaded font arrays
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
  let fonts: any[] = []
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
        tw="flex flex-col w-full h-full p-10 text-white items-stretch justify-between relative"
        style={{
          fontFamily: 'Geist, sans-serif',
          backgroundImage: 'radial-gradient(circle at 95% 5%, rgba(115, 115, 115, 0.15) 0%, rgba(3, 3, 3, 0) 50%), radial-gradient(circle at 5% 95%, rgba(20, 184, 166, 0.15) 0%, rgba(3, 3, 3, 0) 50%), linear-gradient(135deg, #030303 0%, #0a0d14 100%)',
        }}
      >
        {/* Soft glowing ambient circle top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            backgroundImage: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0) 70%)',
          }}
        />

        {/* Dynamic Card Container with border glow */}
        <div
          tw="flex flex-col w-full h-full rounded-[24px] p-12 justify-between relative"
          style={{
            backgroundColor: 'rgba(10, 13, 20, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Top Row / Branding */}
          <div tw="flex flex-row justify-between items-center w-full">
            <div tw="flex flex-row items-center">
              <div
                tw="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3"
                style={{
                  backgroundColor: 'rgba(20, 184, 166, 0.12)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  color: '#2dd4bf',
                  fontSize: '16px',
                }}
              >
                NF
              </div>
              <span tw="text-xl font-bold tracking-tight text-white">Nelson Frank</span>
            </div>
            <span
              tw="text-lg font-semibold"
              style={{ color: '#2dd4bf' }}
            >
              nelsonfrank.dev
            </span>
          </div>

          {/* Middle Content */}
          <div tw="flex flex-col justify-center items-start flex-grow mt-6">
            <span
              tw="text-xs font-bold uppercase mb-4"
              style={{ color: 'rgba(45, 212, 191, 0.8)', letterSpacing: '0.2em' }}
            >
              Portfolio & Engineering
            </span>
            <h1 tw="text-6xl font-bold text-white tracking-tight leading-none mb-5">
              Nelson Frank
            </h1>
            <p tw="text-2xl font-light text-slate-300 leading-relaxed max-w-[800px]">
              Fullstack software developer interested in tech and building robust software using latest technology.
            </p>
          </div>

          {/* Bottom Row / Stack & Availability */}
          <div
            tw="flex flex-row items-center justify-between w-full pt-8"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            <div tw="flex flex-row items-center">
              {['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'].map((tech) => (
                <div
                  key={tech}
                  tw="px-4 py-2 rounded-lg text-sm font-medium mr-3"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#e2e8f0',
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>

            <div tw="flex flex-row items-center">
              <span tw="text-sm font-medium text-slate-400 mr-2.5">Available for new opportunities</span>
              <div
                tw="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: '#2dd4bf',
                  boxShadow: '0 0 10px #2dd4bf',
                }}
              />
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
