import type { Metadata } from "next"
import { getAllPosts } from "@/lib/posts"
import WritingClient from "./WritingClient"

export const metadata: Metadata = {
  title: "Writing — Nelson Frank",
  description: "Articles, tutorials, and notes on software engineering, web development, and clean code.",
}

export default function WritingPage() {
  const posts = getAllPosts()
  return <WritingClient posts={posts} />
}
