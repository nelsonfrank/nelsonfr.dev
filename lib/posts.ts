export type PostSection =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "callout"; variant: "note" | "tip" | "warning"; text: string }
  | { type: "list"; items: string[] }

export interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  content: PostSection[]
}

export const posts: Post[] = [
  {
    slug: "graphql-query-mutation",
    title: "Get Started On GraphQL Query And Mutation",
    excerpt:
      "Learn the fundamentals of GraphQL queries and mutations. A comprehensive guide to getting started with GraphQL in your projects.",
    date: "April 8, 2023",
    readTime: "8 min read",
    tags: ["API", "GraphQL", "Fundamentals"],
    content: [
      {
        type: "paragraph",
        text: "GraphQL has rapidly become one of the most popular API query languages, giving clients the power to ask for exactly what they need — nothing more, nothing less. If you're coming from a REST background, the mental shift can feel steep at first, but once it clicks, you won't want to go back.",
      },
      {
        type: "heading",
        text: "What is a GraphQL Query?",
      },
      {
        type: "paragraph",
        text: "A query is how you fetch data in GraphQL. Unlike REST where different endpoints return fixed shapes of data, a query lets you describe the exact shape of the response you want. The server then resolves only the fields you requested.",
      },
      {
        type: "code",
        lang: "graphql",
        code: `query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    posts {
      title
      publishedAt
    }
  }
}`,
      },
      {
        type: "callout",
        variant: "tip",
        text: "Always name your operations (e.g. GetUser) — it makes debugging in Apollo Studio and server logs dramatically easier.",
      },
      {
        type: "heading",
        text: "What is a Mutation?",
      },
      {
        type: "paragraph",
        text: "While queries are read-only, mutations are how you write data. They follow the same syntax but signal to the server that a side-effect is intended — creating, updating, or deleting records.",
      },
      {
        type: "code",
        lang: "graphql",
        code: `mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    createdAt
  }
}`,
      },
      {
        type: "heading",
        text: "Variables",
      },
      {
        type: "paragraph",
        text: "Hard-coding values into a query string is an antipattern. Variables keep queries clean and reusable. Pass them as a separate JSON object alongside the query.",
      },
      {
        type: "code",
        lang: "json",
        code: `{
  "input": {
    "title": "Hello GraphQL",
    "body": "This is my first GraphQL-powered post.",
    "authorId": "usr_abc123"
  }
}`,
      },
      {
        type: "heading",
        text: "Sending Requests from the Client",
      },
      {
        type: "paragraph",
        text: "GraphQL runs over a single HTTP endpoint (usually /graphql) using POST. You can use any HTTP client, but libraries like Apollo Client and urql add caching, reactive updates, and error handling out of the box.",
      },
      {
        type: "code",
        lang: "typescript",
        code: `// Using fetch directly
const response = await fetch("/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: \`
      query GetUser($id: ID!) {
        user(id: $id) { id name email }
      }
    \`,
    variables: { id: "usr_abc123" },
  }),
})

const { data, errors } = await response.json()`,
      },
      {
        type: "callout",
        variant: "warning",
        text: "Always check for the errors array in the response. GraphQL can return a 200 status with partial data and errors simultaneously.",
      },
      {
        type: "heading",
        text: "Key Takeaways",
      },
      {
        type: "list",
        items: [
          "Queries fetch data; mutations write it — both use the same syntax",
          "Always use named operations and variables",
          "GraphQL runs over a single POST endpoint",
          "Client libraries (Apollo, urql) add caching and reactive updates",
          "Always handle the errors array even on HTTP 200 responses",
        ],
      },
      {
        type: "paragraph",
        text: "This is just the beginning. Once you're comfortable with queries and mutations, explore subscriptions for real-time data, fragments for reusable field sets, and directives for conditional field inclusion.",
      },
    ],
  },

  {
    slug: "nodejs-express-typescript",
    title: "A Step-By-Step Guide To Setting Up A Node.js And Express App With TypeScript",
    excerpt:
      "Everything you need to know about setting up a modern Node.js and Express application with TypeScript, from scratch to production.",
    date: "January 27, 2024",
    readTime: "12 min read",
    tags: ["API", "Node.js", "TypeScript"],
    content: [
      {
        type: "paragraph",
        text: "TypeScript has become the de facto standard for serious Node.js projects. The type safety, IDE intelligence, and refactoring confidence it provides pay dividends at scale. This guide walks you from an empty directory to a running Express server with full TypeScript support.",
      },
      {
        type: "heading",
        text: "1. Initialize the Project",
      },
      {
        type: "code",
        lang: "bash",
        code: `mkdir my-api && cd my-api
npm init -y
npm install express
npm install -D typescript ts-node-dev @types/node @types/express`,
      },
      {
        type: "heading",
        text: "2. Configure TypeScript",
      },
      {
        type: "paragraph",
        text: "Generate a tsconfig.json and tweak the key options for a Node.js backend:",
      },
      {
        type: "code",
        lang: "bash",
        code: `npx tsc --init`,
      },
      {
        type: "code",
        lang: "json",
        code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
      },
      {
        type: "heading",
        text: "3. Project Structure",
      },
      {
        type: "list",
        items: [
          "src/index.ts — entry point, creates and starts the server",
          "src/app.ts — Express app factory (easier to test in isolation)",
          "src/routes/ — route handlers grouped by resource",
          "src/middleware/ — auth, error handling, logging",
          "src/types/ — shared TypeScript interfaces",
        ],
      },
      {
        type: "heading",
        text: "4. The App Factory",
      },
      {
        type: "code",
        lang: "typescript",
        code: `// src/app.ts
import express, { Application, Request, Response, NextFunction } from "express"

export function createApp(): Application {
  const app = express()

  app.use(express.json())

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", ts: new Date().toISOString() })
  })

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not found" })
  })

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack)
    res.status(500).json({ error: err.message })
  })

  return app
}`,
      },
      {
        type: "code",
        lang: "typescript",
        code: `// src/index.ts
import { createApp } from "./app"

const PORT = process.env.PORT ?? 3000
const app = createApp()

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`)
})`,
      },
      {
        type: "heading",
        text: "5. Dev & Build Scripts",
      },
      {
        type: "code",
        lang: "json",
        code: `{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}`,
      },
      {
        type: "callout",
        variant: "tip",
        text: "ts-node-dev uses esbuild under the hood, so reloads are near-instant — much faster than ts-node alone.",
      },
      {
        type: "heading",
        text: "6. Environment Variables",
      },
      {
        type: "paragraph",
        text: "Never hard-code secrets. Use dotenv for local dev and your deployment platform's secret manager in production:",
      },
      {
        type: "code",
        lang: "typescript",
        code: `import "dotenv/config" // must be first import in index.ts

const PORT = process.env.PORT ?? 3000
const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error("DATABASE_URL is required")`,
      },
      {
        type: "callout",
        variant: "warning",
        text: "Throw early if required env vars are missing. Silent failures cause confusing runtime errors deep in your stack.",
      },
      {
        type: "heading",
        text: "Next Steps",
      },
      {
        type: "list",
        items: [
          "Add Zod for runtime request validation",
          "Set up Prisma or Drizzle for type-safe database access",
          "Add Jest + Supertest for integration tests",
          "Configure ESLint + Prettier for consistent code style",
          "Containerize with Docker for reproducible deployments",
        ],
      },
    ],
  },

  {
    slug: "scalable-react",
    title: "Building Scalable React Applications",
    excerpt:
      "Best practices and patterns for building scalable React applications that are maintainable and performant.",
    date: "March 15, 2024",
    readTime: "10 min read",
    tags: ["React", "Architecture", "Performance"],
    content: [
      {
        type: "paragraph",
        text: "Scaling a React app is less about technical tricks and more about enforcing consistent patterns before complexity hits. The decisions you make at 5K lines of code will either serve you or haunt you at 50K.",
      },
      {
        type: "heading",
        text: "Feature-First Folder Structure",
      },
      {
        type: "paragraph",
        text: "Flat component folders collapse under real-world feature growth. Instead, co-locate everything a feature needs — components, hooks, types, API calls — in a dedicated directory.",
      },
      {
        type: "code",
        lang: "bash",
        code: `src/
  features/
    auth/
      components/    # LoginForm, SignupForm
      hooks/         # useAuth, useSession
      api/           # auth.api.ts
      types.ts
    dashboard/
      ...
  shared/
    components/      # Button, Input, Modal
    hooks/           # useDebounce, useLocalStorage
    utils/`,
      },
      {
        type: "callout",
        variant: "tip",
        text: "A good heuristic: if a component is used by more than one feature, move it to shared/. If it's only used within one feature, keep it co-located.",
      },
      {
        type: "heading",
        text: "Custom Hooks for Logic",
      },
      {
        type: "paragraph",
        text: "Components should be thin. Extract all non-rendering logic into custom hooks. This makes it easy to test, reuse, and replace implementation details without touching the UI.",
      },
      {
        type: "code",
        lang: "typescript",
        code: `// features/auth/hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession().then(setUser).finally(() => setLoading(false))
  }, [])

  const logout = useCallback(async () => {
    await signOut()
    setUser(null)
  }, [])

  return { user, loading, logout }
}`,
      },
      {
        type: "heading",
        text: "State Management",
      },
      {
        type: "paragraph",
        text: "Not every state needs a global store. Follow this decision hierarchy:",
      },
      {
        type: "list",
        items: [
          "UI state (open/closed, selected tab) → useState in the component",
          "Shared local state (form values across siblings) → lift to parent or useContext",
          "Server state (API data) → React Query or SWR",
          "Complex global state → Zustand or Jotai (avoid Redux for most apps)",
        ],
      },
      {
        type: "heading",
        text: "Performance: Memoization Done Right",
      },
      {
        type: "paragraph",
        text: "Over-memoization is a real problem. Wrapping everything in useMemo and useCallback adds complexity without benefit if the computation is trivial or the dependency array is unstable.",
      },
      {
        type: "code",
        lang: "typescript",
        code: `// ✅ Worthwhile — expensive computation, stable deps
