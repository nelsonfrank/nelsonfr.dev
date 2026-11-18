# Content Placeholders & TODOs

This file tracks all explicit content placeholders (`[ADD: ...]`) and optional items across the redesigned portfolio and the Profile & CV page (`redesign/about-cv-page`).

---

## 1. Profile & CV Page Placeholders (`app/experience/ExperienceClient.tsx`)

1. **Team Sizes per Role (`ROLE_TEAM_SIZE`)**:
   - `nbc-bank`: `"Contract backend engineer [ADD: team size]"`
   - `mwangahakika-bank`: `"Independent freelance engineer [ADD: team size]"`
   - `must-company`: `"Frontend engineer across 5 client projects [ADD: team size]"`
   - `kalen-limited`: `"Full-stack engineering team [ADD: team size]"`
   - `id8-space`: `"Full-stack engineer, mentored 3 junior developers [ADD: team size]"`
2. **Skill Self-Rating Levels (`1–5`) & Exact Years of Use (`SKILL_GROUPS`)**:
   - Section lead: `[ADD: confirm skill levels and exact years]`
   - Individual rows include `[ADD: exact yrs]` (where minimum duration was inferred from employment dates) or `[ADD: years]` (for Go, Java & Spring Boot, Python, React Native, Zustand & React Query, Redis & Elasticsearch, Kubernetes & Docker, Jest/Vitest/Cypress).
3. **Education Final Project / Honours (`#education`)**:
   - `[ADD: final project or honours if applicable]` under BSc in Computer Science, University of Dar es Salaam (`Nov 2017 to Oct 2020`).
4. **Outside Work Hobby (`#about`)**:
   - `[ADD: favorite offline hobby or sport]` in the second paragraph of "About me".
5. **Omitted Optional Sections (No Data in Repo — Omitted per Rule 2 & Rule 3)**:
   - **Certifications (`#certs`)**: Omitted because no certifications exist in the repo or `cv.pdf`. Provide certification titles, issuers, years, and credential verification URLs to enable.
   - **Kind words / Testimonials (`#kind`)**: Omitted because no real client or colleague quote with name, role, company, and permission exists in the repo (per non-negotiable rule: never invent a testimonial under any circumstances).
   - **Talks**: The `#more` ("Talks and open source") section currently lists your 5 real open-source projects linked to their case studies and GitHub repositories. Add any conference/meetup talks or university workshops if applicable.

---

## 2. Other Site-Wide Placeholders

1. **Newsletter Provider (`components/newsletter-panel.tsx`)**:
   - `[ADD: newsletter provider]` / `[ADD: newsletter provider endpoint]` on `/writing` and `/writing/[slug]`.
2. **Case-Study Quantified User / Pilot Metrics (`lib/projects.ts`)**:
   - `city-connector-backend`: `usersOrScale: "Multi-agency GTFS & GTFS-RT feeds [ADD: pilot rider count]"`
   - `passkey-auth`: `usersOrScale: "WebAuthn Level 2 / FIDO2 [ADD: production user count]"`
3. **Project Screenshots (`lib/projects.ts`, `app/projects/[slug]/ProjectDetailsClient.tsx`)**:
   - `[ADD: real product screenshot]` for `passkey-auth`, `i8n-automation-cli`, and `homelab` (`city-connector-backend` and `necta-explorer` use real images on disk).
