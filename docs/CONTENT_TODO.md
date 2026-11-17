# Content Placeholders & TODOs

This file tracks the status of content items from the `redesign/v2` implementation.

---

## Completed Items

- [x] **1. Hero & Availability (`components/hero.tsx`)**: Set `AVAILABILITY_TEXT = "Available for full-time & freelance roles"`.
- [x] **3. Project Outcomes (`lib/projects.ts`)**: Populated concise, case-study-backed `outcome` summaries for all 5 projects (`passkey-auth`, `city-connector-backend`, `necta-explorer`, `i8n-automation-cli`, `homelab`).
- [x] **4. Contact & Response SLA (`components/contact.tsx`)**: Set `CONTACT_EMAIL` default to `nelsonfrank741@gmail.com` and `RESPONSE_TIME_PLACEHOLDER` to `"24 hours"`.
- [x] **5. CV / Resume PDF (`public/cv.pdf`)**: Copied `public/resume.pdf` to `public/cv.pdf` so `/cv.pdf` resolves on both the home page and `/experience`.
- [x] **6. Case-Study Frontmatter (`content/projects/*.md`)**: Populated `role`, `year`, `problem`, `result`, and `myPart` across all 5 project case studies (`passkey-auth`, `city-connector-backend`, `necta-explorer`, `i8n-automation-cli`, `homelab`).
- [x] **7. Writing Related Project Links (`content/writing/*.md`)**: Linked `passkey-auth-as-multi-factor-auth-option.md` and `TOTP-authentication.md` to `passkey-auth`, and `typescript-generics.md` to `i8n-automation-cli`.

---

## Remaining Optional / Deferred Items

### 1. Proof Strip Custom Metrics (Currently Hidden)
- **File**: `components/proof-strip.tsx` (`PROOF_STATS`)
- **Status**: Intentionally hidden in both development and production while values contain `[N]` placeholders.
- **To Enable**: Replace the `[N]` values in `PROOF_STATS` (or set `NEXT_PUBLIC_SHOW_PROOF_STRIP="true"`):
  1. `value: "[N]+"` — `years building production systems`
  2. `value: "[N]"` — `shipped projects or users served`
  3. `value: "[N] ms"` — `headline performance metric`

### 2. Optional Live Demo URLs (`content/projects/*.md` & `lib/projects.ts`)
- **Files**: `lib/projects.ts` and `content/projects/*.md`
- **Status**: `liveUrl` is omitted or `"#"` (cleanly hidden in the UI). Add a public deployment URL to `liveUrl` on any project if a live demo is hosted.

### 3. Optional Company URLs (`content/experience/*.md`)
- **Files**: `content/experience/id8-space.md`
- **Status**: `companyUrl: "#"` renders cleanly as plain text (`nbc-bank.md`, `mwangahakika-bank.md`, `must-company.md`, and `kalen-limited.md` all have their live URLs set). Replace `"#"` on `id8-space.md` with a public URL if desired.
