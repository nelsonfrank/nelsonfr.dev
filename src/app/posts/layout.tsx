import "@/styles/mdx.css";

export const metadata = {
  title: "Posts",
  description: "Posts and tips, mostly about software.",
  alternates: {
    canonical: "https://nelsonfr.vercel.app",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <article>{children}</article>
    </div>
  );
}
