import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Experience — Nelson Frank",
  description:
    "My professional journey — senior roles in fullstack software engineering, the companies I've worked with, and the technologies I've used.",
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
