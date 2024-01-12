import { Metadata } from "next";
import { getAllPosts, PostMeta } from "@/libs/mdx";
import { PostCard } from "../posts";

export const metadata: Metadata = {
  title: "Posts",
  description:
    "I writes and posts articles based on tech and programming.",
};

const Blog = () => {
  const posts: PostMeta[] = getAllPosts()
    .slice(0, 9)
    .reverse()
    .map((post) => post.meta);
  return (
    <div>
      <div className="my-8">
        <h1 className="text-4xl font-semibold">Posts</h1>
        <section className="grid grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div className="col-span-1" key={post.slug}>
              <PostCard post={post} />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Blog;
