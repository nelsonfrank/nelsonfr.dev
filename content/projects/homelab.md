---
title: "Homelab & Kubernetes Architecture"
description: "Enterprise-grade self-hosted infrastructure with Docker Compose, Portainer, and a 3-level progressive migration path to Kubernetes with GitOps and automated TLS."
technologies: ["Kubernetes", "Docker", "Portainer", "Kustomize", "Argo CD", "cert-manager", "Linux", "Networking"]
githubUrl: "https://github.com/nelsonfrank/homelab"
category: "DevOps & Cloud"
---

### Project Overview

The **Homelab & Kubernetes Architecture** project documents the design, operational automation, and progressive evolution of a self-hosted private cloud infrastructure. Starting from containerized application stacks managed via **Docker Compose** and **Portainer**, the project details an architectural transition to production-grade **Kubernetes**.

The repository functions as both a living infrastructure codebase and a master 3-level migration blueprint (Beginner $\rightarrow$ Intermediate $\rightarrow$ Advanced), demonstrating how to run self-hosted media pipelines, private DNS, VPN kill-switch sidecars, GitOps deployments, and automated SSL/TLS management.

---

### The Challenge

Transitioning complex self-hosted environments from single-host Docker Compose to distributed Kubernetes often derails due to anti-patterns and operational overhead:

- **The "One Giant Pod" Anti-Pattern:** Naively dumping multi-service compose stacks into monolithic Kubernetes pods, creating coupled lifecycles and storage bottlenecks.
- **Port Sprawl & Ingress Routing:** Managing dozens of disparate port allocations across homelab services without port collisions or exposed management interfaces.
- **Persistent Storage Topologies:** Resolving differences between local ReadWriteOnce (RWO) volumes and distributed ReadWriteMany (RWX) network shares (NFS/SMB) needed for concurrent media ingestion and streaming.
- **Security & Network Isolation:** Ensuring that torrent and automated downloaders are strictly routed through encrypted VPN tunnels with fail-closed kill switches to prevent IP leakage.

---

### Technical Architecture & Decisions

#### 1. Level 1 (Beginner): Direct Manifest Translation
The baseline phase maps existing Docker Compose stacks into core Kubernetes primitives:
- Translates container definitions into declarative `Deployments`, `Services`, `ConfigMaps`, and `Secrets`.
- Isolates application environments into dedicated namespaces (`media-stack`), eliminating container naming clashes and isolating resource usage.
- Uses explicit `PersistentVolumeClaims` (PVCs) for stateful data retention across pod restarts.

#### 2. Level 2 (Intermediate): Ingress & Kustomize Architecture
Eliminates port sprawl and repetitive manifest boilerplate through clean structural patterns:
- **Unified Ingress Controller:** Implements domain-based reverse routing via Traefik / NGINX Ingress (`*.homelab.internal`), routing services over standard HTTP/HTTPS ports without manual port mappings.
- **DRY Deployments via Kustomize:** Employs Kustomize base manifests with selective environment overlays (`base/` and `overlays/`), allowing dynamic adjustments to replicas, storage classes, and environment variables without code duplication.
- **Production Health Checks:** Configures liveness and readiness HTTP probes to automatically restart hung containers and prevent routing traffic to unready pods.

#### 3. Level 3 (Advanced): GitOps, Hardened Sidecars & Hardware Acceleration
The pinnacle tier incorporates enterprise cloud-native patterns:
- **VPN Kill-Switch Pod Sidecars:** Pairs automated download clients (e.g., qBittorrent) with a **Gluetun** VPN container inside a shared network namespace. If the VPN tunnel drops, the entire network namespace halts, guaranteeing zero IP leakage.
- **GPU Hardware Transcoding:** Configures container security contexts and driver passthrough for Intel QuickSync and NVIDIA GPUs, enabling real-time 4K hardware-accelerated video transcoding in media streaming servers (Emby/Plex).
- **GitOps with Argo CD:** Full declarative state reconciliation, syncing cluster workloads continuously with the Git repository and automating Let's Encrypt TLS issuance via **cert-manager**.

---

### Key Features

- **3-Level Migration Blueprint:** Comprehensive engineering documentation detailing pitfalls, storage choices, and progressive Kubernetes adoption.
- **Automated Media Automation Suite:** Declarative deployment manifests for Sonarr, Radarr, Prowlarr, Jellyseerr, Bazarr, Dashy, and qBittorrent.
- **Hardened Gluetun VPN Sidecar:** Fail-safe pod networking preventing unencrypted traffic leaks during tunnel reconnections.
- **Dynamic Storage Management:** Clean separation between high-speed local NVMe volumes (for app databases) and large RWX network storage (for media libraries).
- **Declarative GitOps & SSL:** Continuous deployment configuration with Argo CD and automated certificate renewal via cert-manager.
