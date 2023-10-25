// dependencies
import Link from "next/link";

// utils
import { PostMeta } from "@/utils/blog";

const Posts = ({ posts }: { posts: PostMeta[] }) => (
	<ul>
		{posts.map((post) => (
			<li key={post.slug} className='list-none my-6'>
				<h1 className='text-2xl my-2 text-primary'>
					<Link href={`/posts/${post.slug}`}>{post.title}</Link>
				</h1>
				<p>{post.excerpt}</p>
				<p className='text-sm tags mt-2'>
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
