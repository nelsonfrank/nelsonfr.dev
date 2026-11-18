"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { FeaturedPostCard } from "@/components/featured-post-card"
import { PostRow } from "@/components/post-row"
import { NewsletterPanel } from "@/components/newsletter-panel"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import type { PostMeta } from "@/lib/posts"

interface WritingClientProps {
  posts: PostMeta[]
}

const PAGE_LIMIT = 20

function getYear(dateStr: string): string {
  const parsed = new Date(dateStr)
  if (!isNaN(parsed.getTime())) {
    return String(parsed.getFullYear())
  }
  const match = dateStr.match(/\b(20\d{2})\b/)
  return match ? match[1] : "Archive"
}

export default function WritingClient({ posts }: WritingClientProps) {
  const [activeTopic, setActiveTopic] = useState<string>("All")
  const [inputValue, setInputValue] = useState<string>("")
  const [debouncedQuery, setDebouncedQuery] = useState<string>("")
  const [visibleLimit, setVisibleLimit] = useState<number>(PAGE_LIMIT)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const topics = useMemo(() => {
    const seen = new Set<string>()
    for (const post of posts) {
      for (const tag of post.tags) {
        seen.add(tag)
      }
    }
    return ["All", ...Array.from(seen)]
  }, [posts])

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const topicParam = params.get("topic")
      const qParam = params.get("q")

      if (topicParam) {
        const matched = topics.find(
          (t) => t.toLowerCase() === topicParam.toLowerCase()
        )
        setActiveTopic(matched ?? topicParam)
      }
      if (qParam) {
        setInputValue(qParam)
        setDebouncedQuery(qParam.trim().toLowerCase())
      }
    } catch {
      // Ignore URL parse error
    }
  }, [topics])

  const syncUrl = (nextTopic: string, nextQ: string) => {
    try {
      const url = new URL(window.location.href)
      if (nextTopic === "All") {
        url.searchParams.delete("topic")
      } else {
        url.searchParams.set("topic", nextTopic.toLowerCase())
      }
      const trimmedQ = nextQ.trim()
      if (!trimmedQ) {
        url.searchParams.delete("q")
      } else {
        url.searchParams.set("q", trimmedQ)
      }
      window.history.replaceState({}, "", url.pathname + url.search + url.hash)
    } catch {
      // Ignore history error
    }
  }

  const handleTopicClick = (topic: string) => {
    setActiveTopic(topic)
    syncUrl(topic, inputValue)
  }

  const handleSearchChange = (val: string) => {
    setInputValue(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const normalized = val.trim().toLowerCase()
      setDebouncedQuery(normalized)
      syncUrl(activeTopic, val)
    }, 100)
  }

  const clearSearch = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setInputValue("")
    setDebouncedQuery("")
    syncUrl(activeTopic, "")
  }

  const newestPost = posts[0]

  const years = useMemo(() => {
    const ySet = new Set<string>()
    for (const p of posts) {
      ySet.add(getYear(p.date))
    }
    return Array.from(ySet).sort((a, b) => Number(b) - Number(a))
  }, [posts])

  const isFiltering = activeTopic !== "All" || debouncedQuery.length > 0

  const matchMap = useMemo(() => {
    const map = new Map<string, boolean>()
    let matchedSoFar = 0
    const targetTopic = activeTopic.toLowerCase()

    for (const post of posts) {
      const topicMatch =
        activeTopic === "All" ||
        post.tags.some((t) => t.toLowerCase() === targetTopic)
      const qMatch =
        !debouncedQuery ||
        post.title.toLowerCase().includes(debouncedQuery) ||
        post.excerpt.toLowerCase().includes(debouncedQuery)

      const matches = topicMatch && qMatch
      if (matches) {
        matchedSoFar++
        // Search covers all posts; pagination limit only applies when not searching
        const withinLimit =
          debouncedQuery.length > 0 || matchedSoFar <= visibleLimit
        map.set(post.slug, withinLimit)
      } else {
        map.set(post.slug, false)
      }
    }
    return { map, totalMatched: matchedSoFar }
  }, [posts, activeTopic, debouncedQuery, visibleLimit])

  const visibleYears = useMemo(() => {
    const set = new Set<string>()
    for (const post of posts) {
      if (matchMap.map.get(post.slug)) {
        set.add(getYear(post.date))
      }
    }
    return set
  }, [posts, matchMap])

  return (
    <>
      <Header />

      <main id="main-content">
        <div className="wrap">
          <header className="page-head">
            <h1>
              Notes from <span className="hl-word">real projects.</span>
            </h1>
            <p>
              Practical posts on authentication, backend architecture, and
              TypeScript. Written when a system ships.
            </p>
            <Link className="rss-link" href="/feed.xml">
              Subscribe with RSS
            </Link>
          </header>

          {newestPost && <FeaturedPostCard post={newestPost} />}

          <div className="filter-bar">
            <div
              className="chips"
              role="group"
              aria-label="Filter posts by topic"
            >
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className="chip"
                  data-f={topic.toLowerCase()}
                  aria-pressed={
                    activeTopic.toLowerCase() === topic.toLowerCase()
                  }
                  onClick={() => handleTopicClick(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                flexWrap: "wrap",
              }}
            >
              <span className="count-line" aria-live="polite">
                {matchMap.totalMatched}{" "}
                {matchMap.totalMatched === 1 ? "post" : "posts"}
              </span>
              <input
                className="search-input"
                id="q"
                type="search"
                placeholder="Search posts"
                aria-label="Search posts"
                value={inputValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.preventDefault()
                    clearSearch()
                  }
                }}
              />
            </div>
          </div>

          <div id="list">
            {years.map((year) => {
              const yearPosts = posts.filter((p) => getYear(p.date) === year)
              const yearHasVisible = visibleYears.has(year)

              return (
                <div key={year}>
                  <h2
                    className="yr"
                    data-y={year}
                    hidden={!yearHasVisible}
                  >
                    {year}
                  </h2>
                  {yearPosts.map((post) => {
                    const isVisible = Boolean(matchMap.map.get(post.slug))
                    return (
                      <PostRow
                        key={post.slug}
                        post={post}
                        hidden={!isVisible}
                        dataYear={year}
                        dataTopics={post.tags
                          .map((t) => t.toLowerCase())
                          .join(" ")}
                      />
                    )
                  })}
                </div>
              )
            })}
          </div>

          {!isFiltering && posts.length > visibleLimit && (
            <div style={{ marginTop: "2rem" }}>
              <button
                type="button"
                className="btn s"
                onClick={() => setVisibleLimit((prev) => prev + PAGE_LIMIT)}
              >
                Load more posts
              </button>
            </div>
          )}

          <p
            className="empty-state"
            id="empty"
            hidden={matchMap.totalMatched > 0}
          >
            No posts match. Try another topic or a different word.
          </p>

          <NewsletterPanel />
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  )
}
