---
title: "City Connector — Transit Platform & Mobile App"
description: "Full-stack multi-agency public transit platform pairing an offline-first React Native (Expo) mobile application with Go RAPTOR routing microservices, GTFS/GTFS-RT ingestion, and Kong API Gateway."
technologies: ["React Native", "Expo", "TypeScript", "MapLibre", "TanStack Query", "MMKV", "Go", "Python", "RAPTOR", "GTFS-RT", "Kong Gateway", "PostGIS", "Redis", "Kubernetes"]
githubUrl: "https://github.com/nelsonfrank/city-connector-backend"
githubLinks:
  - label: "Backend"
    url: "https://github.com/nelsonfrank/city-connector-backend"
  - label: "Mobile"
    url: "https://github.com/nelsonfrank/city-connector-mobile"
category: "Distributed Systems"
role: "Fullstack, Mobile & Infrastructure Engineer"
year: "2026"
problem: "Multi-agency metropolitan transit riders face fragmented schedules, ghost vehicle telemetry, and spotty connectivity, while traditional graph searches fail sub-100ms routing targets."
result: "End-to-end transit platform combining an offline-first React Native (Expo SDK 58) MapLibre app with decoupled Go RAPTOR and Python GTFS-RT microservices behind Kong Gateway."
myPart: "Architected and built both the React Native mobile client (MapLibre, MMKV offline cache, token-bucket rate limiters, Zod v4 contracts) and the Go/Python backend microservices, PostGIS search, Redis telemetry, and Kubernetes/Tilt workflows."
relatedPosts: []
nextProject: "necta-explorer"
---

### Project Overview

**City Connector** is a production-grade, multi-agency public transit platform engineered for high-throughput multimodal urban journey planning across commuter rail, buses, and shared transit operators. The platform spans two decoupled repositories:

