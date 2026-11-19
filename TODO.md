# Portfolio TODO

Actionable task list for RSS, Newsletter, Content Readability Refactoring, Experience Page Footer, Mobile Navigation, and Site Performance & Testing.

---

## 1. Make RSS Work
- [x] **Create RSS Route Handler (`app/feed.xml/route.ts`)**:
  - Generate a valid RSS 2.0 XML document (`application/rss+xml; charset=utf-8`) from `getAllPosts()` in `lib/posts.ts`.
  - Include channel metadata (`title`, `link`, `description`, `language`, `lastBuildDate`, and `atom:link` self-reference).
  - Map each post to an `<item>` with `title`, `link`, `guid`, `pubDate` (RFC 822), `description` (escaped excerpt), and `<category>` tags.
- [x] **Wire Feed Discovery & Links**:
  - Ensure `alternates.types["application/rss+xml"] = "/feed.xml"` is set in `app/layout.tsx` and `app/writing/page.tsx`.
  - Verify the "Subscribe with RSS" link in `app/writing/WritingClient.tsx` and RSS references in `components/newsletter-panel.tsx` resolve cleanly to `/feed.xml`.

---

## 2. Make Newsletter Work
- [x] **Create Newsletter API Endpoint (`app/api/newsletter/route.ts`)**:
  - Accept `POST { email }` requests, validate the email address format, and forward subscriptions to the configured provider (e.g., Resend Audiences, Buttondown, or Loops via environment variables).
  - Return clear JSON status responses (`200 OK` on subscribe/already-subscribed, `400` on invalid email, `500` on upstream error).
- [x] **Enable `NewsletterPanel` (`components/newsletter-panel.tsx`)**:
  - Remove `disabled` attributes on the email `<input>` and submit `<button>`.
  - Add `idle`, `submitting`, `success`, and `error` UI states with accessible `aria-live` feedback.
  - Remove the `[ADD: newsletter provider]` and `[ADD: newsletter provider endpoint]` placeholder copy.

---

## 3. Refactor Blogpost & Project Case Study Content for Readability

### Refactoring Rules (The Standard)

1. **Rule 1 — Remove Duplicate Markdown Chrome (`content/writing/*.md`)**
   - Strip top-level `# Title` H1 headings and italic subtitle lines from the Markdown body (`app/writing/[slug]/PostClient.tsx` already renders the title, dek/excerpt, date, read time, and tags in the article header).
   - Strip manual `## Table of Contents` sections from the Markdown body (`PostClient.tsx` already renders an interactive sticky "On this page" TOC sidebar).

2. **Rule 2 — Human-First Hook & Pacing**
   - Open every blog post and case study with the concrete human/engineering problem (*what broke, why it mattered, and what changed*) before introducing RFC numbers, cryptographic primitives, or framework internals.
   - Keep paragraphs short (2–4 sentences, single idea per paragraph). Break up dense explanations with clear subheadings, bulleted takeaways, and tables where comparison helps.

3. **Rule 3 — Eliminate Redundancy Between Case Study Sections & Deep-Dive Prose (`lib/projects.ts`)**
   - **Upper structured sections** (`problem`, `myPart`, `timeline`, `decisions`, `outcomeCards`, `learned`) must be concise and scannable for a reader skimming in 60 seconds:
     - `problem`: 2–3 sentences stating the real-world pain point without repeating the tech stack list.
     - `timeline`: 1–2 crisp sentences per milestone focusing on what shipped.
     - `decisions`: State the choice in plain language (`summary`) and a 1-sentence `tradeoff` (what we gave up and why it was worth it).
   - **Lower Markdown `content` (`#deep-dive`)**: Must not re-state the project overview, tech stack table, or problem statement already shown above. Reserve `#deep-dive` strictly for system architecture, request/data flow diagrams, and key implementation details.

4. **Rule 4 — Focused Code Blocks & Readable Diagrams**
   - Trim long code blocks to the essential 10–25 lines that illustrate the core logic. Every code snippet must have a 1-sentence setup before it and a 1-sentence explanation of the key line(s) after it.
   - Keep Mermaid diagrams compact (6–8 nodes max, short labels) so they can be read at a glance without zooming.

5. **Rule 5 — Plain, First-Person Engineering Voice**
   - Write in a direct, first-person voice (*"I built..."*, *"We hit a wall when..."*, *"The tradeoff here is..."*) rather than textbook or documentation prose.
   - Define domain terms and acronyms naturally on first use.
   - Replace or resolve any remaining `[ADD: ...]` placeholders in `lib/projects.ts`.

---

### Content Refactor Checklist

