
import { getAllPosts, PostMeta } from "@/libs/mdx";
import Link from "next/link";

export const PostCard = ({ post }: { post: PostMeta }) => (
  <Link
    href={`/posts/${post.slug}`}
    className="relative top-0 block h-full overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-75 ease-in-out hover:-top-2 hover:shadow-xl"
  >
    <img
      className="squiggle card-img"
      src={post.image}
      alt={post.title}
      width="360"
      height="192"
    />
    <div className="px-8 py-6">
      <h2 className="text-2xl font-bold capitalize leading-tight text-black">
        {post.title.toLowerCase()}
      </h2>
      <p className="mt-4 flex items-center text-xs text-gray-600">
        {new Date(post.date).toLocaleDateString()}
      </p>
    </div>
  </Link>
);


const Posts = () => {
    const posts: PostMeta[] = getAllPosts()
		.slice(0, 3)
		.reverse()
		.map((post) => post.meta)
  return (
    <section className="grid grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <div className="col-span-1" key={index+1}>
          <PostCard post={post} />
        </div>
      ))}
    </section>
  );
};

export default Posts;
