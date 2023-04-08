// components
import Posts from "@/components/posts";
import SEO from "@/components/seo";

// utils
import { getAllPosts, PostMeta } from "@/utils/blog";

const Blog = ({ posts }: { posts: PostMeta[] }) => {
  return (
    <div>
      <SEO
        title="Blog"
        description="I writes and posts articles based on web development regularly, check them out"
      />
      <div className="nf-my-4">
        <h1 className="nf-text-4xl nf-font-semibold">Posts</h1>
        <div>
          <Posts posts={posts} />
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const posts = getAllPosts()
		.slice(0, 9)
		.reverse()
		.map((post) => post.meta);

  return { props: { posts } };
}
export default Blog;