#### Blog Posts (`content/writing/`)
- [x] `content/writing/TOTP-authentication.md` — Apply Rules 1, 2, 4, 5 (remove duplicate H1/TOC, tighten RFC 4226/6238 walkthrough, trim NestJS/React code blocks to core logic).
- [x] `content/writing/passkey-auth-as-multi-factor-auth-option.md` — Apply Rules 1, 2, 4, 5 (remove duplicate H1/TOC, lead with why passkeys beat SMS/TOTP, streamline WebAuthn ceremony diagrams and code).
- [x] `content/writing/typescript-generics.md` — Apply Rules 1, 2, 4, 5 (remove duplicate H1/TOC, ground examples in real production patterns, shorten code blocks).

#### Project Case Studies (`lib/projects.ts`)
- [ ] `city-connector-backend` (City Connector) — Apply Rules 2, 3, 4, 5 (de-duplicate structured fields vs. deep-dive markdown, simplify RAPTOR routing explanation for general readers).
- [ ] `passkey-auth` (Passkey Auth) — Apply Rules 2, 3, 4, 5 (remove repeated overview tables in `content`, tighten WebAuthn + TOTP narrative).
- [ ] `necta-explorer` (NECTA Result Explorer) — Apply Rules 2, 3, 4, 5 (focus story on students/parents searching exam results and how scraping/analytics were structured).
- [ ] `i8n-automation-cli` (i18n Automation CLI) — Apply Rules 2, 3, 4, 5 (clarify developer workflow problem and AST transformation pipeline without repetition).
- [ ] `homelab` (Kubernetes Homelab) — Apply Rules 2, 3, 4, 5 (streamline GitOps, FluxCD, and bare-metal networking story into a clear, readable narrative).

---

## 4. Add Footer Section on the Experience Page
- [x] **Render Full Footer on `/experience` (`app/experience/ExperienceClient.tsx`)**:
  - Add the shared `<Contact />` footer block alongside `<Footer />` at the bottom of `ExperienceClient.tsx` so `/experience` matches `/`, `/projects`, `/projects/[slug]`, `/writing`, and `/writing/[slug]`.
  - Avoid duplicate `#contact` anchor IDs between `.cv-cta` and `<Contact />` (e.g., either replace the inline `.cv-cta` contact block or use distinct IDs and ensure `@media print` hides the site-wide `<Contact />` and `<Footer />` cleanly).

---

## 5. Improve Navigation on Small Devices
- [x] **Fix Hidden Primary Links on Mobile (`components/header.tsx`, `app/globals.css`)**:
  - Removed `.hide-xs { display: none; }` so `Work`, `Writing`, `About`, `Contact`, and `Theme` all stay visible and one-tap accessible on small screens (`320px–560px`).
- [x] **Dynamic Theme Icon (`components/header.tsx`, `app/globals.css`)**:
  - Replaced text `"Theme"` button with a compact circular icon toggle that dynamically renders a Moon icon in light mode and a Sun icon in dark mode (with CSS-first rendering to prevent hydration flash).
- [x] **Check Secondary Sticky Navs on Mobile**:
  - Verified the sticky section nav on `/experience` (`.cv-menu`) and TOC on `/writing/[slug]` align cleanly below `.site-nav` on small viewports.

---

## 6. Test Heavily & Improve Site Performance
- [ ] **End-to-End & Route Verification**:
  - Verify all static & dynamic routes (`/`, `/projects`, `/projects/[slug]`, `/writing`, `/writing/[slug]`, `/experience`, `/feed.xml`, `/sitemap.xml`, `/robots.txt`) build and render with zero console or hydration errors.
  - Test interactive flows: topic/tag filtering, search input + URL query sync, Mermaid diagram rendering & zoom modal, theme toggle, newsletter signup, contact form, and CV PDF download/print layout.
- [ ] **Bundle & Client Component Optimization**:
  - Audit `"use client"` boundaries across `app/` and `components/`—keep static layout shells, headers, footers, and markdown prose server-rendered wherever possible and isolate interactive islands (search/filter bars, TOC scroll-spy, Mermaid hydration).
  - Ensure heavy client libraries (`mermaid`, `posthog-js`, syntax highlighting) are lazy-loaded only when needed and do not block First Contentful Paint (FCP) or Largest Contentful Paint (LCP).
- [ ] **Core Web Vitals & Asset Optimization**:
  - Audit images (`public/projects/*`, `public/placeholder-user.jpg`) for `next/image` sizing, `sizes` attributes, `priority` on above-the-fold hero/stage visuals, and zero Cumulative Layout Shift (CLS) during font/diagram loads.
  - Run production build (`pnpm build`) and Lighthouse / Web Vitals checks to verify bundle sizes, TTFB, LCP, INP, and CLS across desktop and mobile viewports.

