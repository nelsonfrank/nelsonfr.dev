<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js App Router portfolio. This setup includes:
1. **Client-side bootstrapping** in `instrumentation-client.ts` to capture pageviews, browser sessions, and custom user interactions.
2. **Reverse proxy routing** in `next.config.mjs` to bypass tracking/ad-blockers by routing `/ingest/*` traffic back to PostHog's APIs.
3. **Edge-compatible server event capturing** using raw HTTP `fetch` calls in Edge runtime API endpoints, allowing session correlation with standard header fields.
4. **User identification** upon successful contact form submissions.

## Event Tracking Configuration

We have instrumented the following events across client-side and server-side components:

| Event Name | Description | File Path |
| :--- | :--- | :--- |
| `contact_form_submitted` | Captures when a user successfully submits the contact form. | [components/contact.tsx](file:///home/nelson/work/personal/portfolio/nelsonfr.dev/components/contact.tsx) |
| `theme_toggled` | Captures when a user toggles between light and dark themes. | [components/theme-toggle.tsx](file:///home/nelson/work/personal/portfolio/nelsonfr.dev/components/theme-toggle.tsx) |
| `social_link_clicked` | Captures when a user clicks a social media icon in the contact section. | [components/contact.tsx](file:///home/nelson/work/personal/portfolio/nelsonfr.dev/components/contact.tsx) |
| `server_contact_form_processed` | Server-side event triggered when a contact form message is successfully sent or logged. | [app/api/contact/route.ts](file:///home/nelson/work/personal/portfolio/nelsonfr.dev/app/api/contact/route.ts) |
| `project_card_clicked` | Captures when a user clicks a project card on the portfolio homepage. | [components/projects.tsx](file:///home/nelson/work/personal/portfolio/nelsonfr.dev/components/projects.tsx) |
| `project_live_website_visited` | Captures when a user clicks 'Visit Live Website' on a project's detail page. | [app/projects/[slug]/ProjectDetailsClient.tsx](file:///home/nelson/work/personal/portfolio/nelsonfr.dev/app/projects/[slug]/ProjectDetailsClient.tsx) |
| `project_source_code_viewed` | Captures when a user clicks 'View Source Code' on a project's detail page. | [app/projects/[slug]/ProjectDetailsClient.tsx](file:///home/nelson/work/personal/portfolio/nelsonfr.dev/app/projects/[slug]/ProjectDetailsClient.tsx) |
| `next_project_clicked` | Captures when a user clicks the teaser link to go to the next project. | [app/projects/[slug]/ProjectDetailsClient.tsx](file:///home/nelson/work/personal/portfolio/nelsonfr.dev/app/projects/[slug]/ProjectDetailsClient.tsx) |

## Next steps

Since direct dashboard creation tools are not available on this runner, you can configure your PostHog Dashboard manually:
1. Log into your [PostHog Cloud Console](https://app.posthog.com).
2. Go to **Dashboards** and click **New Dashboard**. Name it `Analytics basics (wizard)`.
3. Add insights for custom events like `contact_form_submitted`, `project_card_clicked`, and `theme_toggled` to visualize user preferences and conversion rates.

## Verify before merging

- [x] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code. (Completed: build compiles successfully).
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`) you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
