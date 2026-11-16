# Project Context — `nelsonfr.dev` (Nelson Frank Portfolio)

## 1. Overview & Identity
- **Project**: Personal portfolio, engineering showcase, and technical blog for **Nelson Frank** (`https://nelsonfrank.dev`).
- **Role**: Fullstack Software Developer specializing in TypeScript, React, Next.js, Node.js/NestJS, Go, Python, PostgreSQL, and Cloud/Kubernetes infrastructure.
- **Core Goal**: Present a high-craft, animation-rich developer portfolio alongside deep-dive engineering case studies (`/projects/[slug]`) and technical articles (`/writing/[slug]`), optimized for SEO, AI crawlers (`llms.txt`), and fast static/edge delivery.

---

## 2. Tech Stack & Key Dependencies

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js `16.2.6` (App Router, React `19`, Server & Client Components, Edge API Routes) |
| **Language** | TypeScript `5.7.3` (`strict: true`, `@/*` path alias mapped to repo root) |
| **Styling & Design System** | Tailwind CSS `v4` (`@tailwindcss/postcss`, `@theme inline` in `app/globals.css`), `oklch()` color tokens, `next-themes` (dark mode default, system-aware), `shadcn/ui` (`new-york` style, Radix UI primitives, Lucide icons) |
| **Typography** | `geist` font family (`GeistSans`, `GeistMono`, `GeistPixelSquare`) |
| **Animation & Interactive UI** | GSAP `3.15` + `@gsap/react` (`ScrollTrigger`), custom hooks in `hooks/use-gsap.tsx`, custom magnetic cursor (`components/custom-cursor.tsx`), session-aware preloader (`components/preloader.tsx`) |
| **Content & Markdown Pipeline** | File-based CMS (`content/`), `gray-matter` frontmatter, `unified` + `remark-parse` + `remark-gfm` + `remark-rehype` + `rehype-slug` + `rehype-pretty-code` (`shiki` w/ `github-dark-dimmed`) + client-side `mermaid` (`11.16`) diagram rendering |
| **Contact & Security** | Edge API route (`app/api/contact/route.ts`), Cloudflare Turnstile (`components/turnstile.tsx`), Resend transactional email HTTP API |
| **Observability & Analytics** | Sentry (`@sentry/nextjs` client/server/edge + `/monitoring` tunnel), PostHog (`posthog-js` + `/ingest` reverse-proxy rewrite + Edge event capture), Vercel Analytics (`@vercel/analytics`), Google Analytics (`G-1EKCMNQFJR`) |
| **Package Manager** | `pnpm` |

---

## 3. Directory & File Architecture

