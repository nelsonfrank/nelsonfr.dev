import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPost } from "@/libs/mdx";
import {PostBody} from './components/post-body';
import { Metadata } from "next";

import { env } from "@/env.mjs";
import { absoluteUrl } from "@/libs/utils";

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const {post} = await getPost({ params });

  if (!post) {
    return {};
  }

  const url = env.NEXT_PUBLIC_APP_URL;

  const ogUrl = new URL(`${url}/api/og`);
  ogUrl.searchParams.set("title", post.meta.title);
  ogUrl.searchParams.set("type", "Blog Post");
  ogUrl.searchParams.set("mode", "dark");

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: post.meta.title,
    description: post.meta.excerpt,

    openGraph: {
      title: post.meta.title,
      description: post.meta.excerpt,
      type: "article",
      url: absoluteUrl(post.meta.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.excerpt,
      images: [ogUrl.toString()],
    },
  };
}
const BlogPost = async ({ params }: PostPageProps) => {
  const { post } = await getPost({ params });

  if (!post) return notFound();

  return (
    <article className="mx-4 py-8 leading-relaxed">
      <h1>{post.meta.title}</h1>
      <Suspense fallback={<>Loading...</>}>
        <PostBody>{post?.source}</PostBody>
      </Suspense>
    </article>
  );
};

export default BlogPost;
