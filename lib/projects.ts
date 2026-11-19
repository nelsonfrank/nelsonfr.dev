export interface ProjectDecision {
  decision: string
  tradeoff: string
  summary?: string
}

export interface ProjectLink {
  label: string
  url: string
}

export interface ProjectTimelineStep {
  title: string
  period: string
  detail: string
}

export interface ProjectScreen {
  caption: string
  type: "browser" | "phone"
}

export interface ProjectOutcomeCard {
  metric: string
  detail: string
}

export type ProjectTint = "teal" | "warm" | "indigo"
export type ProjectFrameType = "browser" | "phone"

export interface Project {
  slug: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  githubLinks?: ProjectLink[]
  featured: boolean
  category?: string
  categories: string[]
  statusBadge: string
  tint: ProjectTint
  frameType: ProjectFrameType
  resultHeadline: {
    prefix?: string
    highlight: string
    suffix?: string
  }
  outcome?: string
  architectureImage?: string
  diagram?: {
    nodes: [string, string, string]
  }
  role?: string
  year?: string
  duration?: string
  usersOrScale?: string
  problem?: string
  userQuote?: {
    quote: string
    attribution: string
  }
  result?: string
  myPart?: string
  timeline?: ProjectTimelineStep[]
  decisions?: ProjectDecision[]
  screens?: ProjectScreen[]
  outcomeCards?: ProjectOutcomeCard[]
  learned?: {
    summary: string
    bullets: string[]
  }
  results?: string[]
  relatedPosts?: string[]
  nextProject?: string
  content?: string
}

export const SELECTED_WORK_SLUGS = [
  "city-connector-backend",
  "passkey-auth",
  "necta-explorer",
] as const

