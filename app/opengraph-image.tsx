import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Nelson Frank · Full-stack software engineer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full p-12 justify-between"
        style={{
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#0F1426',
          color: '#EDF0F7',
        }}
      >
        <div
          tw="flex flex-col w-full h-full rounded-[14px] p-12 justify-between"
          style={{
            backgroundColor: '#171E36',
            border: '1px solid #2A3354',
          }}
        >
          {/* Top Row */}
          <div tw="flex flex-row justify-between items-center w-full">
            <div tw="flex flex-row items-center">
              <div
                tw="flex items-center justify-center rounded-full px-4 py-2 mr-4 text-lg font-bold"
                style={{
                  backgroundColor: '#EDF0F7',
                  color: '#0F1426',
                }}
              >
                NF
              </div>
              <span tw="text-xl font-bold tracking-tight" style={{ color: '#EDF0F7' }}>
                Nelson Frank
              </span>
            </div>
            <span tw="text-lg font-bold" style={{ color: '#6CC4CC' }}>
              nelsonfrank.dev
            </span>
          </div>

          {/* Middle Content */}
          <div tw="flex flex-col justify-center items-start">
            <h1
              tw="text-6xl font-bold tracking-tight leading-tight mb-4 max-w-[960px]"
              style={{ color: '#EDF0F7' }}
            >
              I build fast, reliable software.
            </h1>
            <p tw="text-2xl leading-relaxed max-w-[860px]" style={{ color: '#9AA3BA' }}>
              Full-stack engineer in Dar es Salaam shipping backend services, web platforms, and mobile apps in TypeScript, Go, Java, and Next.js.
            </p>
          </div>

          {/* Bottom Row */}
          <div
            tw="flex flex-row items-center justify-between w-full pt-6"
            style={{ borderTop: '1px solid #2A3354' }}
          >
            <div tw="flex flex-row items-center">
              {['TypeScript', 'Go', 'Java', 'Spring Boot', 'Next.js', 'PostgreSQL'].map((tech) => (
                <div
                  key={tech}
                  tw="px-4 py-1.5 rounded-full text-sm font-bold mr-3"
                  style={{
                    backgroundColor: '#173A47',
                    color: '#6CC4CC',
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
            <div tw="flex flex-row items-center">
              <div
                tw="w-3 h-3 rounded-full mr-2.5"
                style={{ backgroundColor: '#F2B632' }}
              />
              <span tw="text-sm font-bold" style={{ color: '#EDF0F7' }}>
                Dar es Salaam, TZ
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