- **[City Connector Mobile](https://github.com/nelsonfrank/city-connector-mobile):** A cross-platform mobile application built on **Expo SDK 58** and **React Native 0.88** (New Architecture + Hermes) featuring native **MapLibre** vector maps, synchronous **MMKV** offline caching, client-side token-bucket rate limiters, and bilingual English/Swahili (`en`/`sw`) localization.
- **[City Connector Backend](https://github.com/nelsonfrank/city-connector-backend):** A cloud-native monorepo of specialized **Go** microservices and **Python** ingestion pipelines orchestrated behind **Kong API Gateway**, **PostgreSQL/PostGIS**, **Redis**, and **Kubernetes**.

Together, they empower riders to compute Pareto-optimal itineraries (fastest, fewest transfers, least walking), discover nearby stops geographically, browse cached schedules offline, and track live vehicle positions without ghost telemetry.

---

### The Challenge

Metropolitan transit networks across multiple independent operators introduce compounding challenges across both backend graph computation and mobile client resiliency:

- **Graph Traversal at Scale:** Running point-to-point journey searches across thousands of transit stops and timetables with sub-100ms response deadlines, where traditional shortest-path algorithms (like Dijkstra) incur prohibitive priority queue overhead.
- **High-Frequency Real-Time Ingestion & Ghost Vehicles:** Ingesting static GTFS bundles alongside continuous GTFS-RT protocol buffer feeds without lock contention, while immediately evicting stale GPS telemetry on mobile maps so riders never wait for "ghost" buses.
- **Multi-Agency Isolation & Offline Commuters:** Preserving distinct agency stop identities (`{agency_code}:{entity_id}`), isolating partial agency feed outages without failing whole screens, and keeping schedules and recent journeys accessible underground or in poor network conditions.

---

### Technical Architecture & Decisions

#### 1. RAPTOR Journey Planning Algorithm (`services/routing/`)
Rather than treating transit networks as static weighted graphs, the Go routing service implements **RAPTOR (Round-Based Public Transit Routing Algorithm)**:
- Computes Pareto-optimal arrival times by operating in rounds (where round $k$ discovers routes with at most $k$ transfers) balancing duration, transfer counts, and walking distances.
- Operates directly over contiguous stop-route arrays in memory without graph edge expansion, cutting memory footprints and keeping itinerary queries in the single-digit millisecond range.

#### 2. Offline-First React Native & MapLibre Mobile Client (`city-connector-mobile`)
The mobile client is built with **Expo Router v58** (typed file-based routing) and Continuous Native Generation (`expo prebuild`):
- **Vector Transit Mapping:** Wraps `@maplibre/maplibre-react-native` v11 inside an abstract `<TransitMap />` component for high-FPS stop and live vehicle rendering without proprietary map licensing lock-in.
- **Synchronous Offline Hydration:** Pairs **TanStack Query v5** with `@tanstack/query-async-storage-persister` backed by `react-native-mmkv` for server state, and **Zustand v5** (with MMKV persistence) for client preferences and recent searches.
- **Runtime Schema Enforcement:** Validates 100% of gateway payloads at the network boundary using **Zod v4**, preventing malformed multi-agency responses from crashing the UI.

#### 3. Client-Side Rate Limiting & Per-Agency Degradation Isolation
To protect backend capacity and ensure graceful mobile UX under degraded transit feeds:
- **Proactive Token Bucket Limiters:** Guards Kong Gateway quotas on the client before requests leave the device (`4 req/min` for `/journey`, `15 req/min` for `/stops/nearby`, `30 req/min` for `/search`), paired with a **Ky** HTTP `429 Retry-After` interceptor and live countdown UI.
- **Ghost Vehicle Prevention:** Vehicle telemetry snapshots older than 30 seconds (`EXPO_PUBLIC_REALTIME_STALE_THRESHOLD_MS`) or omitted from the latest poll are evicted immediately from the map.
- **Per-Agency Feed Isolation:** Opaque agency-prefixed IDs (`{agency_code}:{entity_id}`) are never merged across operators. When an individual operator's GTFS-RT feed degrades, the app renders a targeted `<FeedStatusBanner />` and falls back to scheduled GTFS arrivals for that agency while maintaining live tracking for healthy agencies.

#### 4. Decoupled Real-Time Tracking, PostGIS Search & GTFS Ingestion
- **Realtime Service (`services/realtime/`):** Manages live vehicle locations, trip progress, and delay propagation in Go using **Redis** ephemeral geospatial caches (60–120s TTL).
- **Search Service (`services/search/`):** Provides instant radius-based and full-text stop/route discovery backed by **PostgreSQL / PostGIS** spatial indexes.
- **GTFS & GTFS-RT Ingestion (`services/ingestion/`):** Python pipeline performing atomic transactional upserts and validation gates across static timetables and real-time protobuf streams.
- **Gateway & Cloud-Native Tooling:** **Kong Gateway** handles routing and rate-limiting at the edge; local development is orchestrated via **Tilt**, Docker Compose, **MSW v2** mock handlers, and **Maestro** E2E mobile flows.

---

### Key Features

- **RAPTOR Pareto-Optimal Itineraries:** Multi-criteria journey planning (Fastest, Fewest Transfers, Least Walking) with interactive multi-leg transit and walking timelines.
- **Native MapLibre Vector Maps & Live Telemetry:** Real-time vehicle tracking with 30-second stale eviction and per-agency degradation banners.
- **Offline-First MMKV Persistence:** Instant synchronous cache hydration allowing commuters to browse recent journeys, stops, and departures without connectivity.
- **End-to-End Type & Contract Safety:** Strict Go `internal/` module encapsulation on the backend paired with Zod v4 runtime validation, Jest + MSW v2 integration suites, and Maestro E2E flows on mobile.
- **Bilingual & Accessible UI:** Full English (`en`) and Swahili (`sw`) localization via `i18next` with 44pt minimum touch targets and screen-reader live announcements.
