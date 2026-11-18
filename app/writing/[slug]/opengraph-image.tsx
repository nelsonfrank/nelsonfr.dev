import { ImageResponse } from 'next/og'
import { getPost } from "@/lib/posts"

export const alt = 'Nelson Frank · Writing'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)

  const title = post?.title || 'Notes from real projects'
  const excerpt = post?.excerpt || 'Read the full article on Nelson Frank’s engineering blog.'
  const date = post?.date || ''
  const readTime = post?.readTime || ''

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
            <span tw="text-xl font-bold tracking-tight" style={{ color: '#EDF0F7' }}>
              Nelson Frank · Writing
            </span>
            <span tw="text-lg font-bold" style={{ color: '#6CC4CC' }}>
              nelsonfrank.dev
            </span>
          </div>

          {/* Middle Content */}
          <div tw="flex flex-col justify-center items-start">
            <h1
              tw="text-5xl font-bold tracking-tight leading-snug mb-4"
              style={{
                color: '#EDF0F7',
              }}
            >
              {title}
            </h1>
            <p
              tw="text-2xl leading-relaxed max-w-[950px]"
              style={{
                color: '#9AA3BA',
              }}
            >
              {excerpt}
            </p>
          </div>

          {/* Bottom Row */}
          <div
            tw="flex flex-row items-center justify-between w-full pt-6"
            style={{ borderTop: '1px solid #2A3354' }}
          >
            <div tw="flex flex-row items-center text-base" style={{ color: '#9AA3BA' }}>
              {date && <span>{date}</span>}
              {date && readTime && <span tw="mx-2.5">·</span>}
              {readTime && <span>{readTime}</span>}
            </div>

            <div tw="flex flex-row items-center">
              <div
                tw="px-4 py-1.5 rounded-full text-sm font-bold"
                style={{ backgroundColor: '#F2B632', color: '#18203A' }}
              >
                Read article
              </div>
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
