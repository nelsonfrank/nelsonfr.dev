# Project Context — `nelsonfr.dev` (Nelson Frank Portfolio)

## 1. Overview & Identity
- **Project**: Personal portfolio, engineering case-study showcase, and technical blog for **Nelson Frank** (`https://nelsonfrank.dev`).
- **Role**: Fullstack engineer building secure auth, transit backends, and cloud infrastructure (TypeScript, Go, Python, PostgreSQL, Redis, Kubernetes).
- **Design Style**: Technical editorial minimalism — typography-led, evidence-first, high contrast in both dark (default) and light themes, zero decorative imagery or heavy JS animation libraries.

---

## 2. Tech Stack & Key Dependencies

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js `16.4.6` (App Router, React `19.0.6`, Server & Client Components, Edge API Routes, `sharp@0.35.5`) |
| **Language** | TypeScript `5.7.3` (`strict: true`, `@/*` path alias mapped to repo root) |
| **Styling & Design System** | Tailwind CSS `v4` (`@tailwindcss/postcss`, `@theme inline` in `app/globals.css`), `oklch()` color tokens, `next-themes` (dark mode default, system-aware), `shadcn/ui` primitives, Lucide icons |
| **Typography** | `geist` font family (`GeistSans`, `GeistMono`) |
| **Motion** | Pure CSS transitions and keyframe fade-in (`prefers-reduced-motion` respected; Preloader, CustomCursor, SmoothScroll, and GSAP removed) |
| **Content & Markdown Pipeline** | File-based CMS (`content/`), `gray-matter` frontmatter, `unified` + `remark-parse` + `remark-gfm` + `remark-rehype` + `rehype-slug` + `rehype-pretty-code` (`shiki` w/ `github-dark-dimmed`) + dynamic `mermaid` (`11.16`) diagram rendering on pages with `.mermaid-block` |
| **Contact & Security** | Edge API route (`app/api/contact/route.ts`), lazy-loaded Cloudflare Turnstile (`components/turnstile.tsx`), Resend transactional email HTTP API |
| **Observability & Analytics** | Sentry (`@sentry/nextjs` client/server/edge + `/monitoring` tunnel, Replay lazy-loaded after idle/interaction), PostHog (`posthog-js` lazy-loaded via `lib/analytics.ts` + `/ingest` reverse-proxy rewrite + Edge event capture), Vercel Analytics (`@vercel/analytics`) |
| **Package Manager** | `pnpm` |

---

## 3. Directory & File Architecture

