import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPost, getAllPosts } from "@/lib/posts"
import { projects } from "@/lib/projects"
import { markdownToHtml, extractHeadings } from "@/lib/markdown"
import { Header } from "@/components/header"
import { NewsletterPanel } from "@/components/newsletter-panel"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { MermaidHydrator } from "@/components/mermaid-article"
import { ArticleMediaLightbox } from "@/components/media-lightbox"
import {
  ReadingProgressBar,
  PostToc,
  ShareButtons,
  ThemeVideoHydrator,
} from "@/components/post-islands"

function renderHighlightedTitle(title: string, highlightPhrase?: string) {
  if (!highlightPhrase) {
    const words = title.split(" ")
    if (words.length <= 2) {
      return <span className="hl-word">{title}</span>
    }
    const lastTwo = words.slice(-2).join(" ")
    const prefix = words.slice(0, -2).join(" ")
    return (
      <>
        {prefix} <span className="hl-word">{lastTwo}</span>
      </>
    )
  }

  const idx = title.toLowerCase().indexOf(highlightPhrase.toLowerCase())
  if (idx === -1) {
    return <span className="hl-word">{title}</span>
  }

  const before = title.slice(0, idx)
  const match = title.slice(idx, idx + highlightPhrase.length)
  const after = title.slice(idx + highlightPhrase.length)

  return (
    <>
      {before}
      <span className="hl-word">{match}</span>
      {after}
    </>
  )
}

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
  const hasMermaid = htmlContent.includes('class="mermaid-block"')
  const hasThemeVideos = htmlContent.includes("data-theme-video")
  const hasZoomableMedia =
    Boolean(post.image) || htmlContent.includes("<img") || hasThemeVideos

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

      <ReadingProgressBar targetId="art" />

      <Header />

      <main id="main-content">
        <div className="wrap">
          <header className="post-head">
            <Link className="back-link" href="/writing">
              ← Back to all posts
            </Link>

            <h1>{renderHighlightedTitle(post.title, post.highlightPhrase)}</h1>

            <p className="post-dek">{post.excerpt}</p>

            <div className="byline">
              <div className="avatar-circle" aria-hidden="true">
                NF
              </div>
              <div>
                <b>Nelson Frank</b>
                {post.date} · {post.readTime}
              </div>
            </div>

            {post.tags.length > 0 && (
              <div style={{ marginTop: "1.2rem" }}>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    className="tag"
                    href={`/writing?topic=${encodeURIComponent(tag.toLowerCase())}`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          {post.image ? (
            <figure className="post-cover has-img">
              {post.image.startsWith("/") ? (
                <Image
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1120px) 100vw, 1080px"
                  className="post-cover-img"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  className="post-cover-img"
                />
              )}
            </figure>
          ) : (
            <div
              className="post-cover"
              role="img"
              aria-label={`Visual overview for ${post.title}`}
            >
              <div className="post-cover-inner" aria-hidden="true">
                <div>
                  <span className="mock-bar hl" />
                  <span className="mock-bar" />
                  <span className="mock-bar" style={{ width: "68%" }} />
                </div>
                <div className="mock-nodes">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={tag}
                      className={`mock-node${idx === 1 ? " mid" : ""}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="post-layout">
            <PostToc headings={headings} />

            <div>
              <article
                id="art"
                className="prose"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
              {hasMermaid && <MermaidHydrator targetId="art" enableModal />}
              {hasThemeVideos && <ThemeVideoHydrator targetId="art" />}
              {hasZoomableMedia && (
                <ArticleMediaLightbox
                  targetId="art"
                  includeCover={Boolean(post.image)}
                />
              )}

              <ShareButtons title={post.title} slug={post.slug} />

              <div className="author-box">
                <div className="avatar-circle" aria-hidden="true">
                  NF
                </div>
                <div>
                  <b>Nelson Frank</b>
                  Full-stack software engineer in Dar es Salaam. I write about
                  authentication, distributed backend services, and TypeScript.{" "}
                  <Link href="/experience">More about me</Link>
                </div>
              </div>

              {relatedProject && (
                <div style={{ margin: "2rem 0" }}>
                  <article className="next-card">
                    <div>
                      <small>Related case study</small>
                      <h3>
                        <Link href={`/projects/${relatedProject.slug}`}>
                          {relatedProject.title}
                        </Link>
                      </h3>
                      <p>{relatedProject.description}</p>
                    </div>
                    <span className="tag">Case study</span>
                  </article>
                </div>
              )}

              <NewsletterPanel compact />
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <section className="related-sec">
              <h2>Keep reading</h2>
              <div className="related-grid">
                {relatedPosts.map((rel) => (
                  <article key={rel.slug} className="related-card">
                    <small>
                      {rel.date} · {rel.readTime}
                    </small>
                    <h3>
                      <Link href={`/writing/${rel.slug}`}>{rel.title}</Link>
                    </h3>
                    <p>{rel.excerpt}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  )
}