```text
nelsonfr.dev/
├── app/                          # Next.js App Router pages, layouts, metadata & API
│   ├── layout.tsx                # Root layout: Geist fonts, ThemeProvider, GA, Toaster, Vercel Analytics
│   ├── page.tsx                  # Home page: Person JSON-LD, Preloader, CustomCursor, Hero, Projects, Writing, Contact
│   ├── globals.css               # Tailwind v4 setup, OKLCH light/dark CSS variables, prose/code/mermaid styling
│   ├── opengraph-image.tsx       # Dynamic root OpenGraph image generation
│   ├── sitemap.ts                # Dynamic XML sitemap (static routes + projects + writing posts)
│   ├── robots.ts                 # Dynamic robots.txt generation
│   ├── global-error.tsx          # Sentry-instrumented global error boundary
│   ├── not-found.tsx             # Custom 404 page
│   ├── api/contact/route.ts      # Edge runtime POST endpoint (Turnstile + Resend + PostHog + Sentry)
│   ├── experience/               # /experience timeline route (Server page.tsx + ExperienceClient.tsx)
│   ├── projects/                 # /projects index & /projects/[slug] case study pages
│   │   ├── page.tsx              # Projects listing server wrapper
│   │   ├── ProjectsClient.tsx    # Interactive filterable projects grid
│   │   └── [slug]/               # Dynamic SSG project detail route (page.tsx + ProjectDetailsClient.tsx)
│   └── writing/                  # /writing blog index & /writing/[slug] article pages
│       ├── page.tsx              # Blog index server component
│       ├── WritingClient.tsx     # Searchable/tag-filterable blog archive client component
│       └── [slug]/               # Dynamic article route (page.tsx, PostClient.tsx, opengraph-image.tsx)
├── components/                   # Section components & UI primitives
│   ├── header.tsx                # Top navigation bar
│   ├── hero.tsx                  # Landing hero section with GSAP animations
│   ├── projects.tsx              # Featured projects showcase on home page
│   ├── experience.tsx            # Experience timeline section component
│   ├── writing.tsx               # Recent writing/articles section on home page
│   ├── contact.tsx               # Contact form with Turnstile & PostHog event tracking
│   ├── footer.tsx                # Site footer & social links
│   ├── preloader.tsx             # Initial visit preloader (persisted via sessionStorage 'preloader-shown')
│   ├── custom-cursor.tsx         # Desktop interactive cursor follower
│   ├── smooth-scroll.tsx         # Scroll wrapper component
│   ├── turnstile.tsx             # Cloudflare Turnstile widget wrapper
│   ├── theme-provider.tsx        # next-themes wrapper
│   ├── theme-toggle.tsx          # Floating/accessible theme switcher
│   └── ui/                       # shadcn/ui + Radix primitives
├── content/                      # Markdown content collections (Git-backed CMS)
│   ├── experience/               # Work history markdown files (id8-space.md, kalen-limited.md, must-company.md)
│   ├── projects/                 # Deep-dive engineering case studies (*.md matching slugs in lib/projects.ts)
│   └── writing/                  # Technical blog posts (*.md)
├── hooks/                        # Custom React hooks
│   ├── use-gsap.tsx              # Reusable GSAP hooks (useFadeUp, useStaggerChildren, useParallax, useMagnetic, etc.)
│   ├── use-mobile.ts             # Responsive breakpoint detection hook
│   └── use-toast.ts              # Toast state hook
├── lib/                          # Server/Client data loaders, markdown pipeline & utilities
│   ├── markdown.ts               # unified/remark/rehype HTML compiler, TOC heading extractor, Mermaid block transformer
│   ├── posts.ts                  # Blog reader (getAllPosts, getPost, getAllSlugs) from content/writing/
│   ├── projects.ts               # Client-safe static project metadata array (projects: Project[])
│   ├── projects-server.ts        # Server-only project loader merging lib/projects.ts with content/projects/[slug].md
│   ├── experience.ts             # Experience loader parsing frontmatter + summary + bullet items from content/experience/
│   ├── posthog-server.ts         # Edge-compatible PostHog event capture helper (captureEdgeEvent)
│   └── utils.ts                  # Tailwind class merging utility (cn)
└── public/                       # Static assets
    ├── llms.txt                  # AI crawler & LLM context index
    ├── projects/                 # Project cover images
    └── icon*, apple-icon.png     # Favicons & manifest icons
```

---

## 4. Content Management & Data Flows

### 4.1 Projects (`lib/projects.ts` + `lib/projects-server.ts` + `content/projects/*.md`)
Projects use a **hybrid static + markdown** model so client components can import lightweight project metadata without bundling Node `fs`:
1. **`lib/projects.ts`** defines the `Project` interface and exports the canonical `projects` array (used by client grids, home page showcase, `generateStaticParams`, and `sitemap.ts`).
2. **`content/projects/<slug>.md`** stores the full engineering case study body and optional frontmatter overrides (`title`, `description`, `technologies`, `liveUrl`, `githubUrl`, `category`).
3. **`lib/projects-server.ts`** (`getProject(slug)`) runs on the server in `app/projects/[slug]/page.tsx`, merging the static entry from `lib/projects.ts` with the Markdown file in `content/projects/<slug>.md`.

**Current Featured Projects:**
- `passkey-auth`: Passkey Authentication Engine (TypeScript, NestJS, React, TypeORM, PostgreSQL, WebAuthn)
- `necta-explorer`: NECTA Explorer (Python, httpx, Next.js, TypeScript, Prisma, PostgreSQL)
- `city-connector-backend`: City Connector Backend (Go, Python, RAPTOR, GTFS, Kong Gateway, PostgreSQL, Redis, Kubernetes)
- `i8n-automation-cli`: i18n Automation CLI (TypeScript, Node.js, Babel AST, Gemini, OpenAI, react-i18next, Vitest)
- `homelab`: Homelab & Kubernetes Architecture (Kubernetes, Docker, Portainer, Kustomize, Argo CD, cert-manager)

