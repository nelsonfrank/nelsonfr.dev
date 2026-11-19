import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPost, getAllPosts } from "@/lib/posts"
import { projects } from "@/lib/projects"
import { markdownToHtml, extractHeadings } from "@/lib/markdown"
import PostClient from "./PostClient"

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) {
    return {
      title: "Post not found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} by Nelson Frank`,
    alternates: {
      canonical: `/writing/${slug}`,
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
    openGraph: {
      title: `${post.title} · Nelson Frank`,
      description: post.excerpt,
      type: "article",
      url: `https://nelsonfrank.dev/writing/${slug}`,
      publishedTime: post.date,
      authors: ["Nelson Frank"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} · Nelson Frank`,
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
  const headings = await extractHeadings(post.content)

  const allPosts = getAllPosts()
  const relatedProject = post.project
    ? projects.find((p) => p.slug === post.project) ?? null
    : null

  const postTagSet = new Set(post.tags.map((t) => t.toLowerCase()))
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .map((candidate) => {
      const sharedCount = candidate.tags.filter((t) =>
        postTagSet.has(t.toLowerCase())
      ).length
      return { candidate, sharedCount }
    })
    .sort((a, b) => {
      if (b.sharedCount !== a.sharedCount) return b.sharedCount - a.sharedCount
      return (
        new Date(b.candidate.date).getTime() -
        new Date(a.candidate.date).getTime()
      )
    })
    .slice(0, 2)
    .map((entry) => entry.candidate)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Nelson Frank",
      url: "https://nelsonfrank.dev",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://nelsonfrank.dev/writing/${slug}`,
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://nelsonfrank.dev",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Writing",
        item: "https://nelsonfrank.dev/writing",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://nelsonfrank.dev/writing/${slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PostClient
        post={post}
        htmlContent={htmlContent}
        headings={headings}
        relatedProject={relatedProject}
        relatedPosts={relatedPosts}
      />
    </>
  )
}
