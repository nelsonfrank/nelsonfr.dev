// dependencies
import { GetStaticPaths, GetStaticProps } from "next";
import { Metadata } from "next";

//components
import Posts from "@/components/posts";

// utils
import { getAllPosts, PostMeta } from "@/libs/mdx";
import { PostCard } from "@/app/posts";

export const metadata: Metadata = {
  title: "Tags",
};

const filterAllPostsByTag = async ({ params }: { params: { tag: string } }) => {
  const { tag } = params;
  const posts = getAllPosts().filter((post) => post.meta.tags.includes(tag));

	return {
    tag,
    posts: posts.map((post) => post.meta),
  };
};
const Tags = async ({params}: {params: {tag: string}}) => {
	const { posts, tag } = await filterAllPostsByTag({ params });
	
  return (
    <div className="my-8">
      <h1 className="text-4xl font-semibold capitalize">Tag:{tag}</h1>
      <section className="grid grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div className="col-span-1" key={post.slug}>
            <PostCard post={post} />
          </div>
        ))}
      </section>
    </div>
  );
};

export default Tags;
