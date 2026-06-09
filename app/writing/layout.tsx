import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Writing — Nelson Frank",
  description:
    "Thoughts on software engineering, architecture, TypeScript, React, and the tools I use day to day.",
}

export default function WritingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
