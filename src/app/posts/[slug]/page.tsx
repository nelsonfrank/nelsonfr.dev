import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPost } from "@/libs/mdx";
import {PostBody} from './components/post-body';


const BlogPost = async ({ params }: { params: { slug: string } }) => {
  const { post } = await getPost({ params });

  if (!post) return notFound();

  
  return (
    <div className="mx-4 py-8">
      <h1>{post.meta.title}</h1>
      <Suspense fallback={<>Loading...</>}>
        <PostBody>{ post?.source }</PostBody>
      </Suspense>
    </div>
  );
};

export default BlogPost;
