import { getAllPosts } from "@/lib/posts"
import WritingClient from "./WritingClient"

export default function WritingPage() {
  const posts = getAllPosts()
  return <WritingClient posts={posts} />
}
