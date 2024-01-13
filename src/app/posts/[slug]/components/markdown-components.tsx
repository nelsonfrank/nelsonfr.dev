import Link from "next/link";
import { Code } from "bright";
import YouTube from "@/components/youtube";
import { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  a: ({ children, ...props }: any) => {
    return (
      <Link {...props} href={props.href || ""}>
        {children}
      </Link>
    );
  },
  pre:  ({
    children,
    ...props
  }: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLPreElement
  >) => {
    return (
      <Code {...props} theme="material-default">
        {children as any}
      </Code>
    )
  },
  YouTube,
};