export const projects: Project[] = [
  {
    slug: "city-connector-backend",
    title: "City Connector",
    description:
      "Full-stack multi-agency transit platform pairing an offline-first React Native (Expo) mobile app with Go RAPTOR routing microservices, GTFS/GTFS-RT ingestion, and Kong API gateway.",
    outcome:
      "Computes Pareto-optimal multimodal transit routes in milliseconds via Go RAPTOR and Redis, rendered on an offline-first React Native MapLibre client.",
    resultHeadline: {
      prefix: "Multimodal transit routes computed in ",
      highlight: "single-digit ms",
    },
    statusBadge: "Open source",
    tint: "teal",
    frameType: "browser",
    categories: ["Mobile", "Backend", "Open source"],
    architectureImage: "/projects/city-connector-architecture.jpg",
    diagram: {
      nodes: ["RN Mobile", "Go RAPTOR", "Redis/GTFS"],
    },
    image: "/projects/city-connector-architecture.jpg",
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Go",
      "Python",
      "RAPTOR",
      "GTFS",
      "Kong Gateway",
      "PostgreSQL",
      "Redis",
      "Kubernetes",
    ],
    githubUrl: "https://github.com/nelsonfrank/city-connector-backend",
    githubLinks: [
      {
        label: "Backend source",
        url: "https://github.com/nelsonfrank/city-connector-backend",
      },
      {
        label: "Mobile source",
        url: "https://github.com/nelsonfrank/city-connector-mobile",
      },
    ],
    featured: true,
    category: "Distributed Systems",
    role: "Fullstack, Mobile & Infrastructure Engineer",
    year: "2026",
    duration: "2026",
    usersOrScale: "Multi-agency GTFS & GTFS-RT feeds, <10ms RAPTOR routing",
    timeline: [
      {
        title: "Modeled multi-agency GTFS & PostGIS schemas",
        period: "Phase 1",
        detail:
          "Built Python 3.12 ingestion workers to normalize static GTFS timetables into PostgreSQL/PostGIS with agency-prefixed IDs ({agency_code}:{entity_id}).",
      },
      {
        title: "Engineered the Go RAPTOR routing service",
        period: "Phase 2",
        detail:
          "Implemented Round-Based Public Transit Routing over contiguous stop-route arrays in memory, avoiding priority-queue graph overhead.",
      },
      {
        title: "Added Redis 7 GTFS-RT telemetry & stale eviction",
        period: "Phase 3",
        detail:
          "Created per-agency Go pollers for live vehicle positions and trip delays with 30-second stale GPS eviction to prevent ghost buses.",
      },
      {
        title: "Shipped the offline-first Expo & MapLibre mobile app",
        period: "Phase 4",
        detail:
          "Paired React Native 0.88 and MapLibre vector maps with synchronous MMKV offline cache hydration, Zod v4 boundary checks, and English/Swahili localization.",
      },
    ],
    decisions: [
      {
        decision: "In-memory RAPTOR instead of Dijkstra graph search",
        summary:
          "Operates in transfer rounds directly over contiguous stop-route arrays in memory.",
        tradeoff:
          "Requires atomic timetable load-and-swap reloads on static GTFS updates, but keeps multi-criteria itinerary queries in single-digit milliseconds.",
      },
      {
        decision: "Synchronous MMKV offline cache on mobile",
        summary:
          "Persists TanStack Query server state and recent journeys locally on the device.",
        tradeoff:
          "Requires explicit cache invalidation on schema upgrades, while letting commuters check schedules underground with zero network signal.",
      },
      {
        decision: "Per-agency feed isolation & 30s GPS eviction",
        summary:
          "Never merges agency IDs and drops vehicle snapshots older than 30 seconds.",
        tradeoff:
          "Shows a degraded feed banner for offline operators instead of extrapolated positions, eliminating ghost vehicles on the rider map.",
      },
    ],
    screens: [
      {
        caption: "Pareto-optimal journey planner (Fastest, Fewest transfers, Least walking)",
        type: "phone",
      },
      {
        caption: "MapLibre live vehicle telemetry with 30-second stale eviction",
        type: "phone",
      },
      {
        caption: "Go RAPTOR, PostGIS search, and Kong API Gateway architecture",
        type: "browser",
      },
    ],
    outcomeCards: [
      {
        metric: "< 10 ms",
        detail:
          "Pareto-optimal multi-transfer journey computation in memory via Go RAPTOR.",
      },
      {
        metric: "30s TTL",
        detail:
          "Real-time GTFS-RT vehicle eviction threshold preventing stale ghost buses on mobile maps.",
      },
      {
        metric: "100% Zod v4",
        detail:
          "Gateway payload schema validation paired with synchronous MMKV offline schedule access.",
      },
    ],
    learned: {
      summary:
        "Decoupling static timetable snapshots from real-time Redis delay overlays kept routing predictable even when individual transit operator feeds dropped out.",
      bullets: [
        "Contiguous array traversal in RAPTOR outperforms pointer-heavy graph structures for public transit timetables.",
        "Evicting stale telemetry early builds more rider trust than displaying outdated vehicle markers.",
        "Proactive client-side token-bucket rate limiters protect gateway quotas before requests leave the phone.",
      ],
    },
  },
  {
    slug: "passkey-auth",
    title: "Passkey Authentication Engine",
    description:
      "A production-ready, biometric-driven authentication system designed to replace legacy password and OTP systems.",
    outcome:
      "Eliminates credential phishing and replay attacks via origin-bound WebAuthn assertions and signature counter checks.",
    resultHeadline: {
      prefix: "Passwordless sign-in with ",
      highlight: "zero phishing surface",
    },
    statusBadge: "Open source",
    tint: "warm",
    frameType: "browser",
    categories: ["Web", "Backend", "Open source"],
    diagram: {
      nodes: ["Browser", "NestJS API", "Postgres"],
    },
    image: "/projects/passkey-auth.png",
    technologies: ["TypeScript", "NestJS", "React", "TypeORM", "PostgreSQL", "WebAuthn"],
    liveUrl: "#",
    githubUrl: "https://github.com/nelsonfrank/passkey-auth-demo",
    featured: true,
    category: "Web App",
    role: "Lead Engineer",
    year: "2026",
    duration: "2026",
    usersOrScale: "WebAuthn Level 2 / FIDO2, ES256 & RS256 hardware & synced keys",
    timeline: [
      {
        title: "Designed credential & challenge schemas in PostgreSQL",
        period: "Step 1",
        detail:
          "Modeled one-to-many passkey credentials with timezone-aware timestamptz challenge expiration and signature counter columns in TypeORM.",
      },
      {
        title: "Built NestJS attestation & assertion verification",
        period: "Step 2",
        detail:
          "Integrated @simplewebauthn/server v13.3.0 with strict Relying Party ID (rpID) and origin validation plus 5-minute challenge TTLs.",
      },
      {
        title: "Implemented React browser authenticator flows",
        period: "Step 3",
        detail:
          "Connected @simplewebauthn/browser for TouchID, FaceID, Windows Hello, and hardware security key registration and user-nameless login.",
      },
    ],
    decisions: [
      {
        decision: "Origin-bound WebAuthn over SMS/TOTP codes",
        summary:
          "Binds asymmetric key pairs directly to the relying party domain in hardware.",
        tradeoff:
          "Requires HTTPS secure contexts and strict rpID domain configuration, but makes reverse-proxy phishing kits ineffective.",
      },
      {
        decision: "isoBase64URL public-key serialization",
        summary:
          "Stores WebAuthn public keys as URL-safe Base64 strings in PostgreSQL.",
        tradeoff:
          "Adds a lightweight buffer decode step at login while keeping credential rows compact and human-inspectable.",
      },
      {
        decision: "Dedicated global challenges table with 5-minute TTL",
        summary:
          "Tracks active challenges independently of user rows to support user-nameless sign-in.",
        tradeoff:
          "Requires explicit challenge cleanup on verification or expiry, enabling single-gesture conditional UI logins.",
      },
    ],
    screens: [
      {
        caption: "Biometric passkey registration with duplicate-device exclusion",
        type: "browser",
      },
      {
        caption: "Single-gesture WebAuthn assertion and signature counter check",
        type: "phone",
      },
      {
        caption: "Fallback state handling for non-secure or unsupported contexts",
        type: "browser",
      },
    ],
    outcomeCards: [
      {
        metric: "0 shared secrets",
        detail:
          "Private keys stay inside device secure enclaves; only public keys are stored in PostgreSQL.",
      },
      {
        metric: "5-min TTL",
        detail:
          "Cryptographic challenges expire automatically and are deleted immediately upon verification.",
      },
      {
        metric: "ES256 & RS256",
        detail:
          "Hardware and platform authenticator support with cloned-token counter verification.",
      },
    ],
    learned: {
      summary:
        "Handling synced passkeys (such as iCloud Keychain) alongside hardware security keys required careful attention to signature counter semantics and PostgreSQL timestamptz columns.",
      bullets: [
        "Always use timestamptz in PostgreSQL so server timezone offsets never prematurely expire WebAuthn challenges.",
        "Synced cloud passkeys may return non-incrementing counters across devices, whereas hardware tokens increment strictly.",
        "Excluding existing credential IDs during registration prevents users from enrolling the same device twice.",
      ],
    },
  },
  {
    slug: "necta-explorer",
    title: "NECTA Explorer",
    description:
      "A high-performance asynchronous data crawler and interactive web dashboard for Tanzania NECTA examination results.",
    outcome:
      "Normalizes multi-year national exam archives across all 5 NECTA levels into indexed PostgreSQL analytics.",
    resultHeadline: {
      prefix: "Normalized ",
      highlight: "5 national exam levels",
      suffix: " into live analytics",
    },
    statusBadge: "Case study",
    tint: "indigo",
    frameType: "browser",
    categories: ["Web", "Backend", "Open source"],
    diagram: {
      nodes: ["Scraper", "Postgres", "Next.js"],
    },
    image: "/projects/necta-explorer.png",
    technologies: [
      "Python",
      "httpx",
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "TailwindCSS",
    ],
    githubUrl: "https://github.com/nelsonfrank/necta-explorer",
    featured: true,
    category: "Web App",
    role: "Fullstack & Data Engineer",
    year: "2025",
    duration: "2025",
    usersOrScale: "5 national exam levels (SFNA, PSLE, FTNA, CSEE, ACSEE)",
    timeline: [
      {
        title: "Audited legacy NECTA HTML hierarchies",
        period: "Step 1",
        detail:
          "Mapped inconsistent table layouts across multi-year national, regional, and school-centre examination pages.",
      },
      {
        title: "Built the async Python httpx & BeautifulSoup4 crawler",
        period: "Step 2",
        detail:
          "Created a modular CLI (`necta-crawler start --exam csee --year 2025`) with non-blocking I/O, rate limiting, and automatic retries.",
      },
      {
        title: "Designed indexed Prisma & PostgreSQL analytics schemas",
        period: "Step 3",
        detail:
          "Linked exam levels, regions, school centres, and candidate grade distributions with composite indexes for fast aggregation.",
      },
      {
        title: "Shipped the Next.js 15 & React 19 dashboard",
        period: "Step 4",
        detail:
          "Rendered server-side regional rankings, school comparisons, and pass-rate distributions with Recharts.",
      },
    ],
    decisions: [
      {
        decision: "Async Python httpx crawler over headless browsers",
        summary:
          "Parses static HTML tables directly with concurrent httpx requests and BeautifulSoup4.",
        tradeoff:
          "Requires custom parsers for legacy table quirks, but ingests thousands of school pages with a fraction of the CPU and memory.",
      },
      {
        decision: "Relational PostgreSQL schema over document blobs",
        summary:
          "Normalizes regions, schools, exam years, and grade tallies via Prisma ORM.",
        tradeoff:
          "Stricter upfront ingestion validation, enabling instant multi-year regional and school SQL aggregations.",
      },
      {
        decision: "React Server Components for heavy aggregations",
        summary:
          "Executes database queries and ranking calculations on the server in Next.js 15.",
        tradeoff:
          "Keeps client JavaScript bundles small and fast on mobile connections across Tanzania.",
      },
    ],
    screens: [
      {
        caption: "National and regional examination pass-rate dashboard",
        type: "browser",
      },
      {
        caption: "School centre grade distribution and historical trends",
        type: "browser",
      },
      {
        caption: "CLI targeted crawler sync across SFNA, PSLE, FTNA, CSEE, and ACSEE",
        type: "browser",
      },
    ],
    outcomeCards: [
      {
        metric: "5 exam levels",
        detail:
          "Unified SFNA, PSLE, FTNA, CSEE, and ACSEE archives into a single queryable PostgreSQL schema.",
      },
      {
        metric: "Async I/O",
        detail:
          "Concurrent Python httpx ingestion with automatic retries and rate-limit backoffs.",
      },
      {
        metric: "RSC analytics",
        detail:
          "Zero-client-waterfall regional rankings and school performance charts in Next.js 15.",
      },
    ],
    learned: {
      summary:
        "Historical government web archives change markup subtly every year; defensive HTML parsing and idempotent database upserts were essential for clean data.",
      bullets: [
        "Separating the Python ingestion CLI from the Next.js web app allowed independent crawling and zero-downtime data refreshes.",
        "Composite indexes on school code, region, and year kept multi-year comparison queries fast.",
      ],
    },
  },
  {
    slug: "i8n-automation-cli",
    title: "i18n Automation CLI",
    description:
      "An AI-native internationalization pipeline for React and TypeScript codebases featuring AST transformation, multi-provider LLM translation, and strict verification gates.",
    outcome:
      "Automates React and TypeScript localization via Babel AST codemods backed by 218 passing tests across 30 test suites.",
    resultHeadline: {
      prefix: "Safe React localization backed by ",
      highlight: "218 automated tests",
    },
    statusBadge: "218 tests",
    tint: "warm",
    frameType: "browser",
    categories: ["Developer tools", "Open source"],
    diagram: {
      nodes: ["Babel AST", "LLM Engine", "Codemod"],
    },
    image: "/projects/i8n-automation-cli.png",
    technologies: [
      "TypeScript",
      "Node.js",
      "Babel AST",
      "Gemini 3.8",
      "OpenAI",
      "react-i18next",
      "Vitest",
    ],
    githubUrl: "https://github.com/nelsonfrank/i8n-automation-cli",
    featured: true,
    category: "Developer Tools",
    role: "Creator & Lead Engineer",
    year: "2026",
    duration: "2026",
    usersOrScale: "218 passing tests across 30 test suites",
    timeline: [
      {
        title: "Built the Babel AST extraction phase",
        period: "Phase 1",
        detail:
          "Used @babel/parser and @babel/traverse to separate rendered JSX text from internal state keys, props, and object literals.",
      },
      {
        title: "Added multi-provider structured LLM translation",
        period: "Phase 2",
        detail:
          "Created provider adapters for Gemini, OpenAI, DeepL, and local Ollama with glossary constraints and interpolation variable masking.",
      },
      {
        title: "Engineered AST codemod injection & review queue",
        period: "Phase 3",
        detail:
          "Automated useTranslation hook injection, AST round-trip syntax verification, and an interactive i18n-review.json queue for ambiguous strings.",
      },
      {
        title: "Hardened with atomic signal rollbacks & 218 tests",
        period: "Phase 4",
        detail:
          "Trapped SIGINT/SIGTERM to roll back partial file writes and verified edge cases across 30 Vitest suites.",
      },
    ],
    decisions: [
      {
        decision: "Babel AST parsing instead of regex or raw file LLM rewrites",
        summary:
          "Extracts only user-facing JSX strings and rewrites nodes deterministically.",
        tradeoff:
          "More complex parser setup, but prevents LLMs from corrupting JSX trees or translating internal state comparison keys.",
      },
      {
        decision: "Interactive review queue for dual-use strings",
        summary:
          "Routes ambiguous literals to i18n-review.json instead of guessing.",
        tradeoff:
          "Adds a quick human confirmation step while guaranteeing zero silent runtime regressions.",
      },
      {
        decision: "Staging buffer with SIGINT/SIGTERM atomic rollback",
        summary:
          "Writes transformed files atomically and restores originals on interruption.",
        tradeoff:
          "Slightly higher disk I/O during runs, ensuring a cancelled CLI command never leaves a repo half-modified.",
      },
    ],
    screens: [
      {
        caption: "Phase 1: Babel AST extraction and dual-use string detection",
        type: "browser",
      },
      {
        caption: "Phase 2 & 3: Context-aware translation and react-i18next codemod",
        type: "browser",
      },
      {
        caption: "Pseudo-localization verifier and interactive CLI review queue",
        type: "browser",
      },
    ],
    outcomeCards: [
      {
        metric: "218 tests",
        detail:
          "Passing automated tests across 30 Vitest suites covering JSX interpolations, plurals, and edge cases.",
      },
      {
        metric: "4 providers",
        detail:
          "Pluggable translation engine supporting Gemini, OpenAI, DeepL, and offline Ollama models.",
      },
      {
        metric: "0 corrupt files",
        detail:
          "AST round-trip validation and atomic signal rollbacks prevent syntax drift.",
      },
    ],
    learned: {
      summary:
        "In real codebases, string literals often pull double duty as both UI labels and state comparison values; honesty about ambiguity beats 100% blind automation.",
      bullets: [
        "Never let an LLM rewrite source code directly when an AST codemod can perform the structural edit deterministically.",
        "Pseudo-localization catches layout clipping and concatenation bugs before paying for translation tokens.",
      ],
    },
  },
  {
    slug: "homelab",
    title: "Homelab & Kubernetes Architecture",
    description:
      "Self-hosted personal cloud and media infrastructure with Portainer stacks and a 3-level progressive migration path to Kubernetes with GitOps and automated TLS.",
    outcome:
      "3-level Docker Compose to Kubernetes GitOps blueprint with Argo CD, automated TLS, and fail-closed VPN sidecars.",
    resultHeadline: {
      prefix: "Zero-leak self-hosted cloud with ",
      highlight: "3-tier Kubernetes GitOps",
    },
    statusBadge: "Open source",
    tint: "teal",
    frameType: "browser",
    categories: ["Cloud & DevOps", "Open source"],
    diagram: {
      nodes: ["Traefik Ingress", "K8s / Argo CD", "Gluetun VPN"],
    },
    image: "/projects/homelab.png",
    technologies: [
      "Kubernetes",
      "Docker",
      "Portainer",
      "Kustomize",
      "Argo CD",
      "cert-manager",
      "Linux",
    ],
    githubUrl: "https://github.com/nelsonfrank/homelab",
    featured: true,
    category: "DevOps & Cloud",
    role: "Infrastructure Engineer",
    year: "2026",
    duration: "2026",
    usersOrScale: "3-level progressive migration blueprint (Docker Compose to K8s)",
    timeline: [
      {
        title: "Level 1: Declarative Kubernetes manifest translation",
        period: "Stage 1",
        detail:
          "Split monolithic Docker Compose stacks into isolated Kubernetes Deployments, Services, ConfigMaps, and PersistentVolumeClaims.",
      },
      {
        title: "Level 2: Unified Ingress & Kustomize overlays",
        period: "Stage 2",
        detail:
          "Eliminated port sprawl with domain-based Traefik/NGINX Ingress routing (*.homelab.internal), DRY Kustomize bases, and liveness/readiness probes.",
      },
      {
        title: "Level 3: Argo CD GitOps, cert-manager TLS & VPN sidecars",
        period: "Stage 3",
        detail:
          "Automated continuous Git reconciliation with Argo CD, Let's Encrypt TLS via cert-manager, GPU passthrough, and fail-closed Gluetun VPN sidecars.",
      },
    ],
    decisions: [
      {
        decision: "Shared-namespace Gluetun VPN sidecar kill-switch",
        summary:
          "Runs download clients inside the Gluetun VPN container's network namespace.",
        tradeoff:
          "Couples pod restarts to VPN health checks, but guarantees zero unencrypted traffic leaks if the tunnel drops.",
      },
      {
        decision: "Split NVMe RWO and network RWX storage tiers",
        summary:
          "Keeps SQLite/Postgres app databases on local NVMe and media archives on NFS/SMB.",
        tradeoff:
          "Requires two storage classes, preventing database corruption while allowing concurrent media streaming.",
      },
      {
        decision: "Kustomize overlays with Argo CD GitOps",
        summary:
          "Reconciles cluster state declaratively from Git without manual kubectl drift.",
        tradeoff:
          "Steeper initial setup than Portainer click-ops, but makes cluster recovery reproducible from a single repo.",
      },
    ],
    screens: [
      {
        caption: "Level 1 to Level 3 progressive Kubernetes migration topology",
        type: "browser",
      },
      {
        caption: "Fail-closed Gluetun VPN pod sidecar networking",
        type: "browser",
      },
      {
        caption: "Argo CD GitOps sync and cert-manager automated TLS",
        type: "browser",
      },
    ],
    outcomeCards: [
      {
        metric: "3-level path",
        detail:
          "Progressive blueprint taking self-hosters from Docker Compose to full Kubernetes GitOps.",
      },
      {
        metric: "0 IP leaks",
        detail:
          "Shared network namespace with Gluetun VPN sidecar halts pod egress immediately if tunnel drops.",
      },
      {
        metric: "Auto TLS",
        detail:
          "Domain-based Ingress with automated Let's Encrypt certificates via cert-manager.",
      },
    ],
    learned: {
      summary:
        "Moving from Docker Compose to Kubernetes succeeds when you respect pod boundaries and storage semantics instead of wrapping an entire stack in one giant pod.",
      bullets: [
        "Never put SQLite or database state on network-attached RWX shares meant for bulk media files.",
        "Kustomize overlays keep base manifests clean while letting you tune resource limits and storage classes per environment.",
      ],
    },
  },
]