const sortedItems = useMemo(
  () => items.slice().sort((a, b) => b.score - a.score),
  [items]
)

// ❌ Wasteful — object literal recreates every render anyway
const config = useMemo(() => ({ color: "red" }), [])
const config = { color: "red" } // simpler and equivalent`,
      },
      {
        type: "callout",
        variant: "note",
        text: "Profile first with React DevTools Profiler before optimizing. Real bottlenecks are rarely where you expect them.",
      },
      {
        type: "heading",
        text: "Absolute Imports",
      },
      {
        type: "paragraph",
        text: "Relative import chains (../../../../components) are a refactoring nightmare. Configure path aliases so imports read like intent, not filesystem navigation:",
      },
      {
        type: "code",
        lang: "typescript",
        code: `// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// Before
import { Button } from "../../../shared/components/Button"

// After
import { Button } from "@/shared/components/Button"`,
      },
      {
        type: "heading",
        text: "Summary",
      },
      {
        type: "list",
        items: [
          "Use feature-first folder structure from day one",
          "Keep components thin — move logic into custom hooks",
          "Match state to the right tool (local, context, server, global)",
          "Memoize only what profiling reveals as a bottleneck",
          "Configure path aliases to keep imports readable",
        ],
      },
    ],
  },

  {
    slug: "nextjs-app-router",
    title: "Understanding Next.js App Router",
    excerpt:
      "A deep dive into the Next.js App Router — layouts, loading states, error boundaries, and server components explained.",
    date: "May 3, 2024",
    readTime: "14 min read",
    tags: ["Next.js", "React", "Performance"],
    content: [
      {
        type: "paragraph",
        text: "The App Router, introduced in Next.js 13 and stabilized in 14, is a fundamental rethink of how you build Next.js apps. It embraces React Server Components, co-locates layouts with routes, and gives you granular control over streaming, caching, and data fetching.",
      },
      {
        type: "heading",
        text: "The File-System Convention",
      },
      {
        type: "paragraph",
        text: "Every folder inside app/ can contain a handful of special files. The ones you'll use most:",
      },
      {
        type: "list",
        items: [
          "page.tsx — the UI for a route segment. Required for the route to be publicly accessible.",
          "layout.tsx — shared UI that wraps child segments. Persists across navigations.",
          "loading.tsx — React Suspense fallback shown while the page streams in.",
          "error.tsx — error boundary for the segment and its children.",
          "not-found.tsx — rendered when notFound() is called.",
        ],
      },
      {
        type: "heading",
        text: "Server vs Client Components",
      },
      {
        type: "paragraph",
        text: "By default, every component in app/ is a React Server Component (RSC). RSCs run on the server, can directly await database queries and secrets, and send zero JavaScript to the browser.",
      },
      {
        type: "code",
        lang: "typescript",
        code: `// app/posts/page.tsx — a Server Component
// No "use client" → runs on server, can use async/await
import { db } from "@/lib/db"

export default async function PostsPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <ul>
      {posts.map((p) => <li key={p.id}>{p.title}</li>)}
    </ul>
  )
}`,
      },
      {
        type: "callout",
        variant: "note",
        text: 'Add "use client" only when you need browser APIs, event handlers, or React hooks like useState/useEffect. Keep client boundaries as far down the tree as possible.',
      },
      {
        type: "heading",
        text: "Nested Layouts",
      },
      {
        type: "paragraph",
        text: "Layouts wrap their children and persist across navigations within their segment. You can nest layouts to compose complex UIs without re-rendering shared chrome:",
      },
      {
        type: "code",
        lang: "bash",
        code: `app/
  layout.tsx          # Root layout — wraps everything
  dashboard/
    layout.tsx        # Dashboard sidebar + header
    page.tsx          # /dashboard
    settings/
      page.tsx        # /dashboard/settings (uses dashboard layout)`,
      },
      {
        type: "heading",
        text: "Streaming with Loading UI",
      },
      {
        type: "paragraph",
        text: "Place a loading.tsx next to your page.tsx and Next.js automatically wraps the page in a Suspense boundary. The layout renders immediately while the page's async work completes:",
      },
      {
        type: "code",
        lang: "typescript",
        code: `// app/posts/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  )
}`,
      },
      {
        type: "heading",
        text: "Data Fetching Patterns",
      },
      {
        type: "list",
        items: [
          "Fetch in Server Components — keeps secrets server-side, eliminates client waterfalls",
          "Use parallel fetching with Promise.all() for independent queries",
          "Leverage Next.js extended fetch() with { cache: 'force-cache' | 'no-store' } or { next: { revalidate: 60 } }",
          "Use React cache() to deduplicate identical requests within a render",
        ],
      },
      {
        type: "code",
        lang: "typescript",
        code: `// Parallel fetching pattern
export default async function Page({ params }: { params: { id: string } }) {
  const [post, author] = await Promise.all([
    getPost(params.id),
    getAuthor(params.id),
  ])

  return <PostView post={post} author={author} />
}`,
      },
      {
        type: "callout",
        variant: "warning",
        text: "Avoid sequential awaits for independent data. Each await in a chain blocks the next — use Promise.all() to run them concurrently.",
      },
      {
        type: "heading",
        text: "Dynamic vs Static Routes",
      },
      {
        type: "paragraph",
        text: "By default, routes are statically rendered at build time. Opt into dynamic rendering by using dynamic data sources (cookies, headers, searchParams) or exporting dynamic = 'force-dynamic'. For the best performance, prefer static and revalidate on demand with revalidatePath() or revalidateTag().",
      },
    ],
  },

  {
    slug: "grid-vs-flexbox",
    title: "CSS Grid vs Flexbox: When To Use Each",
    excerpt:
      "A practical guide to understanding the differences between CSS Grid and Flexbox, with real-world examples and use cases.",
    date: "June 18, 2024",
    readTime: "6 min read",
    tags: ["CSS", "Fundamentals", "Layout"],
    content: [
      {
        type: "paragraph",
        text: "CSS Grid and Flexbox are both powerful layout systems, and they're designed to complement each other — not compete. The confusion usually comes from trying to use one for everything. Once you understand what each is optimized for, choosing becomes natural.",
      },
      {
        type: "heading",
        text: "The Core Distinction",
      },
      {
        type: "list",
        items: [
          "Flexbox is one-dimensional — it lays items out along a single axis (row or column).",
          "Grid is two-dimensional — it controls both rows and columns simultaneously.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        text: "A simple rule: if you're thinking about items in a line, use Flexbox. If you're thinking about a grid of rows and columns, use Grid.",
      },
      {
        type: "heading",
        text: "When to Use Flexbox",
      },
      {
        type: "paragraph",
        text: "Flexbox excels at distributing space among items in a single direction and aligning them within a container. It's the right tool for:",
      },
      {
        type: "list",
        items: [
          "Navigation bars (horizontal list of links)",
          "Button groups and toolbars",
          "Centering a single element (the classic use case)",
          "Card footers that push content to opposite ends",
          "Any UI where item count is dynamic and you want items to flow naturally",
        ],
      },
      {
        type: "code",
        lang: "css",
        code: `/* Classic flex centering */
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Space-between nav */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}`,
      },
      {
        type: "heading",
        text: "When to Use Grid",
      },
      {
        type: "paragraph",
        text: "Grid is purpose-built for two-dimensional layouts — placing items in both rows and columns at once. It shines for:",
      },
      {
        type: "list",
        items: [
          "Page-level layouts (header, sidebar, main, footer)",
          "Card grids and image galleries",
          "Dashboard layouts with complex placement",
          "Any layout where you need items to align across both axes",
        ],
      },
      {
        type: "code",
        lang: "css",
        code: `/* Classic 3-column card grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Named areas for page layout */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}`,
      },
      {
        type: "heading",
        text: "They Work Together",
      },
      {
        type: "paragraph",
        text: "The most maintainable layouts use both. Use Grid for the macro layout (overall page structure) and Flexbox for the micro layout (components within those grid areas).",
      },
      {
        type: "code",
        lang: "css",
        code: `/* Grid for overall structure */
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
}

/* Flexbox inside a grid cell */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}`,
      },
      {
        type: "heading",
        text: "Quick Reference",
      },
      {
        type: "list",
        items: [
          "Nav bar → Flexbox (row, space-between)",
          "Card grid → Grid (auto-fill, minmax)",
          "Page shell → Grid (named areas or template columns)",
          "Button inside a card → Flexbox (align-items, gap)",
          "Centered modal → Grid or Flexbox (both work equally well)",
        ],
      },
    ],
  },

  {
    slug: "typescript-generics",
    title: "Mastering TypeScript Generics",
    excerpt:
      "Go beyond basic types. Learn how generics make your TypeScript code flexible, reusable, and fully type-safe.",
    date: "August 9, 2024",
    readTime: "11 min read",
    tags: ["TypeScript", "Fundamentals"],
    content: [
      {
        type: "paragraph",
        text: "Generics are the most powerful feature in TypeScript's type system, and also the most avoided. Once you get past the angle-bracket syntax anxiety, you'll find that generics let you write code that is simultaneously flexible and rigorously type-safe.",
      },
      {
        type: "heading",
        text: "The Problem Generics Solve",
      },
      {
        type: "paragraph",
        text: "Without generics, you face a false choice: use any and lose all type safety, or write duplicated functions for each type you need to support.",
      },
      {
        type: "code",
        lang: "typescript",
        code: `// ❌ Loses type information
function identity(value: any): any {
  return value
}
const result = identity(42) // result: any

// ✅ Preserves type information
function identity<T>(value: T): T {
  return value
}
const result = identity(42)        // result: number
const name   = identity("Nelson")  // name: string`,
      },
      {
        type: "heading",
        text: "Generic Functions",
      },
      {
        type: "paragraph",
        text: "The T is a type parameter — a placeholder that gets filled in by TypeScript at the call site, either inferred from the arguments or explicitly provided.",
      },
      {
        type: "code",
        lang: "typescript",
        code: `function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

const num = first([1, 2, 3])        // T inferred as number
const str = first(["a", "b", "c"]) // T inferred as string
const explicit = first<boolean>([]) // T explicitly set`,
      },
      {
        type: "heading",
        text: "Generic Constraints",
      },
      {
        type: "paragraph",
        text: "Unbounded generics accept literally any type. Constraints narrow what T can be, which lets you safely access properties or call methods on it:",
      },
      {
        type: "code",
        lang: "typescript",
        code: `// T must have a length property
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b
}

longest("hello", "hi")        // ✅ strings have .length
longest([1, 2, 3], [4, 5])    // ✅ arrays have .length
longest(10, 20)                // ❌ numbers don't have .length`,
      },
      {
        type: "heading",
        text: "Generic Interfaces and Types",
      },
      {
        type: "code",
        lang: "typescript",
        code: `// Generic API response wrapper
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// Type-safe usage
type UserResponse = ApiResponse<User>
type PostListResponse = ApiResponse<Post[]>

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const res = await fetch(\`/api/users/\${id}\`)
  return res.json()
}`,
      },
      {
        type: "heading",
        text: "The keyof Operator with Generics",
      },
      {
        type: "paragraph",
        text: "Combining generics with keyof lets you write functions that safely access object properties by key:",
      },
      {
        type: "code",
        lang: "typescript",
        code: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: "Nelson", age: 28, role: "engineer" }

const name = getProperty(user, "name") // string ✅
const age  = getProperty(user, "age")  // number ✅
const x    = getProperty(user, "foo")  // ❌ compile error — "foo" not a key`,
      },
      {
        type: "heading",
        text: "Conditional Types",
      },
      {
        type: "paragraph",
        text: "TypeScript's conditional types let you express type logic that depends on other types — essentially if/else at the type level:",
      },
      {
        type: "code",
        lang: "typescript",
        code: `type IsArray<T> = T extends any[] ? "yes" : "no"

type A = IsArray<string[]>  // "yes"
type B = IsArray<number>    // "no"

// Practical example: unwrap a Promise
type Awaited<T> = T extends Promise<infer U> ? U : T

type Result = Awaited<Promise<User>>  // User`,
      },
      {
        type: "callout",
        variant: "tip",
        text: "The infer keyword inside conditional types lets you capture and name a type that TypeScript infers in that position — incredibly powerful for utility types.",
      },
      {
        type: "heading",
        text: "Where to Go Next",
      },
      {
        type: "list",
        items: [
          "Study TypeScript's built-in utility types (Partial, Required, Pick, Omit, ReturnType, Parameters)",
          "Explore mapped types for transforming object shapes",
          "Learn template literal types for string manipulation at the type level",
          "Practice by reading the type definitions of popular libraries (React, Zod, tRPC)",
        ],
      },
    ],
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug)
}