```text
nelsonfr.dev/
├── app/                          # Next.js App Router pages, layouts, metadata & API
│   ├── layout.tsx                # Root layout: GeistSans & GeistMono fonts, ThemeProvider, Toaster, Vercel Analytics, RSS alternate link
│   ├── page.tsx                  # Home page: Person JSON-LD, Header, Hero, ProofStrip, Projects, Writing, Experience, Contact, Footer
│   ├── globals.css               # Tailwind v4 setup, OKLCH dark/light CSS variables, type scale, prose/code/mermaid styling
│   ├── opengraph-image.tsx       # Dynamic root OpenGraph image generation
│   ├── feed.xml/route.ts         # Dynamic RSS 2.0 feed generated from getAllPosts()
│   ├── sitemap.ts                # Dynamic XML sitemap (static routes + projects + writing posts)
│   ├── robots.ts                 # Dynamic robots.txt generation
│   ├── global-error.tsx          # Sentry-instrumented global error boundary
│   ├── not-found.tsx             # Custom 404 page
│   ├── api/contact/route.ts      # Edge runtime POST endpoint (Turnstile + Resend + PostHog + Sentry)
│   ├── experience/               # /experience timeline route (Server page.tsx + ExperienceClient.tsx)
│   ├── projects/                 # /projects index & /projects/[slug] case study pages
│   │   ├── page.tsx              # Projects listing server wrapper
│   │   ├── ProjectsClient.tsx    # Filterable projects grid
│   │   └── [slug]/               # Dynamic SSG case-study route (page.tsx + ProjectDetailsClient.tsx)
│   └── writing/                  # /writing blog index & /writing/[slug] article pages
│       ├── page.tsx              # Blog index server component
│       ├── WritingClient.tsx     # Searchable/tag-filterable blog archive client component
│       └── [slug]/               # Dynamic article route (page.tsx, PostClient.tsx, opengraph-image.tsx)
├── components/                   # Section components & UI primitives
│   ├── header.tsx                # Top navigation bar (Work · Writing · About · Contact + ThemeToggle + skip link)
│   ├── hero.tsx                  # Landing hero section with availability eyebrow, H1, subtext & 2 PostHog-tracked CTAs
│   ├── proof-strip.tsx           # 3-stat strip (auto-hidden in production while values are [N] placeholders)
│   ├── arch-diagram.tsx          # Server-safe inline 3-node SVG architecture diagram component
│   ├── projects.tsx              # Selected work (3 cards max with ArchDiagram, category, title, description, outcome, stack)
│   ├── writing.tsx               # Latest 3 writing rows (date | title | first tag) with hairline dividers
│   ├── experience.tsx            # Compact experience rows from getAllExperiences() + CV download link
│   ├── contact.tsx               # Bordered contact panel (mailto, GitHub, LinkedIn + "Prefer a form?" disclosure)
│   ├── contact-form.tsx          # Dynamically imported form with Turnstile & PostHog tracking
│   ├── footer.tsx                # Single-line site footer with copyright & social links
│   ├── turnstile.tsx             # Cloudflare Turnstile widget (loads script on viewport intersection or form focus)
│   ├── theme-provider.tsx        # next-themes wrapper
│   ├── theme-toggle.tsx          # Accessible 44x44px header theme switcher
│   └── ui/                       # shadcn/ui + Radix primitives
├── content/                      # Markdown content collections (Git-backed CMS)
│   ├── experience/               # Work history markdown files (id8-space.md, kalen-limited.md, must-company.md)
│   ├── projects/                 # Deep-dive engineering case studies (*.md matching slugs in lib/projects.ts)
│   └── writing/                  # Technical blog posts (*.md)
├── docs/
│   └── CONTENT_TODO.md           # Inventory of content placeholders ([OUTCOME], [YOUR EMAIL], [N]+, TL;DR fields, CV)
├── lib/                          # Server/Client data loaders, markdown pipeline & utilities
│   ├── analytics.ts              # Lazy/idle-safe PostHog client event capture helpers
│   ├── markdown.ts               # unified/remark/rehype HTML compiler, heading hierarchy normalizer, TOC extractor, Mermaid transformer
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
Projects use a **hybrid static + markdown** model:
1. **`lib/projects.ts`** defines the `Project` interface and exports `projects` and `SELECTED_WORK_SLUGS` (`passkey-auth`, `city-connector-backend`, `necta-explorer`).
2. **`content/projects/<slug>.md`** stores the full engineering case study body and optional frontmatter overrides/extensions:
   - `title`, `description`, `technologies`, `liveUrl`, `githubUrl`, `category`, `outcome`
   - `diagram`: `{ nodes: [string, string, string] }`
   - `role`, `year` (Metadata strip)
   - `problem`, `result`, `myPart` (TL;DR panel)
   - `decisions`: `[{ decision, tradeoff }]`, `results`: `[string]`
   - `relatedPosts`: `[slug]`, `nextProject`: `slug`
3. **`lib/projects-server.ts`** (`getProject(slug)`) merges the static entry with the Markdown frontmatter and content, omitting empty strings so missing optional fields degrade cleanly in `ProjectDetailsClient.tsx`.

### 4.2 Writing / Blog (`lib/posts.ts` + `content/writing/*.md`)
Blog articles are file-driven from `content/writing/<slug>.md`.
- **Frontmatter Schema**:
  ```yaml
  ---
  title: "Article Title"
  excerpt: "Short summary used in rows, RSS, SEO description, and OpenGraph"
  date: "June 24, 2026"
  readTime: "6 min read"
  tags: ["WebAuthn", "Passkeys", "MFA"]
  project: "passkey-auth" # optional related project slug
  ---
  ```
- **Rendering & Discovery**:
  - `app/writing/[slug]/page.tsx` compiles Markdown via `markdownToHtml()`, extracts headings via `extractHeadings()`, resolves the optional `relatedProject` (`post.project`), and computes two `relatedPosts` ranked by shared tags.
  - `app/feed.xml/route.ts` serves an RSS 2.0 XML feed at `/feed.xml` linked via `<link rel="alternate" type="application/rss+xml">`.

### 4.3 Experience (`lib/experience.ts` + `content/experience/*.md`)
Work experience entries live in `content/experience/*.md` and are sorted ascending by `order`. On the home page (`components/experience.tsx`), each entry renders as a compact row showing `period`, bold `title`, `company`, and a single summary line (`bullets[0] || description`).

---

## 5. Theme Tokens & Typography (`app/globals.css`)

| Token | Dark (`.dark`, default) | Light (`:root`) |
| :--- | :--- | :--- |
| `--background` | `#0b0f14` (`oklch(0.167 0.012 254.2)`) | `#fafaf7` (`oklch(0.984 0.004 106.5)`) |
| `--card` | `#0f151c` (`oklch(0.193 0.017 252.6)`) | `#ffffff` (`oklch(1 0 0)`) |
| `--foreground` | `#e6edf3` (`oklch(0.943 0.011 243.7)`) | `#11181c` (`oklch(0.204 0.013 233.3)`) |
| `--muted-foreground` | `#9aa7b4` (`oklch(0.722 0.024 248.2)`) | `#4a5560` (`oklch(0.444 0.023 248.3)`) |
| `--primary` | `#3ddbc8` (`oklch(0.807 0.130 183.1)`) | `#0b7a6e` (`oklch(0.521 0.091 182.8)`) |
| `--primary-foreground` | `#06201c` (`oklch(0.222 0.033 181.5)`) | `#ffffff` (`oklch(1 0 0)`) |
| `--border` | `#1f2933` (`oklch(0.276 0.023 248.7)`) | `#e2e2dc` (`oklch(0.911 0.008 106.6)`) |
| `--border-strong` | `#2b3744` (`oklch(0.332 0.028 250.7)`) | `#c9c9c2` (`oklch(0.834 0.010 106.6)`) |

- **Type Scale**: H1 `60px` desktop / `36px` mobile (`font-weight: 700`, `line-height: 1.08`, `letter-spacing: -0.03em`); H2 `28px` (`font-weight: 600`); Body `17–18px` (`line-height: 1.6`); Metadata in `GeistMono` `12–13px` muted; Eyebrow in `GeistMono` `13px` uppercase accent (`letter-spacing: 0.05em`).
- **Layout Containers**: `.page-container` max-width `1080px` (`67.5rem`) with `32px` desktop / `20px` mobile horizontal padding; reading column max-width `720px` (`45rem`).
