---
title: "Designing a Multi-Agency Transit Backend: Six Architecture Decisions and Where the Code Diverged"
excerpt: "How I structured City Connector's backend around RAPTOR, agency-namespaced GTFS IDs, blue-green timetable swaps, and isolated realtime feeds—plus the trade-offs and gaps still left in the codebase."
date: "November 22, 2026"
readTime: "11 min read"
tags: ["Architecture", "Go", "Python", "RAPTOR", "GTFS", "PostGIS", "Redis"]
project: "city-connector-backend"
highlightPhrase: "Six Architecture Decisions"
image: "/images/blog/city-connector/poster.jpg"
imageAlt: "Editorial transit-map schematic showing interlocking multi-agency corridors, dotted transfer footpaths, concentric RAPTOR search rings, and a live telemetry beacon."
---

Multi-agency transit routing gets much simpler when I stop treating a timetable like a road graph, refuse to merge agency IDs at ingestion, and split static schedule compilation from live vehicle telemetry.

That is the short version of what shaped [city-connector-backend](https://github.com/nelsonfrank/city-connector-backend), a personal engineering project I designed and built to power a single-city, multi-operator public transport platform. There is no commercial product behind it—I built both the backend and its companion mobile client to work through the real data and latency constraints of transit routing.

Rather than walking through a feature list, this post breaks down the six architecture decisions recorded in the repository's [ADRs](https://github.com/nelsonfrank/city-connector-backend/tree/main/docs/adr), the constraints that forced each trade-off, and the places where my actual Go and Python code still falls short of the original design.

## 1. The Goal

A rider gives the backend an origin, a destination, and a departure time (or an `arriveBy=true` target). The platform needs to:

- Return multiple non-dominated itineraries—not just one answer, because a rider might trade four extra minutes of travel time to avoid a transfer.
- Serve nearby-stop geospatial lookups and text autocomplete over stops and routes.
- Overlay live vehicle positions and delay-adjusted ETAs across multiple independent transit agencies operating in the same city.

To keep the later sections readable if you have not worked with transit feeds before, three terms come up throughout:

- **GTFS (General Transit Feed Specification):** A ZIP archive of CSV files (`stops.txt`, `routes.txt`, `trips.txt`, `stop_times.txt`, `calendar.txt`) published by transit agencies to describe their static schedule.
- **GTFS-RT (GTFS Realtime):** A Protocol Buffers feed polled every 15–30 seconds carrying live vehicle coordinates and per-trip delay deltas.
- **Pareto-optimal itineraries:** A set of journey options where no option is strictly worse than another across every criterion (arrival time and transfer count).

## 2. Constraints That Drove the Design

Architecture decisions look arbitrary until you state the constraints they were made under. I wrote these down in the [Software Architecture Document](https://github.com/nelsonfrank/city-connector-backend/blob/main/docs/architecture-SAD/software-architecture-document.md) before writing service code:

- **Uncontrolled upstream feeds:** Agencies publish GTFS static and GTFS-RT feeds on their own cadence. I cannot ask an agency to change its schema, fix malformed protobuf, or guarantee that its `stop_id = "1"` will not collide with another agency's `stop_id = "1"`.
- **Distinct workload profiles:** Journey search is CPU-bound over a timetable; nearby-stop search is high-volume geospatial SQL; realtime tracking is write-heavy and ephemeral (a stale bus coordinate is worse than no coordinate).
- **Target budgets:** Journey search p95 under 800 ms (with a 150 ms cap on the realtime hop), nearby-stop queries under 150 ms, realtime staleness at or below 30 seconds, and zero read downtime during daily schedule reloads.
- **Solo developer budget:** I am maintaining the entire stack alone. Every extra runtime, database, or infrastructure layer has to earn its operational cost.

## 3. System Architecture

The organizing principle across the backend is to **separate the write/ingestion path from the read/query path**, and precompute everything that can be precomputed before a rider sends a request.

<figure class="my-8">
  <video
    data-theme-video
    data-light-src="/images/blog/city-connector/city-connector-system-animated.mp4"
    data-dark-src="/images/blog/city-connector/city-connector-system-animated-dark.mp4"
    width="1000"
    height="738"
    style="aspect-ratio: 1000 / 738"
    loop
    muted
    playsinline
    preload="none"
    aria-label="Animated architecture diagram showing mobile and web clients calling Kong Gateway, which routes to Go Routing, Stop & Search, and Realtime services backed by PostgreSQL with PostGIS, Redis 7, Python static ingestion, and per-agency GTFS-RT pollers."
    class="block w-full rounded-lg border border-border"
  ></video>
  <figcaption class="mt-2 text-center text-sm text-muted-foreground">High-level data flow: static schedules compile through Postgres into memory; live telemetry expires in Redis.</figcaption>
</figure>

Behind a self-hosted **Kong Gateway** (handling path routing and per-route rate limits), the backend splits into three domain-oriented Go services (ADR-001):

1. **Routing Service (`services/routing`):** Holds an immutable, in-memory RAPTOR timetable compiled from PostgreSQL and serves `GET /journey`.
2. **Stop & Search Service (`services/search`):** Queries PostgreSQL + PostGIS directly for nearby stops (`ST_DWithin`), stop details, and text search.
3. **Realtime Service (`services/realtime`):** Runs per-agency GTFS-RT pollers that write normalized vehicle positions and trip delays to Redis with short TTLs, and serves live delay lookups.

A fourth component, **Static Ingestion (`services/ingestion`)**, is a scheduled Python batch job that validates GTFS archives, namespaces every ID, and loads versioned rows into PostgreSQL.

I rejected a single monolith because a CPU spike in journey routing should not starve cheap nearby-stop queries, and I rejected per-entity microservices (`stops-service`, `trips-service`, `routes-service`) because a single journey query naturally touches stops, trips, and stop times together.

## 4. Key Architecture Decisions

### Decision 1: RAPTOR over flat in-memory slices instead of Dijkstra (ADR-002)

Most routing tutorials reach for Dijkstra or A* over a weighted graph. Public transit breaks that model in two ways: edge cost depends on *when* you arrive at a stop (waiting 12 minutes for the next bus), and riders need multiple Pareto-optimal options rather than a single shortest path. Time-expanded Dijkstra can express this, but the graph grows large and producing multi-criteria results takes repeated searches.

I implemented **RAPTOR (Round-Based Public Transit Routing)**, introduced by Delling, Pajor, and Werneck in their [2012 ALENEX paper](https://www.microsoft.com/en-us/research/publication/round-based-public-transit-routing/). RAPTOR skips priority queues and operates in rounds—round `k` finds the earliest arrival at every reachable stop using at most `k` transfers—by scanning contiguous arrays of routes and stop times.

Here is the core in-memory layout in [`services/routing/internal/timetable/model.go`](https://github.com/nelsonfrank/city-connector-backend/blob/main/services/routing/internal/timetable/model.go) (Go 1.27, snapshot as of November 2026):

```go
// Pattern groups trips that serve the exact same sequence of stops in FIFO order.
type Pattern struct {
	RouteIdx RouteIdx
	StopsOff uint32
	NumStops uint16
	TripsOff uint32
	NumTrips uint32
	TimesOff uint32 // StopTimes[TimesOff + tripOffset*NumStops + stopSeq]
}

type Timetable struct {
	Stops           []Stop
	Patterns        []Pattern
	PatternStops    []StopIdx
	StopTimes       []StopTime
	StopPatterns    []PatternStopRef
	StopPatternsOff []uint32 // CSR-style offsets per stop
	Transfers       []Transfer
	TransfersOff    []uint32
	Services        []gtfs.Bitset
}
```

Instead of pointer-heavy graph structs, every stop, pattern, and trip is indexed by a dense `uint32`. Looking up a scheduled arrival is a single offset calculation (`p.TimesOff + tripOffset*uint32(p.NumStops) + uint32(stopSeq)`), and checking whether a trip runs on a given date is a bitset lookup (`gtfs.Bitset`).

To check the inner loop's allocation footprint, I ran `BenchmarkGoldenJourneySearch` (`go test -bench=BenchmarkGoldenJourneySearch -benchmem -count=5 ./internal/raptor`) on Go `1.27.3` (Linux amd64, 12th Gen Intel Core i7-1265U):

```text
BenchmarkGoldenJourneySearch-12   482692   2217 ns/op   2265 B/op   26 allocs/op
BenchmarkGoldenJourneySearch-12   542641   2279 ns/op   2265 B/op   26 allocs/op
BenchmarkGoldenJourneySearch-12   522638   2161 ns/op   2265 B/op   26 allocs/op
BenchmarkGoldenJourneySearch-12   566518   2211 ns/op   2265 B/op   26 allocs/op
BenchmarkGoldenJourneySearch-12   531840   2213 ns/op   2265 B/op   26 allocs/op
```

**Important caveat on those numbers:** `testdata/sample-feed` is a tiny synthetic fixture (7 stops, 5 routes, 5 trips, 12 stop times). That ~2.2 µs result shows that the pooled RAPTOR workspace avoids allocation churn per query—it is **not** a city-scale benchmark.

**What this decision cost:** Building and maintaining a custom in-memory compiler, a separate backward-RAPTOR code path for `arriveBy=true` (`services/routing/internal/raptor/reverse.go`), and a hard single-pod memory ceiling once a timetable outgrows one machine's RAM.

### Decision 2: Agency-namespaced GTFS IDs—and refusing to auto-merge stops (ADR-003)

Rather than inventing a custom internal transit schema, I adopted GTFS directly as the canonical data model. That leaves one unavoidable multi-agency trap: GTFS IDs are only unique *within* a single feed.

At ingestion, every primary and foreign key is prefixed with `{agency_id}:` inside a single shared utility, [`services/ingestion/src/ingestion/transform/namespacer.py`](https://github.com/nelsonfrank/city-connector-backend/blob/main/services/ingestion/src/ingestion/transform/namespacer.py) (Python 3.12, November 2026):

```python
def namespace_id(agency_id: str, raw_id: str) -> str:
    """Namespaces an entity ID with '{agency_id}:' if not already namespaced."""
    if not raw_id:
        return ""
    prefix = f"{agency_id}:"
    if raw_id.startswith(prefix):
        return raw_id
    return f"{prefix}{raw_id}"
```

The more opinionated half of ADR-003 is what I chose **not** to do: **I do not auto-merge physically co-located stops from different agencies.** If Agency A and Agency B serve the same bus shelter, they stay two distinct stops connected by a precomputed zero- or near-zero-cost walking transfer.

Proximity-based auto-merging looks tidy until a heuristic merges two separate stops across a divided highway or splits a station when an agency nudges its GPS coordinates by 15 meters on the next feed drop. Leaving stops distinct keeps ingestion deterministic and reversible.

**What this decision cost:** Every downstream consumer—including the GTFS-RT normalizer and the mobile UI—must speak namespaced IDs consistently, and the UI has to cluster nearby multi-agency stops cleanly for riders rather than expecting the database to have collapsed them.

### Decision 3: Blue-green static cutovers and lock-free pointer swaps (ADR-004 & SAD §6.2)

Daily schedule updates cannot take the read path offline, and an in-flight `/journey` query must never see half of Monday's trips mixed with half of Tuesday's stops.

<figure class="my-8">
  <video
    data-theme-video
    data-light-src="/images/blog/city-connector/ingestion-architecture-animated.mp4"
    data-dark-src="/images/blog/city-connector/ingestion-architecture-animated-dark.mp4"
    width="1000"
    height="834"
    style="aspect-ratio: 1000 / 834"
    loop
    muted
    playsinline
    preload="none"
    aria-label="Animated architecture diagram of the Python GTFS static ingestion pipeline: fetching and unzipping agency feeds, validating schemas and referential integrity, applying agency ID namespacing, staging rows with PostgreSQL COPY, precomputing footpaths, promoting feed_versions, and hot-swapping the Go Routing Service timetable."
    class="block w-full rounded-lg border border-border"
  ></video>
  <figcaption class="mt-2 text-center text-sm text-muted-foreground">Static ingestion stages rows under an inactive feed_version_id, promotes it atomically, and triggers a lock-free pointer swap in Routing.</figcaption>
</figure>

On the database side, [`services/ingestion/src/ingestion/db/loader.py`](https://github.com/nelsonfrank/city-connector-backend/blob/main/services/ingestion/src/ingestion/db/loader.py) inserts a row in `feed_versions` with `status = 'loading', is_active = FALSE`, streams all GTFS tables via PostgreSQL `COPY` tagged with that `version_id`, and flips the active flag in one transaction:

```python
cur.execute(
    "UPDATE feed_versions SET is_active = FALSE WHERE agency_id = %s",
    (agency_id,),
)
cur.execute(
    "UPDATE feed_versions SET is_active = TRUE, status = 'active' WHERE id = %s",
    (version_id,),
)
conn.commit()
```

If validation or loading fails at any step, the transaction rolls back and the previous valid version stays active.

On the Go side, [`services/routing/internal/timetable/store.go`](https://github.com/nelsonfrank/city-connector-backend/blob/main/services/routing/internal/timetable/store.go) avoids read/write mutexes entirely by storing the compiled snapshot behind an `atomic.Pointer`:

```go
type Store struct {
	cur atomic.Pointer[Timetable]
}

func (s *Store) Current() *Timetable { return s.cur.Load() }

func (s *Store) Swap(tt *Timetable) *Timetable { return s.cur.Swap(tt) }
```

Each incoming request calls `Current()` once and runs against that immutable pointer until it finishes, while new requests immediately see the swapped-in timetable.

**What this decision cost:** Memory usage spikes up to 2× during a timetable rebuild while both the old and new snapshots exist in RAM, and inactive `feed_versions` rows accumulate in PostgreSQL until pruned.

### Decision 4: Two data stores and two backend languages (ADR-004 & ADR-006)

I chose **PostgreSQL + PostGIS** for static GTFS data, **Redis 7** for ephemeral realtime telemetry, **Go** for the three serving services, and **Python** for static ingestion. Here is how those splits compare against the simpler single-tool alternatives:

| Choice | What I gained | Where the simpler alternative wins |
|---|---|---|
| **Postgres + PostGIS + Redis** vs. Postgres alone | Automatic TTL expiry in Redis (`realtime:delays:{tripId}`), keeping high-frequency 15–30s writes off the static relational DB. | One database to operate, monitor, and back up; zero cross-store sync or Redis outage fallback paths. |
| **Go + Python** vs. Go everywhere | Fast iteration on messy CSV validation (`pydantic` + `psycopg` streaming `COPY`) off the user-facing critical path. | One toolchain, one CI pipeline, and shared ID-namespacing code instead of maintaining matching logic in Python and Go. |

To keep a Redis or Realtime Service outage from breaking journey search, Routing calls Realtime over HTTP with a hard 150 ms budget and falls back to static ETAs on any error or timeout.

<figure class="my-8">
  <video
    data-theme-video
    data-light-src="/images/blog/city-connector/journey-request-flow-animated.mp4"
    data-dark-src="/images/blog/city-connector/journey-request-flow-animated-dark.mp4"
    width="1000"
    height="692"
    style="aspect-ratio: 1000 / 692"
    loop
    muted
    playsinline
    preload="none"
    aria-label="Animated request flow diagram for GET /journey: Rider Client to Kong Gateway to RAPTOR Engine and ETA Adjuster, querying Realtime API and Redis under a 150ms timeout with a dashed fallback path returning static ETAs and realtime: false on failure."
    class="block w-full rounded-lg border border-border"
  ></video>
  <figcaption class="mt-2 text-center text-sm text-muted-foreground">GET /journey enforces a 150ms timeout on the Realtime hop so an upstream failure degrades to static ETAs instead of returning 500.</figcaption>
</figure>

The fallback in [`services/routing/internal/eta/adjuster.go`](https://github.com/nelsonfrank/city-connector-backend/blob/main/services/routing/internal/eta/adjuster.go) is intentionally plain:

```go
delays, err := h.fetchDelays(ctx, tripIDs)
if err != nil {
	h.log.Warn("realtime delay lookup failed, degrading to static schedule", "err", err)
	return journeys
}
```

## 5. What I Would Change & What Is Still Unfinished

Writing ADRs upfront is useful, but comparing them against the running code surfaces four concrete gaps I have not closed yet:

1. **ADR-005 process isolation vs. in-process goroutines.** [ADR-005](https://github.com/nelsonfrank/city-connector-backend/blob/main/docs/adr/adr-005-realtime-ingestion-isolation.md) explicitly rejected running per-agency pollers as async tasks inside one process, arguing for one OS process or Kubernetes pod per agency so a crash or memory spike cannot affect siblings. In the actual code ([`services/realtime/internal/poller/supervisor.go`](https://github.com/nelsonfrank/city-connector-backend/blob/main/services/realtime/internal/poller/supervisor.go)), `Supervisor.Start` spawns one goroutine per agency inside the single `realtime` binary:

   ```go
   s.workers[feed.AgencyID] = worker
   go worker.Start(ctx)
   ```

   That gives logical isolation for timeouts and HTTP errors, **not** process-level isolation against an OOM or an unrecovered panic in a protobuf parser. Splitting the binary into a `--agency=<id>` worker mode per deployment is still on the backlog.

2. **Post-RAPTOR delay adjustment can miss broken transfers.** Because `HTTPAdjuster.Adjust` shifts leg `DepartAt` and `ArriveAt` timestamps *after* RAPTOR finishes, a 10-minute delay on leg 1 is not fed back into transfer feasibility for leg 2. In my judgement, keeping the in-memory timetable immutable was the right v1 trade-off, because mutating `StopTimes` every 15 seconds would either require locks or constant snapshot rebuilds—but transfer pruning with live delays remains a limitation for tight connections.

3. **No city-scale load test yet.** The repository now supports real-world MBTA, BART, and Caltrain feeds, and the micro-benchmark confirms low allocation overhead on `sample-feed`, but I have not yet measured single-pod RAM usage or p95 latency under concurrent load on a full metro timetable (Phase 4 of the roadmap). Until those runs happen, the 800 ms p95 target is a budget, not a verified production metric.

4. **Deferred auth and minor ADR drift.** Client authentication in [`gateway/kong.yml`](https://github.com/nelsonfrank/city-connector-backend/blob/main/gateway/kong.yml) is still a `# TODO` comment—only rate limiting is active today. And while ADR-006 cited `pandas` as the reason to pick Python for ingestion, I ended up dropping `pandas` in [`services/ingestion/pyproject.toml`](https://github.com/nelsonfrank/city-connector-backend/blob/main/services/ingestion/pyproject.toml) in favor of `pydantic` validation and streaming `psycopg` `COPY`, streaming rows directly into Postgres instead of materializing an entire `stop_times.txt` file in memory as a DataFrame.

## 6. Takeaways

Four principles from this build port well to other data-heavy backends:

- **Match the data structure to the query shape before tuning the database.** No amount of PostgreSQL indexing turns a multi-transfer, time-dependent timetable search into a simple SQL query; compiling the static data into flat in-memory slices made the hot path straightforward.
- **Prefer structural invariants over clever ingestion heuristics.** Prefixing every ID with `{agency_id}:` and leaving co-located stops unmerged looks slightly verbose, but it prevents silent cross-agency ID collisions before rows ever reach Postgres or memory.
- **Let ephemeral state expire on its own.** Storing live vehicle positions in Redis with short TTLs means a dead agency feed clears itself out instead of serving ghost buses until a cleanup job runs.
- **Audit your ADRs against your code.** Catching the gap between ADR-005's process isolation and `Supervisor`'s goroutines—and documenting it—is far more useful than pretending the implementation matches the diagram on day one.
