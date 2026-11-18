import Link from "next/link"
import type { PostMeta } from "@/lib/posts"

export function FeaturedPostCard({ post }: { post: PostMeta }) {
  return (
    <article className="feat-post">
      <div className="feat-cover" aria-hidden="true">
        <span className="status-badge">Latest</span>
        <div className="feat-cover-frame">
          <span className="mock-bar hl" />
          <span className="mock-bar" />
          <span className="mock-bar" style={{ width: "80%" }} />
          <span className="mock-bar lg" style={{ marginTop: "auto" }} />
        </div>
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

