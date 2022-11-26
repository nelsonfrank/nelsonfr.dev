import { PostMeta } from "@/utils/blog";
import Link from "next/link";

const Posts = ({ posts }: { posts: PostMeta[] }) => (
  <ul>
    {posts.map((post) => (
      <li key={post.slug} className="nf-list-none nf-my-6">
        <h1 className="nf-text-2xl nf-my-2 nf-text-primary">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h1>
        <p>{post.excerpt}</p>
        <p className="nf-text-sm tags nf-mt-2">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`}>
              {tag}
            </Link>
          ))}
        </p>
      </li>
    ))}
  </ul>
);

export default Posts;
