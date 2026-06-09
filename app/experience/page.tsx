import type { Metadata } from "next"
import { getAllExperiences } from "@/lib/experience"
import ExperienceClient from "./ExperienceClient"

export const metadata: Metadata = {
  title: "Experience — Nelson Frank",
  description: "Professional history and timeline of software development roles, projects, and technologies.",
}

export default function ExperiencePage() {
  const experiences = getAllExperiences()
  return <ExperienceClient experiences={experiences} />
}
