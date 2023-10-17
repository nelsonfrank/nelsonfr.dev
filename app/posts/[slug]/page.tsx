// dependencies
import { Metadata } from "next";
import type { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

// components
import YouTube from "@/components/youtube";

// utils
import { getPostFromSlug, getSlugs, PostMeta } from "@/utils/blog";

interface MDXPost {
	source: MDXRemoteSerializeResult<Record<string, unknown>>;
	meta: PostMeta;
}

export const metadata: Metadata = {
	title: "My Page Title",
};

const BlogPost = ({ post }: { post: MDXPost }) => {
	return (
		<div className='py-8 mx-4'>
			{/* <SEO title={post.meta.title} description={post.meta.excerpt} /> */}
			<h1>{post.meta.title}</h1>
			<MDXRemote {...post.source} components={{ YouTube, Image }} />
		</div>
	);
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug } = params as { slug: string };
	const { content, meta } = getPostFromSlug(slug);
	const mdxSource = await serialize(content, {
		mdxOptions: {
			rehypePlugins: [
				rehypeSlug,
				[rehypeAutolinkHeadings, { behavior: "wrap" }],
				rehypeHighlight,
			],
		},
	});

	return { props: { post: { source: mdxSource, meta } } };
};

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = getSlugs().map((slug) => ({ params: { slug } }));

	return {
		paths,
		fallback: false,
	};
};

export default BlogPost;
