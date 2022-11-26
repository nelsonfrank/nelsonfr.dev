import { getAllPosts, PostMeta } from "@/utils/blog";
import Articles from "@/components/articles";

const Blog = ({ posts }: { posts: PostMeta[] }) => {
  return (
    <div>
      <div>
        <h1 className="nf-text-4xl nf-font-semibold">Articles</h1>
        <div className="nf-my-4">
          <Articles posts={posts} />
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const posts = getAllPosts()
    .slice(0, 9)
    .map((post) => post.meta);

  return { props: { posts } };
}
export default Blog;
