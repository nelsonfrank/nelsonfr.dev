import { projects } from "@/lib/projects"
import ProjectsClient from "./ProjectsClient"

export default function ProjectsPage() {
  return <ProjectsClient initialProjects={projects} />
}
