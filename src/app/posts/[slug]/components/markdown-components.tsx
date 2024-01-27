import Link from "next/link";
import { Code } from "bright";
import YouTube from "@/components/youtube";
import { MDXComponents } from "mdx/types";
import { MDXNote } from "./mdx-note";

export const mdxComponents: MDXComponents = {
  a: ({ children, ...props }: any) => {
    return (
      <Link {...props} href={props.href || ""} target="_blank">
        {children}
      </Link>
    );
  },
  pre: ({
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
    );
  },
  Note: MDXNote,
  YouTube,
};
