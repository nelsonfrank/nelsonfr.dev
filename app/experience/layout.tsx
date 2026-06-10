import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Experience — Nelson Frank",
  description:
    "My professional journey — Fullstack software engineer — roles, experiences, and the tech I've used.",
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
