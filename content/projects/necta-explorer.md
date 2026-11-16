---
title: "NECTA Explorer"
description: "A high-performance asynchronous data crawler and interactive web dashboard for National Examinations Council of Tanzania (NECTA) examination results."
technologies: ["Python", "httpx", "BeautifulSoup4", "Next.js 15", "React 19", "Prisma ORM", "PostgreSQL", "TailwindCSS", "Recharts", "Docker"]
githubUrl: "https://github.com/nelsonfrank/necta-explorer"
category: "Web App"
# TODO(content): Fill in case-study metadata and TL;DR fields
role: ""
year: ""
problem: ""
result: ""
myPart: ""
relatedPosts: []
nextProject: "i8n-automation-cli"
---

### Project Overview

**NECTA Explorer** is a high-performance data engineering pipeline and visual analytics application for processing, storing, and exploring National Examinations Council of Tanzania (NECTA) exam results. It combines an asynchronous Python web crawler with a Next.js 15 web application to convert multi-tiered HTML result pages into structured database entities and responsive, data-driven analytics across 5 national exam categories (SFNA, PSLE, FTNA, CSEE, ACSEE).

---

### The Challenge

NECTA examination archives span several years and comprise thousands of nested web pages (ranging from national overview directories down to individual school examination centres and candidate grade tables). Primary hurdles included:

- **Unstructured Historical Web Data:** Legacy HTML templates with varying layouts, missing elements, and non-standard table formatting across different exam years.
- **Concurrent Ingestion & Rate Limits:** Scraping multi-tier hierarchies (years → regions/centres → candidate records) reliably at scale without overloading target endpoints or suffering network dropouts.
- **Multi-Dimensional Analytics Querying:** Aggregating large volumes of candidate-level result data into real-time regional rankings, school performance metrics, and subject grade distribution charts.

---

### Technical Architecture & Decisions

#### 1. Asynchronous Python Crawler (`crawler/`)
Built with Python 3.10+, `httpx`, and `BeautifulSoup4`, the crawler utilizes non-blocking I/O to crawl exam results concurrently across regions and examination centres. It features:
- Modular CLI control (`necta-crawler start --exam csee --year 2025`) for targeted or full-catalog syncs.
- Automatic retries, rate-limiting, and error logging to ensure full dataset completeness across all 5 exam types (SFNA, PSLE, FTNA, CSEE, ACSEE).
- Pipeline normalization that converts raw HTML string tables into clean relational records.

#### 2. Relational Data Modeling with Prisma & PostgreSQL
Extracted data is normalized and stored in a PostgreSQL instance managed via Docker Compose. The database schema links exam levels, regions, examination centres (schools), and candidate grade distributions. Using **Prisma ORM**, the web application executes type-safe, highly optimized SQL queries with indexing on school codes, region codes, and examination years.

#### 3. Modern Next.js 15 Dashboard (`web/`)
The web frontend is built using Next.js 15 (App Router) and React 19, styled with **TailwindCSS 4**. Key design & performance highlights include:
- **Interactive Visualizations:** Utilizing **Recharts** for rendering responsive grade trends, regional heatmaps, and pass-rate distributions.
- **Server Component Efficiency:** Leveraging React Server Components (RSC) to perform database aggregations server-side, reducing client JavaScript bundle size and delivery latency.

---

### Key Features

- **Comprehensive Exam Coverage:** Support for all 5 NECTA exam levels—SFNA, PSLE, FTNA, CSEE, and ACSEE.
- **Asynchronous Scraping Engine:** Fast, configurable Python crawler with CLI controls for selective targeted ingestion.
- **Multi-Level Visual Analytics:** Interactive breakdown of national pass rates, top-performing schools, district rankings, and gender performance metrics.
- **Containerized Infrastructure:** One-command database orchestration via Docker Compose.
