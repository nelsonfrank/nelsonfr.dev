import Link from "next/link"
import type { PostMeta } from "@/lib/posts"
import { PostRow } from "@/components/post-row"

export function Writing({ posts }: { posts: PostMeta[] }) {
  return (
    <section id="writing" className="site-section">
      <div className="wrap">
        <h2 className="sec-h2">Writing</h2>
        <p className="sec-sub">
          Lessons from shipping real software, written plainly.
        </p>

        <div>
          {posts.map((post) => (
            <PostRow key={post.slug} post={post} showYearInDate />
          ))}
        </div>

        <p className="more-link">
          <Link href="/writing">Read all posts</Link>
        </p>
      </div>
    </section>
  )
}