### 4.2 Writing / Blog (`lib/posts.ts` + `content/writing/*.md`)
Blog articles are 100% file-driven from `content/writing/<slug>.md`.
- **Frontmatter Schema**:
  ```yaml
  ---
  title: "Article Title"
  excerpt: "Short summary used in cards, SEO description, and OpenGraph"
  date: "June 24, 2026"
  readTime: "6 min read"
  tags: ["WebAuthn", "Passkeys", "MFA"]
  ---
  ```
- **Rendering Flow**:
  - `app/writing/[slug]/page.tsx` calls `getPost(slug)`, compiles Markdown to HTML via `markdownToHtml(post.content)`, and extracts `h2`/`h3` headings via `extractHeadings(post.content)` for the interactive sticky Table of Contents in `PostClient.tsx`.
  - Dynamic OpenGraph images are generated per post via `app/writing/[slug]/opengraph-image.tsx`.

### 4.3 Experience (`lib/experience.ts` + `content/experience/*.md`)
Work experience entries live in `content/experience/*.md` and are sorted ascending by `order`.
- **Frontmatter Schema**:
  ```yaml
  ---
  title: "Role Title"
  company: "Company Name"
  companyUrl: "https://..."
  period: "2023 — Present"
  location: "Dar es Salaam, Tanzania"
  type: "Full-time"
  technologies: ["React", "TypeScript", "Node.js"]
  order: 1
  ---
  Paragraph summary text here.

  - First key achievement bullet
  - Second key achievement bullet
  ```
- `getAllExperiences()` splits non-bullet paragraphs into `description` and `- ` prefixed lines into `bullets: string[]`.

---

## 5. Markdown & Diagram Pipeline (`lib/markdown.ts`)

Both `/writing/[slug]` and `/projects/[slug]` render Markdown through `markdownToHtml()` in `lib/markdown.ts`:
1. **`remarkParse` + `remarkGfm`**: Parses standard Markdown + GitHub Flavored Markdown (tables, strikethrough, task lists).
2. **`remarkRehype` (`allowDangerousHtml: true`)**: Converts MDAST to HAST.
3. **`rehypeSlug`**: Injects deterministic `id` attributes into headings (used by `extractHeadings()` as well so TOC links always match).
4. **`rehypeMermaid` (Custom Plugin)**: Runs **before** `rehypePrettyCode`. Intercepts `<pre><code class="language-mermaid">` and replaces it with:
   ```html
   <div class="mermaid-block">
     <script type="application/mermaid">...raw mermaid definition...</script>
   </div>
   ```
   Using `<script type="application/mermaid">` preserves exact multi-line formatting without HTML attribute whitespace normalization, allowing client components (`PostClient.tsx` / `ProjectDetailsClient.tsx`) to initialize `mermaid` on mount.
5. **`rehypePrettyCode`**: Syntax highlights code blocks with Shiki (`github-dark-dimmed` theme), preserving empty lines for copy/paste and line highlighting.
6. **`rehypeExternalLinks` (Custom Plugin)**: Automatically adds `target="_blank" rel="noopener noreferrer"` to external `http://` and `https://` links.

---

## 6. Styling, Theme & Animation Conventions

- **Tailwind CSS v4**: Configured in `app/globals.css` via `@import 'tailwindcss';` and `@theme inline`.
- **Color Palette**: Uses perceptual `oklch()` color tokens with a teal/cyan primary accent (`hue: 180` — `--primary: oklch(0.55 0.15 180)` in light mode, `oklch(0.75 0.15 180)` in dark mode) against cool slate neutrals (`hue: 240`).
- **Preloader Optimization**: `app/layout.tsx` includes an inline `<head>` script that checks `window.sessionStorage.getItem('preloader-shown') === 'true'` before first paint and injects `.preloader { display: none !important; }` to avoid flashing the preloader on subsequent navigations within the same session.
- **GSAP Animations (`hooks/use-gsap.tsx`)**: Provides reusable scroll and pointer hooks (`useSplitText`, `useFadeUp`, `useStaggerChildren`, `useParallax`, `useMagnetic`, `useTextReveal`, `useRevealFromLeft`, `useScaleUp`, `useLineReveal`). Always clean up `ScrollTrigger` instances on unmount.

