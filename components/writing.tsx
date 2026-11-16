import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { PostMeta } from "@/lib/posts"

export function Writing({ posts }: { posts: PostMeta[] }) {
  return (
    <section id="writing" className="py-16 md:py-20 border-t border-border">
      <div className="page-container">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <h2 className="text-[28px] font-semibold tracking-tight text-foreground">
            Writing
          </h2>
          <Link
            href="/writing"
            className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-mono uppercase tracking-[0.05em] text-primary hover:underline"
          >
            <span>All articles</span>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="divide-y divide-border border-t border-b border-border">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-6 py-4 min-h-[44px] transition-colors duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 min-w-0">
                <time className="meta-mono shrink-0 sm:w-36">{post.date}</time>
                <h3 className="text-[18px] font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                  {post.title}
                </h3>
              </div>
              {post.tags[0] && (
                <span className="meta-mono shrink-0">{post.tags[0]}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
