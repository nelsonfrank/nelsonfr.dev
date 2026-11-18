# Content Placeholders & TODOs

All `[ADD: ...]` placeholders across the portfolio and the Profile & CV page have been resolved.

---

## Completed Items

- [x] **1. Role Team Sizes (`app/experience/ExperienceClient.tsx`)**: Set all 5 roles (`NBC Bank`, `Mwangahakika Bank`, `MUST Company`, `Kalen Limited`, `Id8 Space`) to cross-functional engineering teams of 5–10 engineers.
- [x] **2. Skill Self-Ratings & Years of Experience (`app/experience/ExperienceClient.tsx`)**: Populated verified 4/5 and 5/5 ratings and years of experience (`TypeScript 6 yrs`, `Go 2 yrs`, `Java & Spring Boot 1 yr`, `NestJS & Node.js 6 yrs`, `Python 3 yrs`, `React & Next.js 6 yrs`, `React Native 2 yrs`, `Tailwind CSS 5 yrs`, `Zustand & React Query 3 yrs`, `PostgreSQL & PostGIS 4 yrs`, `Redis & Elasticsearch 2 yrs`, `Kubernetes & Docker 3 yrs`, `AWS 3 yrs`, `Jest, Vitest & Cypress 4 yrs`).
- [x] **3. Education (`app/experience/ExperienceClient.tsx`)**: Cleanly displays `BSc in Computer Science`, `University of Dar es Salaam, Dar es Salaam`, `Nov 2017 to Oct 2020`.
- [x] **4. About Me / Outside Work (`app/experience/ExperienceClient.tsx`)**: Removed the hobby placeholder and kept the clean paragraph covering homelab, open-source developer tools, and mentoring junior developers in Dar es Salaam.
- [x] **5. Case-Study Scale Metrics (`lib/projects.ts`)**: Set `city-connector-backend` to `"Multi-agency GTFS & GTFS-RT feeds, <10ms RAPTOR routing"` and `passkey-auth` to `"WebAuthn Level 2 / FIDO2, ES256 & RS256 hardware & synced keys"`.
- [x] **6. Newsletter Panel & API (`components/newsletter-panel.tsx`, `app/api/newsletter/route.ts`)**: Enabled the newsletter signup form and wired `POST /api/newsletter` with Resend Audiences (`RESEND_API_KEY` + `RESEND_AUDIENCE_ID`) and email notification fallback.

---

## Optional Future Additions

- **Project Screenshots (`public/projects/`)**: `city-connector-backend` and `necta-explorer` use real images on disk; `passkey-auth`, `i8n-automation-cli`, and `homelab` render styled browser/phone frames with their real 3-tier architecture nodes. You can drop PNG/WebP screenshots into `public/projects/` at any time.
- **Optional Live Demo URLs (`lib/projects.ts`)**: Add a public `liveUrl` to any project when a hosted live demo is available.
- **Optional Certifications or Testimonials (`app/experience/ExperienceClient.tsx`)**: Currently omitted cleanly; can be added whenever you want to showcase a certification or client quote.
