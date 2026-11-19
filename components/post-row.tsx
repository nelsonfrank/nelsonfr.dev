import Link from "next/link"
import type { PostMeta } from "@/lib/posts"

export function formatShortDate(dateStr: string, includeYear = false): string {
  const parsed = new Date(dateStr)
  if (isNaN(parsed.getTime())) return dateStr
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: includeYear ? undefined : "numeric",
      year: includeYear ? "numeric" : undefined,
    }).format(parsed)
  } catch {
    return dateStr
  }
}

export function PostRow({
  post,
  showYearInDate = false,
  hidden = false,
  dataYear,
  dataTopics,
}: {
  post: PostMeta
  showYearInDate?: boolean
  hidden?: boolean
  dataYear?: string
  dataTopics?: string
}) {
  return (
    <article
      className="post-row"
      hidden={hidden}
      data-y={dataYear}
      data-c={dataTopics}
    >
      <time dateTime={post.date}>
        {formatShortDate(post.date, showYearInDate)}
      </time>
      <div>
        <h3>
          <Link href={`/writing/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
      </div>
      <span className="rt">{post.readTime}</span>
    </article>
  )
}

