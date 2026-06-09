import { getAllExperiences } from "@/lib/experience"
import ExperienceClient from "./ExperienceClient"

export default function ExperiencePage() {
  const experiences = getAllExperiences()
  return <ExperienceClient experiences={experiences} />
}
