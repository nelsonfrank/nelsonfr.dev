---
title: "Understanding Next.js App Router"
excerpt: "A deep dive into the Next.js App Router — layouts, loading states, error boundaries, and server components explained."
date: "May 3, 2024"
readTime: "14 min read"
tags: ["Next.js", "React", "Performance"]
---

The App Router, introduced in Next.js 13 and stabilized in 14, is a fundamental rethink of how you build Next.js apps. It embraces React Server Components, co-locates layouts with routes, and gives you granular control over streaming, caching, and data fetching.

## The File-System Convention

Every folder inside `app/` can contain a handful of special files. The ones you'll use most:

- `page.tsx` — the UI for a route segment. Required for the route to be publicly accessible.
- `layout.tsx` — shared UI that wraps child segments. Persists across navigations.
- `loading.tsx` — React Suspense fallback shown while the page streams in.
- `error.tsx` — error boundary for the segment and its children.
- `not-found.tsx` — rendered when `notFound()` is called.

## Server vs Client Components

By default, every component in `app/` is a React Server Component (RSC). RSCs run on the server, can directly await database queries and secrets, and send zero JavaScript to the browser.

```typescript
// app/posts/page.tsx — a Server Component
// No "use client" → runs on server, can use async/await
import { db } from "@/lib/db"

export default async function PostsPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <ul>
      {posts.map((p) => <li key={p.id}>{p.title}</li>)}
    </ul>
  )
}
```

> **Note:** Add `"use client"` only when you need browser APIs, event handlers, or React hooks like `useState`/`useEffect`. Keep client boundaries as far down the tree as possible.

## Nested Layouts

Layouts wrap their children and persist across navigations within their segment. You can nest layouts to compose complex UIs without re-rendering shared chrome:

```bash
app/
  layout.tsx          # Root layout — wraps everything
  dashboard/
    layout.tsx        # Dashboard sidebar + header
    page.tsx          # /dashboard
    settings/
      page.tsx        # /dashboard/settings (uses dashboard layout)
```

## Streaming with Loading UI

Place a `loading.tsx` next to your `page.tsx` and Next.js automatically wraps the page in a Suspense boundary. The layout renders immediately while the page's async work completes:

```typescript
// app/posts/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  )
}
```

## Data Fetching Patterns

- Fetch in Server Components — keeps secrets server-side, eliminates client waterfalls
- Use parallel fetching with `Promise.all()` for independent queries
- Leverage Next.js extended `fetch()` with `{ cache: 'force-cache' | 'no-store' }` or `{ next: { revalidate: 60 } }`
- Use React `cache()` to deduplicate identical requests within a render

```typescript
// Parallel fetching pattern
export default async function Page({ params }: { params: { id: string } }) {
  const [post, author] = await Promise.all([
    getPost(params.id),
    getAuthor(params.id),
  ])

  return <PostView post={post} author={author} />
}
```

> **Warning:** Avoid sequential `await`s for independent data. Each await in a chain blocks the next — use `Promise.all()` to run them concurrently.

## Dynamic vs Static Routes

By default, routes are statically rendered at build time. Opt into dynamic rendering by using dynamic data sources (cookies, headers, searchParams) or exporting `dynamic = 'force-dynamic'`. For the best performance, prefer static and revalidate on demand with `revalidatePath()` or `revalidateTag()`.
