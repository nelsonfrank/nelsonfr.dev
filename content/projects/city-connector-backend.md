---
title: "City Connector — Transit & Routing Engine"
description: "High-performance microservices platform for public transport journey planning, GTFS/GTFS-RT ingestion, geospatial stop search, and real-time vehicle tracking."
technologies: ["Go", "Python", "RAPTOR", "GTFS", "GTFS-RT", "Kong Gateway", "PostgreSQL", "Redis", "Docker", "Kubernetes", "Tilt"]
githubUrl: "https://github.com/nelsonfrank/city-connector-backend"
category: "Distributed Systems"
# TODO(content): Fill in case-study metadata and TL;DR fields
role: ""
year: ""
problem: ""
result: ""
myPart: ""
relatedPosts: []
nextProject: "necta-explorer"
---

### Project Overview

**City Connector** is an enterprise-grade transit routing and real-time fleet tracking platform engineered for high-throughput multimodal urban journey planning. It empowers riders to discover all viable routes between an origin and destination, identify the fastest and alternative options, browse stops geographically, and track live bus positions and delay-adjusted arrival countdowns.

The system is constructed as a decoupled monorepo of specialized Go microservices and Python data pipelines, orchestrated via **Kong API Gateway** and containerized for deployment on Kubernetes.

---

### The Challenge

Urban transit networks generate multi-dimensional graph topologies that scale non-linearly with stops, trip frequencies, calendar exceptions, and real-time delay variations. Primary engineering challenges included:

- **Graph Traversal at Scale:** Running point-to-point journey searches across thousands of transit stops and timetables with sub-100ms response deadlines, where traditional shortest-path algorithms (like Dijkstra) incur prohibitive priority queue overhead.
- **High-Frequency Real-Time Ingestion:** Ingesting static GTFS bundles alongside continuous GTFS-RT (Realtime) protocol buffer feeds without lock contention or transit schedule corruption.
- **Strict Architectural Decoupling:** Enforcing clean modular boundaries across microservices in a monorepo without circular dependencies or accidental leakage of internal implementation details.

---

### Technical Architecture & Decisions

#### 1. RAPTOR Journey Planning Algorithm (`services/routing/`)
Rather than treating transit networks as static weighted graphs, the routing service implements **RAPTOR (Round-Based Public Transit Routing Algorithm)** in Go.
- RAPTOR computes Pareto-optimal arrival times by operating in rounds (where round $k$ discovers routes with at most $k$ transfers).
- Operates directly over memory-efficient stop-route arrays without graph edge expansion, drastically cutting memory footprints and reducing journey query latencies to milliseconds.
- Supports transfer caps, maximum walking radii, and customizable arrival/departure targets.

#### 2. Decoupled Real-Time Tracking & Geospatial Search
To guarantee resilience under heavy commuter load, responsibilities are partitioned into isolated services:
- **Realtime Service (`services/realtime/`):** Manages live vehicle locations, trip progress, and delay propagation using **Redis** for sub-millisecond ephemeral geospatial caching.
- **Search Service (`services/search/`):** Provides instant radius-based and text-based stop and route discovery backed by spatial queries in **PostgreSQL / PostGIS**.

#### 3. GTFS & GTFS-RT Ingestion Pipeline (`services/ingestion/`)
A dedicated Python ingestion service periodically ingests and parses official General Transit Feed Specification (GTFS) static archives and streams GTFS-RT protocol buffers:
- Normalizes disparate agency timetables, calendar rules, and trip updates into a structured relational schema.
- Employs atomic transactional upserts and validation gates to prevent incomplete feed data from interrupting active routing queries.

#### 4. API Gateway & Cloud-Native Developer Loop
- **Kong Gateway:** Central entrypoint managing CORS, rate-limiting, and route dispatching across internal services.
- **Cloud-Native Tooling:** Local multi-container development is orchestrated through **Tilt** and Docker Compose, synchronizing code changes into container environments with production Kubernetes manifests (`infra/k8s`).

---

### Key Features

- **RAPTOR Itinerary Computation:** Fast multi-criteria journey planning balancing transit duration, transfer counts, and walking distances.
- **Live Vehicle Positions & ETAs:** Continuous processing of GTFS-RT streams to display live bus coordinates and delay-adjusted arrival forecasts.
- **Strict Go Module Boundaries:** Clean architecture enforcing `cmd/` entrypoints and unexported `internal/` core packages to guarantee service encapsulation.
- **Geospatial Stop Discovery:** Fast spatial indexing enabling riders to discover nearby transit stations and upcoming departures.
- **Kubernetes-Ready Infrastructure:** Declarative Kubernetes deployment manifests with automated Tilt workflows for local cluster testing.
