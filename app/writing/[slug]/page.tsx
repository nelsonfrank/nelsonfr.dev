import { notFound } from "next/navigation"
import { getPost, getAllPosts } from "@/lib/posts"
import { markdownToHtml } from "@/lib/markdown"
import PostClient from "./PostClient"

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
