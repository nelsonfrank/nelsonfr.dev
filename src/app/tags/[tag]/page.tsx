// dependencies
import { GetStaticPaths, GetStaticProps } from "next";
import { Metadata } from "next";

//components
import Posts from "@/components/posts";

// utils
import { getAllPosts, PostMeta } from "@/libs/mdx";

export const metadata: Metadata = {
	title: "Tags",
};

const Tags = ({ tag, posts }: { tag: string; posts: PostMeta[] }) => {
	return (
		<div>
			{/* <SEO title={`Tag: ${tag}`} /> */}
			<h1 className='text-4xl font-semibold capitalize'>Tag:{tag}</h1>
			<div className='my-4'>
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