---

## 7. API, Observability & SEO

### 7.1 Contact API (`app/api/contact/route.ts`)
- **Runtime**: Edge (`export const runtime = "edge"`).
- **Flow**:
  1. Validates `name`, `email`, and `message`.
  2. Verifies Cloudflare Turnstile token against `https://challenges.cloudflare.com/turnstile/v0/siteverify` when `TURNSTILE_SECRET_KEY` is set.
  3. Sends HTML email via Resend (`https://api.resend.com/emails`) when `RESEND_API_KEY` is configured; falls back to console logging in local dev/testing mode if `RESEND_API_KEY` is omitted.
  4. Captures `server_contact_form_processed` event to PostHog via `captureEdgeEvent()` (`lib/posthog-server.ts`), correlating `X-PostHog-Distinct-ID` and `X-PostHog-Session-ID` headers sent from the client form.

### 7.2 Observability (Sentry & PostHog)
- **PostHog**: Initialized in `instrumentation-client.ts` with reverse-proxy rewrites in `next.config.mjs` (`/ingest/*` -> `https://us.i.posthog.com/*`) to bypass ad-blockers.
- **Sentry**: Configured across `instrumentation-client.ts`, `instrumentation.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`, with ad-blocker tunnel route `/monitoring` configured in `next.config.mjs`.

### 7.3 SEO & Structured Data
- **Metadata & OpenGraph**: Configured globally in `app/layout.tsx` (`metadataBase: https://nelsonfrank.dev`) and overridden per route via `generateMetadata`.
- **JSON-LD Schema**:
  - `Person` schema on `/` (`app/page.tsx`)
  - `BlogPosting` + `BreadcrumbList` schemas on `/writing/[slug]`
  - `BreadcrumbList` schema on `/projects/[slug]`
- **Crawlers**: Dynamic `/sitemap.xml` (`app/sitemap.ts`), `/robots.txt` (`app/robots.ts`), and static `/llms.txt` (`public/llms.txt`).

---

## 8. Environment Variables (`env.example`)

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Public | Base canonical URL (defaults to `https://nelsonfrank.dev`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public | Cloudflare Turnstile widget site key |
| `TURNSTILE_SECRET_KEY` | Server/Edge | Cloudflare Turnstile secret key for server verification |
| `RESEND_API_KEY` | Server/Edge | Resend API key for contact form emails (optional in local dev) |
| `FROM_EMAIL` | Server/Edge | Sender address for Resend (defaults to `contact@contact.nelsonfrank.dev`) |
| `CONTACT_EMAIL` | Server/Edge | Recipient address for contact form submissions |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | Public | PostHog project token |
| `NEXT_PUBLIC_POSTHOG_HOST` | Public | PostHog ingestion host (`https://us.i.posthog.com`) |
| `SENTRY_AUTH_TOKEN` | Build | Sentry source map upload token during production builds |

---

## 9. Common Workflows for Contributors & Agents

- **Add a new Blog Post**:
  1. Create `content/writing/<slug>.md` with `title`, `excerpt`, `date`, `readTime`, and `tags` frontmatter.
  2. Update `public/llms.txt` if highlighting the article for AI crawlers (`sitemap.xml` updates automatically).
- **Add a new Project**:
  1. Add the project metadata entry to `projects` in `lib/projects.ts` and place its cover image in `public/projects/<slug>.png`.
  2. Create `content/projects/<slug>.md` for the detailed engineering case study.
  3. Optionally list it in `public/llms.txt`.
- **Add a Work Experience Entry**:
  1. Create `content/experience/<slug>.md` with `order`, `title`, `company`, `companyUrl`, `period`, `location`, `type`, and `technologies` frontmatter, followed by a summary paragraph and `- ` bullet points.
- **Development Commands**:
  - `pnpm dev` — Start local development server on `http://localhost:3000`
  - `pnpm build` — Build production bundle
  - `pnpm start` — Start production server
  - `pnpm lint` — Run ESLint

