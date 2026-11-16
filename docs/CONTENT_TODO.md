# Content Placeholders & TODOs

This file tracks every unverified fact, metric, email, asset, and case-study placeholder introduced during the `redesign/v2` implementation. No metrics, dates, or claims were fabricated; replace these placeholders with real verified values when ready.

---

## 1. Hero & Availability
- **File**: `components/hero.tsx` (`AVAILABILITY_TEXT`)
- **Placeholder**: `"Available for [freelance / full-time]"`
- **Action**: Update to your current availability (e.g., `"Available for full-time & select consulting"`) or set `AVAILABILITY_TEXT = ""` to hide the eyebrow.

---

## 2. Proof Strip Metrics
- **File**: `components/proof-strip.tsx` (`PROOF_STATS`)
- **Note**: Automatically hidden in production builds while all `value` strings contain `[N]`.
- **Placeholders**:
  1. `value: "[N]+"` — `years building production systems`
  2. `value: "[N]"` — `shipped projects or users served`
  3. `value: "[N] ms"` — `headline performance metric`

---

## 3. Project Outcomes (`lib/projects.ts`)
- **File**: `lib/projects.ts`
- **Placeholders**:
  - `passkey-auth`: `outcome: "[OUTCOME]"`
  - `city-connector-backend`: `outcome: "[OUTCOME]"`
  - `necta-explorer`: `outcome: "[OUTCOME]"`
  - `i8n-automation-cli`: `outcome: "[OUTCOME]"`
  - `homelab`: `outcome: "[OUTCOME]"`
- **Action**: Replace `[OUTCOME]` with a one-sentence verified outcome or metric for each project.

---

## 4. Contact & Response SLA (`components/contact.tsx`)
- **File**: `components/contact.tsx`
- **Placeholders**:
  - `CONTACT_EMAIL`: defaults to `process.env.NEXT_PUBLIC_CONTACT_EMAIL || "[YOUR EMAIL]"`
  - `RESPONSE_TIME_PLACEHOLDER`: `"[RESPONSE TIME]"` (rendered in `"I reply within [RESPONSE TIME]."` )
- **Action**: Set `NEXT_PUBLIC_CONTACT_EMAIL` in your environment (or replace `"[YOUR EMAIL]"` directly) and replace `"[RESPONSE TIME]"` with your actual response window (e.g., `"24 hours"`).

---

## 5. CV / Resume PDF (`public/cv.pdf`)
- **Files**:
  - `components/experience.tsx` (`href="/cv.pdf"`)
  - `app/experience/ExperienceClient.tsx` (`href="/cv.pdf"`)
- **Action**: Place your real PDF resume at `public/cv.pdf`.

---

## 6. Case-Study Frontmatter (`content/projects/*.md`)
The scannable case-study template in `app/projects/[slug]/ProjectDetailsClient.tsx` supports optional frontmatter fields (`role`, `year`, `problem`, `result`, `myPart`, `decisions`, `results`, `relatedPosts`, `nextProject`). Missing or empty fields are omitted cleanly in the UI.
- **Files with empty placeholder fields (`# TODO(content)`)**:
  - `content/projects/passkey-auth.md` (`role`, `year`, `problem`, `result`, `myPart`; `liveUrl` is currently `"#"`)
  - `content/projects/city-connector-backend.md` (`role`, `year`, `problem`, `result`, `myPart`, `relatedPosts`)
  - `content/projects/necta-explorer.md` (`role`, `year`, `problem`, `result`, `myPart`, `relatedPosts`)
  - `content/projects/i8n-automation-cli.md` (`role`, `year`, `problem`, `result`, `myPart`)
  - `content/projects/homelab.md` (`role`, `year`, `problem`, `result`, `myPart`, `relatedPosts`)

---

## 7. Writing Related Project Links (`content/writing/*.md`)
- **Files**:
  - `content/writing/TOTP-authentication.md` (`project: ""` — optionally set to `"passkey-auth"` or another project slug)
  - `content/writing/typescript-generics.md` (`project: ""` — optionally set to `"i8n-automation-cli"` or another project slug)

---

## 8. Experience Company URLs (`content/experience/*.md`)
- **File**: `content/experience/id8-space.md` (`companyUrl: "#"`)
- **Action**: Replace `"#"` with the company URL if public, or leave as `"#"` (rendered as plain text instead of a link).
