export interface ProjectDecision {
  decision: string
  tradeoff: string
}

export interface ProjectLink {
  label: string
  url: string
}

export interface Project {
  slug: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  githubLinks?: ProjectLink[]
  featured: boolean
  category?: string
  outcome?: string
  architectureImage?: string
  diagram?: {
    nodes: [string, string, string]
  }
  role?: string
  year?: string
  problem?: string
  result?: string
  myPart?: string
  decisions?: ProjectDecision[]
  results?: string[]
  relatedPosts?: string[]
  nextProject?: string
  content?: string // Detailed Markdown content
}

export const SELECTED_WORK_SLUGS = [
  "passkey-auth",
  "city-connector-backend",
  "necta-explorer",
] as const

export const projects: Project[] = [
  {
    slug: "passkey-auth",
    title: "Passkey Authentication Engine",
    description:
      "A production-ready, biometric-driven authentication system designed to replace legacy password and OTP systems.",
    outcome:
      "Eliminates credential phishing and replay attacks via origin-bound WebAuthn assertions and signature counter checks.",
    diagram: {
      nodes: ["Browser", "NestJS API", "Postgres"],
    },
    image: "/projects/passkey-auth.png",
    technologies: ["TypeScript", "NestJS", "React", "TypeORM", "PostgreSQL", "WebAuthn"],
    liveUrl: "#",
    githubUrl: "https://github.com/nelsonfrank/passkey-auth-demo",
    featured: true,
    category: "Web App",
    role: "Lead Engineer",
    year: "2026",
  },
  {
    slug: "city-connector-backend",
    title: "City Connector",
    description:
      "Full-stack multi-agency transit platform pairing an offline-first React Native (Expo) mobile app with Go RAPTOR routing microservices, GTFS/GTFS-RT ingestion, and Kong API gateway.",
    outcome:
      "Computes Pareto-optimal multimodal transit routes in milliseconds via Go RAPTOR and Redis, rendered on an offline-first React Native MapLibre client.",
    architectureImage: "/projects/city-connector-architecture.jpg",
    diagram: {
      nodes: ["RN Mobile", "Go RAPTOR", "Redis/GTFS"],
    },
    image: "/projects/city-connector-architecture.jpg",
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Go",
      "Python",
      "RAPTOR",
      "GTFS",
      "Kong Gateway",
      "PostgreSQL",
      "Redis",
      "Kubernetes",
    ],
    githubUrl: "https://github.com/nelsonfrank/city-connector-backend",
    githubLinks: [
      {
        label: "Backend",
        url: "https://github.com/nelsonfrank/city-connector-backend",
      },
      {
        label: "Mobile",
        url: "https://github.com/nelsonfrank/city-connector-mobile",
      },
    ],
    featured: true,
    category: "Distributed Systems",
    role: "Fullstack, Mobile & Infra",
    year: "2026",
  },
  {
    slug: "necta-explorer",
    title: "NECTA Explorer",
    description:
      "A high-performance asynchronous data crawler and interactive web dashboard for Tanzania NECTA examination results.",
    outcome:
      "Normalizes multi-year national exam archives across all 5 NECTA levels into indexed PostgreSQL analytics.",
    diagram: {
      nodes: ["Scraper", "Postgres", "Next.js"],
    },
    image: "/projects/necta-explorer.png",
    technologies: [
      "Python",
      "httpx",
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "TailwindCSS",
    ],
    githubUrl: "https://github.com/nelsonfrank/necta-explorer",
    featured: true,
    category: "Web App",
    role: "Fullstack & Data Engineer",
    year: "2025",
  },
  {
    slug: "i8n-automation-cli",
    title: "i18n Automation CLI",
    description:
      "An AI-native internationalization pipeline for React and TypeScript codebases featuring AST transformation, multi-provider LLM translation, and strict verification gates.",
    outcome:
      "Automates React and TypeScript localization via Babel AST codemods backed by 218 passing tests across 30 test suites.",
    image: "/projects/i8n-automation-cli.png",
    technologies: [
      "TypeScript",
      "Node.js",
      "Babel AST",
      "Gemini 3.8",
      "OpenAI",
      "react-i18next",
      "Vitest",
    ],
    githubUrl: "https://github.com/nelsonfrank/i8n-automation-cli",
    featured: true,
    category: "Developer Tools",
  },
  {
    slug: "homelab",
    title: "Homelab & Kubernetes Architecture",
    description:
      "Self-hosted personal cloud and media infrastructure with Portainer stacks and a 3-level progressive migration path to Kubernetes with GitOps and automated TLS.",
    outcome:
      "3-level Docker Compose to Kubernetes GitOps blueprint with Argo CD, automated TLS, and fail-closed VPN sidecars.",
    image: "/projects/homelab.png",
    technologies: [
      "Kubernetes",
      "Docker",
      "Portainer",
      "Kustomize",
      "Argo CD",
      "cert-manager",
      "Linux",
    ],
    githubUrl: "https://github.com/nelsonfrank/homelab",
    featured: true,
    category: "DevOps & Cloud",
  },
]
