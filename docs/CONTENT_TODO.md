# Content Placeholders & TODOs

This file tracks all explicit content placeholders (`[ADD: ...]`) and optional items across the redesigned portfolio (`redesign/new-design-system`).

---

## 1. Active `[ADD: ...]` Placeholders in the Site

1. **Newsletter Provider (`components/newsletter-panel.tsx`)**
   - **Placeholder**: `[ADD: newsletter provider]` / `[ADD: newsletter provider endpoint]`
   - **Where shown**: On `/writing` and at the bottom of every `/writing/[slug]` post. The email input and "Subscribe" button are disabled with a note directing readers to the RSS feed (`/feed.xml`) until an email newsletter provider (e.g., Buttondown, Resend Audiences, ConvertKit) is wired.
2. **Project Case-Study Quantified User / Pilot Metrics (`lib/projects.ts`)**
   - **`city-connector-backend`**: `usersOrScale: "Multi-agency GTFS & GTFS-RT feeds [ADD: pilot rider count]"`
   - **`passkey-auth`**: `usersOrScale: "WebAuthn Level 2 / FIDO2 [ADD: production user count]"`
3. **Project Screenshots (`lib/projects.ts`, `app/projects/[slug]/ProjectDetailsClient.tsx`)**
   - `city-connector-backend` (`/projects/city-connector-architecture.jpg`) and `necta-explorer` (`/projects/necta-explorer.png`) use real images on disk.
   - `passkey-auth`, `i8n-automation-cli`, and `homelab` render styled browser/phone frames with their real 3-tier architecture nodes and carry the accessible label `[ADD: real product screenshot]`. Drop screenshots at `public/projects/passkey-auth.png`, `public/projects/i8n-automation-cli.png`, and `public/projects/homelab.png` and add them to `EXISTING_IMAGES` in `components/project-card.tsx` and `app/projects/[slug]/ProjectDetailsClient.tsx`.
4. **About Page — Outside Work Personal Detail (`app/experience/ExperienceClient.tsx`)**
   - **Placeholder**: `[ADD: favorite offline hobby or sport]` in the third "Outside work" tile ("Mentoring & life").

---

## 2. Optional Enhancements

- **Live Demo URLs (`lib/projects.ts`, `content/projects/*.md`)**: Currently omitted or set to `"#"` (which cleanly hides the "Open live demo" button so only real GitHub source links appear). Set `liveUrl` to a public deployment URL on any project to show its live demo button.
- **User Quotes on Case Studies (`lib/projects.ts`)**: `userQuote` is optional and omitted unless a real quote is provided (per rule: never invent quotes or testimonials). Add `userQuote: { quote: "...", attribution: "..." }` to any project in `lib/projects.ts` to render the marigold-bordered pull quote in "The problem" section.
- **Company URL for Id8 Space (`content/experience/id8-space.md`)**: Set to `"#"` (renders as plain text while NBC Bank, Mwangahakika Bank, MUST Company, and Kalen Limited link to their live websites).
