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
    slug: "finance-tracker",
    title: "Finance Tracker",
    description: "Personal finance app with data visualization, interactive charts, and real-time tracking. Designed thoughtful UX for complex financial data exploration.",
    image: "/projects/finance-tracker.jpg",
    technologies: ["Next.js", "TypeScript", "shadcn/ui", "Recharts", "D3.js"],
    githubUrl: "https://github.com/nelsonfrank/finance-tracker-monorepo",
    featured: true,
    category: "Open Source",
  },
  {
    slug: "ai-text-generator",
    title: "AI Powered Text Generator",
    description: "Text generator powered by OpenAI API, based on GPT-3.5. Features real-time streaming responses and a clean, intuitive interface.",
    image: "/projects/ai-text.jpg",
    technologies: ["TypeScript", "Next.js", "OpenAI", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
    category: "Web App",
  },
  {
    slug: "live-markdown-editor",
    title: "Live Markdown Editor",
    description: "A real-time markdown editor with live preview, syntax highlighting, and export functionality. Built for developers who write.",
    image: "/projects/markdown.jpg",
    technologies: ["TypeScript", "React", "CodeMirror", "Markdown"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
    category: "Web App",
  },
  {
    slug: "booking-app",
    title: "Booking App",
    description: "A full-featured booking application with calendar integration, payment processing, and real-time availability updates.",
    image: "/projects/booking.jpg",
    technologies: ["Flutter", "Dart", "Firebase", "Stripe"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    category: "Mobile App",
  },
]
