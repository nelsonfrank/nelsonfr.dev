// components
import Posts from "@/components/posts";
import { Metadata } from "next";

// utils
import { getAllPosts, PostMeta } from "@/libs/mdx";

export const metadata: Metadata = {
	title: "Posts",
	description:
		"I writes and posts articles based on web development regularly, check them out",
};

const Blog = () => {
	const posts: PostMeta[] = getAllPosts()
		.slice(0, 9)
		.reverse()
		.map((post) => post.meta);
	return (
		<div>
			<div className='my-4'>
				<h1 className='text-4xl font-semibold'>Posts</h1>
				<div>
					<Posts posts={posts} />
				</div>
			</div>
		</div>
	);
};

export default Blog;
