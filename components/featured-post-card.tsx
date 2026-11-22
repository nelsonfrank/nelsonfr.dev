import Image from "next/image"
import Link from "next/link"
import type { PostMeta } from "@/lib/posts"

export function FeaturedPostCard({ post }: { post: PostMeta }) {
  return (
    <article className="feat-post">
      <div
        className={`feat-cover${post.image ? " has-img" : ""}`}
        aria-hidden={post.image ? undefined : true}
      >
        <span className="status-badge">Latest</span>
        {post.image ? (
          post.image.startsWith("/") ? (
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 820px) 100vw, 580px"
              className="feat-cover-img"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.image}
              alt={post.imageAlt || post.title}
              className="feat-cover-img"
            />
          )
        ) : (
          <div className="feat-cover-frame">
            <span className="mock-bar hl" />
            <span className="mock-bar" />
            <span className="mock-bar" style={{ width: "80%" }} />
            <span className="mock-bar lg" style={{ marginTop: "auto" }} />
          </div>
        )}
      </div>
      <div className="feat-body">
        <small>
          {post.date} · {post.readTime}
        </small>
        <h2>
          <Link href={`/writing/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.excerpt}</p>
        <div>
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

