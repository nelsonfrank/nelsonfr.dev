import { GetStaticPaths, GetStaticProps } from "next";
import { getAllPosts, PostMeta } from "@/utils/blog";
import Posts from "@/components/posts";

const Tags = ({ tag, posts }: { tag: string; posts: PostMeta[] }) => {
  return (
    <div>
      <h1 className="nf-text-4xl nf-font-semibold nf-capitalize">Tag:{tag}</h1>
      <div className="nf-my-4">
        <Posts posts={posts} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = ({ params }) => {
  const { tag } = params as { tag: string };
  const posts = getAllPosts().filter((post) => post.meta.tags.includes(tag));
  return {
    props: {
      tag,
      posts: posts.map((post) => post.meta),
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  const posts = getAllPosts();
  const tags = new Set(posts.map((post) => post.meta.tags).flat());
  const paths = Array.from(tags).map((tag) => ({ params: { tag } }));

  return {
    paths,
    fallback: false,
  };
};
export default Tags;
