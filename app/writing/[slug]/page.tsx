import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPost, getAllPosts } from "@/lib/posts"
import { markdownToHtml } from "@/lib/markdown"
import PostClient from "./PostClient"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} — Nelson Frank`,
    description: post.excerpt || `Read ${post.title} by Nelson Frank`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: ["Nelson Frank"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const htmlContent = await markdownToHtml(post.content)

  const allPosts = getAllPosts()
  const idx = allPosts.findIndex((p) => p.slug === slug)
  const prevPost = allPosts[idx - 1] ?? null
  const nextPost = allPosts[idx + 1] ?? null

  return (
    <PostClient
      post={post}
      htmlContent={htmlContent}
      prevPost={prevPost}
      nextPost={nextPost}
    />
  )
}
