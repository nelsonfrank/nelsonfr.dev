export interface Project {
  slug: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  category: string
  content?: string // Detailed Markdown content
}

export const projects: Project[] = [
  {
    slug: "passkey-auth",
    title: "Passkey Authentication Engine",
    description: "A production-ready, biometric-driven authentication system designed to replace legacy password and OTP systems.",
    image: "/projects/passkey-auth.png",
    technologies: ["TypeScript", "NestJS", "React", "TypeORM", "PostgreSQL", "WebAuthn"],
    liveUrl: "#",
    githubUrl: "https://github.com/nelsonfrank/passkey-auth-demo",
    featured: true,
    category: "Web App",
  },

]
