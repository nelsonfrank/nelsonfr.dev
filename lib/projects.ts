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
  {
    slug: "necta-explorer",
    title: "NECTA Explorer",
    description: "A high-performance asynchronous data crawler and interactive web dashboard for Tanzania NECTA examination results.",
    image: "/projects/necta-explorer.png",
    technologies: ["Python", "httpx", "Next.js", "TypeScript", "Prisma", "PostgreSQL", "TailwindCSS"],
    githubUrl: "https://github.com/nelsonfrank/necta-explorer",
    featured: true,
    category: "Web App",
  },
  {
    slug: "city-connector-backend",
    title: "City Connector Backend",
    description: "High-performance microservices transit routing and real-time engine implementing the RAPTOR algorithm, GTFS ingestion, and Kong API gateway.",
    image: "/projects/city-connector-backend.png",
    technologies: ["Go", "Python", "RAPTOR", "GTFS", "Kong Gateway", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
    githubUrl: "https://github.com/nelsonfrank/city-connector-backend",
    featured: true,
    category: "Distributed Systems",
  },
  {
    slug: "i8n-automation-cli",
    title: "i18n Automation CLI",
    description: "An AI-native internationalization pipeline for React and TypeScript codebases featuring AST transformation, multi-provider LLM translation, and strict verification gates.",
    image: "/projects/i8n-automation-cli.png",
    technologies: ["TypeScript", "Node.js", "Babel AST", "Gemini 3.8", "OpenAI", "react-i18next", "Vitest"],
    githubUrl: "https://github.com/nelsonfrank/i8n-automation-cli",
    featured: true,
    category: "Developer Tools",
  },
  {
    slug: "homelab",
    title: "Homelab & Kubernetes Architecture",
    description: "Self-hosted personal cloud and media infrastructure with Portainer stacks and a 3-level progressive migration path to Kubernetes with GitOps and automated TLS.",
    image: "/projects/homelab.png",
    technologies: ["Kubernetes", "Docker", "Portainer", "Kustomize", "Argo CD", "cert-manager", "Linux"],
    githubUrl: "https://github.com/nelsonfrank/homelab",
    featured: true,
    category: "DevOps & Cloud",
  },
]
