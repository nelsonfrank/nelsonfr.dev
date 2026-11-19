---
title: "NECTA Explorer"
description: "Async Python crawler and Next.js analytics dashboard turning Tanzania's static NECTA exam result archives into searchable school and regional insights."
technologies: ["Python", "httpx", "BeautifulSoup4", "Next.js 15", "React 19", "Prisma ORM", "PostgreSQL", "TailwindCSS", "Recharts", "Docker"]
githubUrl: "https://github.com/nelsonfrank/necta-explorer"
category: "Web App"
role: "Fullstack & Data Engineer"
year: "2025"
problem: "Every year, students, parents, and educators in Tanzania sift through thousands of static HTML pages published by NECTA (National Examinations Council of Tanzania) just to look up a school's results. Comparing how a school or region performed across years is nearly impossible because the markup changes subtly from year to year and has no search or analytics layer."
result: "Built an async Python ingestion CLI and a Next.js + PostgreSQL dashboard that unifies all 5 national exam levels (SFNA, PSLE, FTNA, CSEE, ACSEE) into fast regional and school-level comparisons."
myPart: "I built the entire pipeline—the concurrent Python httpx/BeautifulSoup crawler CLI, the normalized PostgreSQL/Prisma schema, and the Next.js Server Component analytics dashboard."
relatedPosts: []
nextProject: "i8n-automation-cli"
---

### Data Ingestion & Serving Pipeline

I decoupled data collection from the web app so I could re-crawl a single exam year or patch a legacy HTML parser without ever touching or taking down the dashboard.

```mermaid
flowchart LR
  NECTA["NECTA HTML Archives"] --> CLI["Python httpx Crawler"]
  CLI --> Parse["BeautifulSoup4 Normalizer"]
  Parse --> PG[("PostgreSQL + Prisma")]
  PG --> RSC["Next.js 15 Server Components"]
  RSC --> Charts["Recharts Dashboard"]
```

---

### Crawling Inconsistent Government HTML Without Headless Browsers

NECTA's result pages are plain static HTML—no client-side JavaScript rendering required—so spinning up Playwright or Puppeteer would have wasted memory and CPU. Instead, I built a Python CLI (`crawler/`) using async `httpx` and `BeautifulSoup4` that walks the three-tier hierarchy (`exam year → regions/centres → candidate grade tables`) concurrently with rate-limit backoffs and automatic retries:

```bash
necta-crawler start --exam csee --year 2025
```

Targeted flags let me ingest or re-sync a single exam level (`SFNA`, `PSLE`, `FTNA`, `CSEE`, or `ACSEE`) and year on demand. Because historical templates drift—columns shift, headers change capitalization, or summary tables are missing—every parser normalizes rows defensively and writes via idempotent upserts so re-running a failed crawl never creates duplicate candidate records.

---

### Schema Indexing & Zero-Waterfall Analytics

Storing raw JSON blobs per school would have made multi-year regional rankings painfully slow. I modeled exam levels, regions, school centres, and candidate grade distributions as normalized PostgreSQL tables managed with Prisma ORM, adding composite indexes on `(examLevel, year, regionCode)` and `(schoolCode, year)`.

On the frontend (`web/`), Next.js 15 React Server Components execute those ranking and pass-rate aggregations directly against PostgreSQL on the server before streaming HTML to the browser. Only the interactive Recharts visualizations hydrate on the client, which keeps JavaScript bundles small and page loads snappy on mobile connections across Tanzania.
