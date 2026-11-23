---
title: "Designing CI/CD for a Multi-Agency Transit Backend: Dual-Track Delivery, Golden Gates, and Canary Rollouts"
excerpt: "How I designed City Connector's CI/CD and delivery architecture—path-filtered PR checks, immutable SHA images promoted through staging and k6 SLA gates to a canary, and a separate blue-green GTFS data pipeline."
date: "November 23, 2026"
readTime: "10 min read"
tags: ["CI/CD", "Architecture", "Docker", "Kubernetes", "GitHub Actions", "Golang", "Python"]
project: "city-connector-backend"
highlightPhrase: "Dual-Track Delivery"
image: "/images/blog/city-connector/cicd-poster.jpg"
imageAlt: "Editorial blueprint schematic showing parallel Go and Python CI tracks, container layers, health-probe rings, and a dashed boundary gate for continuous deployment."
---

A multi-agency transit backend has two release loops running at different speeds: engineers ship code changes per pull request, while transit agencies publish new static schedules every day and live vehicle telemetry every 15–30 seconds. Treating both loops as a single deployment pipeline couples routine schedule updates to code rollouts and turns a bad agency CSV into a production outage.

This post is a companion to my earlier write-up on [the backend's six architecture decisions](/writing/city-connector-architecture-decisions). [city-connector-backend](https://github.com/nelsonfrank/city-connector-backend) is a personal engineering project I designed and maintain alone—there is no commercial product behind it. Here I walk through the **proposed CI/CD and delivery architecture** built from the repository's [Software Architecture Document](https://github.com/nelsonfrank/city-connector-backend/blob/main/docs/architecture-SAD/software-architecture-document.md), [ADRs](https://github.com/nelsonfrank/city-connector-backend/tree/main/docs/adr), and [roadmap](https://github.com/nelsonfrank/city-connector-backend/blob/main/docs/roadmap.md), the constraints behind each trade-off, and a plain accounting of what is already wired in the repo versus still proposed.

## 1. The Goal

The backend splits into three domain-oriented Go HTTP services (`routing`, `search`, `realtime`) behind a declarative Kong Gateway (`gateway/kong.yml`), plus a scheduled Python batch pipeline (`ingestion`) backed by PostgreSQL + PostGIS and Redis 7 (ADR-001, ADR-006).

The delivery design has to satisfy three operational goals:

- **Independent service releases:** Updating the RAPTOR routing engine must not require rebuilding or redeploying Stop & Search or Realtime pollers.
- **Correctness and latency gates before production:** Routing bugs are harder to spot than HTTP 500s—an itinerary that misses a valid transfer looks like a normal `200 OK`. CI and staging have to catch both itinerary regressions and p95 latency regressions before full rollout.
- **Zero-downtime schedule and feed operations:** Daily GTFS static updates must cut over without dropping `/journey` reads, and onboarding or restarting one agency's GTFS-RT poller must not affect any other agency.

## 2. Constraints and SLOs That Drive CI/CD

Delivery pipelines get bloated when they copy enterprise templates instead of following the system's non-functional requirements. Five requirements from `SAD §1.2` and `ADR-006` shaped this design:

- **Latency and freshness budgets:** Journey search `p95 < 800 ms` (`NFR-1`), nearby-stop queries `p95 < 150 ms` (`NFR-2`), and realtime vehicle staleness `≤ 30 s` (`NFR-3`).
- **Availability and zero-downtime updates:** `99.9%` read-path availability (`NFR-4`) and daily static schedule ingestion with zero read downtime (`NFR-5`).
- **Independent scaling and failure isolation:** Stateless services scale independently (`NFR-6`), and one agency's broken feed cannot degrade another agency's data (`NFR-7`).
- **Polyglot runtimes:** Go for the three serving services and Python for static GTFS ingestion (`ADR-006`), meaning CI must handle two dependency ecosystems plus gateway/API contracts.
- **Solo-developer operational ceiling:** Self-managed Kubernetes on day one adds cluster-ops overhead I do not need before validating real traffic (`ADR-006`), even though the containers and manifests stay Kubernetes-ready.

## 3. Dual-Track Delivery Architecture

The core design choice is splitting delivery into **two decoupled pipelines**: a path-filtered **Code CI/CD pipeline** (PR checks, immutable SHA images, staging + `k6` SLA gate, canary, production, monitoring rollback) and a scheduled **Data pipeline (GTFS)** for daily static schedules.

<figure class="my-8">
  <video
    data-theme-video
    data-light-src="/images/blog/city-connector/cicd-delivery-pipeline-animated.mp4"
    data-dark-src="/images/blog/city-connector/cicd-delivery-pipeline-animated-dark.mp4"
    width="1000"
    height="886"
    style="aspect-ratio: 1000 / 886"
    loop
    muted
    playsinline
    preload="none"
    aria-label="Animated CI/CD pipeline diagram: Developer pushes to a path-filtered Monorepo triggering CI on every PR (Go checks with lint, race, bench and PostGIS/Redis integration; Python checks with ruff, mypy, pytest; Kong and OpenAPI contract checks), feeding Build and release (commit-SHA Image build, dependency and image Scan, immutable Registry), then Code delivery (Staging, k6 load test p95 SLA gate, Routing-first Canary, full Production rollout, and Prometheus Monitoring with automated canary rollback), alongside an independent GTFS Data pipeline (Agency feeds, Ingestion validation and namespacing, versioned PostgreSQL load, atomic-pointer Timetable swap, and known-journey Smoke test)."
    class="block w-full rounded-lg border border-border"
  ></video>
  <figcaption class="mt-2 text-center text-sm text-muted-foreground">Proposed delivery design: path-filtered PR checks promote one immutable SHA image per service through staging and canary, while daily GTFS schedules ship on their own hot-swap pipeline.</figcaption>
</figure>

Separating these tracks means a daily schedule refresh does not trigger a GitHub Actions build or a container rollout, and a code deploy does not wait on GTFS feed ingestion.

## 4. Five Core Delivery Design Decisions

### Decision 1: Path-filtered PR checks across Go, Python, and Kong contracts (ADR-001, ADR-006, Roadmap 1.8)

Because each Go service lives under `services/<name>/` with its own `go.mod` and `cmd/` + `internal/` boundary, the Go compiler blocks accidental cross-service imports. When a developer opens a PR against the monorepo, path filters route changes into three targeted lanes:

- **Go checks (`lint`, `race`, `bench`) + PostGIS/Redis integration:** Runs `go vet`, `go test -race ./...`, and benchmarks, then executes database and cache integration tests against ephemeral PostGIS and Redis containers. Inside `go test -race ./...`, the **golden-itinerary regression suite** (`docs/roadmap.md`, Task 1.8, in [`services/routing/internal/raptor/golden_test.go`](https://github.com/nelsonfrank/city-connector-backend/blob/main/services/routing/internal/raptor/golden_test.go)) enforces `SAD §1.3`'s top quality goal ("wrong routing information is worse than no information") by asserting exact Pareto itineraries for known origin/destination/time pairs.
- **Python checks (`ruff`, `mypy`, `pytest`):** Validates `services/ingestion` linting, static types, GTFS schema validation, and ID-namespacing tests.
- **Kong + contracts (`decK`, `OpenAPI`):** Validates declarative gateway routes in [`gateway/kong.yml`](https://github.com/nelsonfrank/city-connector-backend/blob/main/gateway/kong.yml) and API specs such as [`services/routing/internal/api/openapi.json`](https://github.com/nelsonfrank/city-connector-backend/blob/main/services/routing/internal/api/openapi.json) so a path or schema change cannot silently break mobile or web clients.

Here is the existing `routing` job shape in [`.github/workflows/go-services.yml`](https://github.com/nelsonfrank/city-connector-backend/blob/main/.github/workflows/go-services.yml) (snapshot as of November 2026) that this PR design builds on:

```yaml
jobs:
  build-routing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-go@v4
        with: { go-version: '1.22' }
      - run: cd services/routing && go build ./...
      - run: cd services/routing && go vet ./...
      - run: cd services/routing && go test -race ./...
```

**What this decision cost:** Maintaining two language toolchains plus gateway contract tooling in CI, and curating golden fixtures as routing gains features like `arriveBy=true` and multi-agency transfers.

### Decision 2: Immutable SHA builds, security scans, and portable container targets (ADR-006 & SAD §7)

Once PR checks are green, the **Build and release** stage compiles one minimal multi-stage Go binary (`services/routing/Dockerfile`) or slim Python batch image (`services/ingestion/Dockerfile`) per changed service, tags it with the **git commit SHA**, runs dependency and image vulnerability scanning (`Scan`), and pushes the immutable artifact to the **Registry**.

The diagram shows the `Code delivery` stages (`Staging`, `Canary`, `Production`) using Kubernetes icons to match `SAD §7` and the local manifests in `infra/k8s/`. At the same time, `ADR-006` explicitly chooses a **managed container platform** (AWS Fargate/ECS or GCP Cloud Run) over self-managed Kubernetes on day one. Keeping every service packaged as an immutable SHA-tagged container reconciles both:

| Deployment target | What it gives a solo maintainer | Where the alternative wins |
|---|---|---|
| **Managed containers (Fargate / Cloud Run)** | No control-plane upgrades, node patching, or ingress maintenance; scales stateless services (`search`, `realtime`) automatically. | Self-managed Kubernetes offers finer canary/traffic routing, native `CronJob` primitives, and zero cloud-provider lock-in. |
| **Kubernetes manifests + Tilt locally (`infra/k8s/`)** | Models probes, `StatefulSet` init scripts, resource limits, and `CronJob` schedules locally without cloud bills. | Maintaining local K8s manifests alongside Docker Compose (`infra/docker/`) adds config duplication (`kong.yml`, `01-gtfs-schema.sql`). |

Because the artifact boundary is a single SHA-tagged image, moving from Fargate or Cloud Run to Kubernetes later requires zero application code changes (`ADR-006`), and rollbacks are a single tag revert rather than a rebuild.

### Decision 3: Staging `k6` SLA gates, Routing-first canaries, and monitoring rollback (SAD §8.4, Roadmap Phase 4)

Unit tests confirm logic; they do not confirm `NFR-1` (`p95 < 800 ms` on `/journey`) or `NFR-2` (`p95 < 150 ms` on `/stops/nearby`) under concurrent load. In the proposed **Code delivery** flow:

1. **Staging (`same SHA`):** Deploys the exact commit SHA from the registry without rebuilding.
2. **`k6` load test (`p95 SLA gate`):** Drives concurrent traffic against staging (`roadmap.md` 4.1) and blocks promotion if `p95` latency or error budgets breach the SAD thresholds.
3. **Canary (`Routing first`):** Promotes the verified image to a small slice of production traffic starting with the CPU-bound Routing Service before rolling out across the full fleet (**Production**).
4. **Monitoring (`latency, errors`) + rollback:** Structured logs with Kong correlation IDs, Prometheus + Grafana metrics (`p50`/`p95`/`p99` latency, RAPTOR round counts, per-agency feed staleness `≤ 30 s`), OpenTelemetry traces, and Sentry errors (`SAD §8.4`, `ADR-006`) feed an automated rollback path back to the previous image if canary latency or error rates spike.

**What this decision cost:** Maintaining realistic staging datasets and `k6` traffic scripts so the SLA gate tests city-scale timetables rather than toy fixtures.

### Decision 4: Decoupling the daily GTFS data pipeline with atomic swaps and smoke tests (SAD §6.2 & NFR-5)

Static transit schedules arrive as bulk daily ZIP drops that replace the entire routing graph. The **Data pipeline (GTFS)** runs on its own schedule, completely outside code CI/CD:

1. **Agency feeds → Ingestion (`validate`, `namespace`):** Pulls each agency's GTFS ZIP, checks structural and referential integrity (required files, coordinates, monotonic `stop_sequence`, valid route/stop references), and prefixes every ID with `{agency_id}:` (ADR-003). Malformed feeds are rejected before touching live data (`SAD §10`).
2. **PostgreSQL (`versioned load`):** Streams validated rows via `COPY` into inactive `feed_versions` tables and promotes the new version in one transaction.
3. **Timetable swap (`atomic pointer`):** Routing pods compile the new version into RAM and swap the active timetable pointer lock-free while in-flight `/journey` requests finish on the prior snapshot.
4. **Smoke test (`known journeys`):** Queries a fixed set of known journeys immediately after the swap; if a smoke test fails, the pipeline rolls back to the previous `feed_version` tag.

That runtime lifecycle also drives container orchestration. In [`infra/k8s/routing.yaml`](https://github.com/nelsonfrank/city-connector-backend/blob/main/infra/k8s/routing.yaml) (November 2026), liveness and readiness probes are split on purpose:

```yaml
livenessProbe:
  httpGet: { path: /healthz, port: 8081 }
  periodSeconds: 10
readinessProbe:
  httpGet: { path: /readyz, port: 8081 }
  periodSeconds: 5
  failureThreshold: 3
resources:
  requests: { cpu: "250m", memory: "256Mi" }
  limits: { memory: "512Mi" }
```

`/healthz` confirms the HTTP server is alive; `/readyz` blocks `/journey` traffic until the initial timetable load completes. The `512Mi` memory limit gives 2× headroom over the `256Mi` request so a pod does not OOM-kill while holding both snapshots during a swap.

**What this decision cost:** Doubling peak memory during reloads and requiring periodic cleanup of superseded `feed_versions` rows in PostgreSQL.

### Decision 5: Per-agency worker deployment units for GTFS-RT (ADR-005 & NFR-7)

`NFR-7` states that one agency's broken realtime feed must not degrade any other agency. `ADR-005` rejects both a single sequential polling loop and a single process running per-agency async tasks, because an unhandled parser panic or memory spike in one feed can still take down the shared process.

Instead, the deployment design runs **one independently restartable worker per agency**—each polling its own GTFS-RT endpoint, normalizing protobuf payloads through a shared library, and writing namespaced keys (`{agency_id}:...`) into Redis with short TTLs. Onboarding a new transit agency becomes deploying a new worker instance with that agency's feed URL and ID, without modifying or restarting existing agencies' workers.

**What this decision cost:** More running units to deploy and monitor than a single multi-agency poller, plus keeping the shared GTFS-RT normalizer versioned as one library so workers do not drift.

## 5. Trade-Offs and Where the Repo Stands Today

As the diagram header notes, this full pipeline is the **proposed design, not yet implemented end to end**. Here is the exact boundary in [city-connector-backend](https://github.com/nelsonfrank/city-connector-backend) as of November 2026:

- **Already in the repo:** Language-split GitHub Actions workflows (`go-services.yml`, `ingestion-service.yml`), multi-stage Go and slim Python Dockerfiles, `gateway/kong.yml` and `services/routing/internal/api/openapi.json`, local Docker Compose and Tilt/Kubernetes stacks with `/healthz`/`/readyz` probes, the golden-itinerary suite and micro-benchmarks in `services/routing`, `pytest` suites in `services/ingestion`, and the blue-green `feed_versions` PostgreSQL loader.
- **Proposed, not yet wired:** Running `go test -race` across `search` and `realtime` in CI, adding `ruff`/`mypy`/`pytest` to `ingestion-service.yml`, adding `decK` + OpenAPI contract checks, spinning up PostGIS/Redis CI service containers, building/scanning/pushing SHA-tagged images to a registry, staging `k6` SLA gates, Routing-first canary rollouts with automated rollback, post-swap known-journey smoke tests, and splitting `realtime` into per-agency OS processes (`ADR-005`).

## 6. Takeaways

Four principles from this delivery design port to other data-heavy backends:

- **Separate code deployment from bulk data deployment.** When upstream datasets refresh daily, put data through its own validation gate, atomic swap, and smoke test instead of coupling schedule updates to code releases.
- **Encode runtime invariants in probes and limits.** A `/readyz` endpoint that waits for in-memory state warm-up and a 2× memory ceiling for lock-free swaps turn architectural assumptions into enforceable orchestration rules.
- **Put domain-correctness and latency gates before full rollout.** Unit tests check that handlers return `200 OK`; a golden regression suite and a staging `k6` SLA gate verify the core algorithm still produces valid itineraries inside the latency budget.
- **Promote one immutable SHA image across every environment.** Building once, scanning the artifact, and promoting the same commit SHA from staging to canary to production keeps rollbacks fast and predictable whether you run managed containers or Kubernetes.
