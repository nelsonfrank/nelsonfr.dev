import { Badge } from "@/components/ui/badge";
import { getAllPosts, PostMeta } from "@/libs/mdx";
import { cn, randomizeBadgeColor } from "@/libs/utils";
import Link from "next/link";

export const PostCard = ({ post }: { post: PostMeta }) => (
  <div className="relative top-0 flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-75 ease-in-out hover:-top-2 hover:shadow-xl">
    <Link href={`/posts/${post.slug}`}>
      <img
        className="squiggle card-img"
        src={post.image}
        alt={post.title}
        width="360"
        height="192"
      />
    </Link>
    <div className="relative flex-1 px-8 py-6">
      <h2 className="text-2xl font-bold capitalize leading-tight text-black">
        <Link href={`/posts/${post.slug}`}>{post.title.toLowerCase()}</Link>
      </h2>
      <p className="my-4 flex items-center text-xs text-gray-600">
        {new Date(post.date).toLocaleDateString()}
      </p>
      <div className="absolute bottom-1 flex gap-2">
        {post.tags.slice(0, 3).map((tag) => (
          <Link key={tag} href={`/tags/${tag}`}>
            <Badge className={cn(randomizeBadgeColor())}>{tag}</Badge>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

const Posts = () => {
  const posts: PostMeta[] = getAllPosts()
    .slice(0, 3)
    .reverse()
    .map((post) => post.meta);
  return (
    <section className="grid grid-cols-1 gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <div className="col-span-1" key={index + 1}>
          <PostCard post={post} />
        </div>
      ))}
    </section>
  );
};

export default Posts;
