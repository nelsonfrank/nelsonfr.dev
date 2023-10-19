// dependencies
import { Metadata } from "next";
import Image from "next/image";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDXRemote } from "next-mdx-remote/rsc";

import "highlight.js/styles/atom-one-dark.css";

// components
import YouTube from "@/components/youtube";

// utils
import { getPostFromSlug, getSlugs, PostMeta } from "@/utils/blog";
import { Suspense } from "react";

interface MDXPost {
	source: MDXRemoteSerializeResult<Record<string, unknown>>;
	meta: PostMeta;
}

export const metadata: Metadata = {
	title: "My Page Title",
};

const getPost = async ({ params }: { params: { slug: string } }) => {
	const { slug } = params;
	const { content, meta } = getPostFromSlug(slug);

	return { post: { source: content, meta } };
};

const BlogPost = async ({ params }: { params: { slug: string } }) => {
	const { post } = await getPost({ params });
	// console.log({ post });
	const Img = Image;
	return (
		<div className='py-8 mx-4'>
			{/* <SEO title={post.meta.title} description={post.meta.excerpt} /> */}
			<h1>{post.meta.title}</h1>
			<Suspense fallback={<>Loading...</>}>
				<MDXRemote source={post.source} components={{ YouTube }} />
			</Suspense>
		</div>
	);
};



export default BlogPost;
