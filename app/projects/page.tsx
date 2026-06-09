import type { Metadata } from "next"
import { projects } from "@/lib/projects"
import ProjectsClient from "./ProjectsClient"

export const metadata: Metadata = {
  title: "Projects — Nelson Frank",
  description: "A showcase of web applications, mobile platforms, and open-source software designed, architected, and built by Nelson Frank.",
}

export default function ProjectsPage() {
  return <ProjectsClient initialProjects={projects} />
}
