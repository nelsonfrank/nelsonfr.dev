---
title: "Homelab & Kubernetes Architecture"
description: "Progressive 3-level blueprint taking self-hosted Docker Compose stacks to Kubernetes GitOps with Argo CD, automated TLS, and fail-closed VPN sidecars."
technologies: ["Kubernetes", "Docker", "Portainer", "Kustomize", "Argo CD", "cert-manager", "Linux", "Networking"]
githubUrl: "https://github.com/nelsonfrank/homelab"
category: "DevOps & Cloud"
role: "Infrastructure Engineer"
year: "2026"
problem: "Moving a working self-hosted Docker Compose setup to Kubernetes usually breaks in four predictable ways: stuffing an entire stack into one giant pod, juggling dozens of colliding ports, corrupting SQLite databases on network shares, and leaking real IP addresses when a VPN tunnel drops."
result: "Built a 3-level migration blueprint and live infrastructure repo covering Kustomize overlays, Traefik/NGINX Ingress, Argo CD GitOps, cert-manager TLS, GPU passthrough, and fail-closed Gluetun VPN sidecars."
myPart: "I designed and documented the 3-level migration path, wrote the Kubernetes manifests and Kustomize overlays, configured the Gluetun VPN kill-switch pods, and automated reconciliation with Argo CD."
relatedPosts: []
nextProject: "passkey-auth"
---

### Progressive 3-Level Migration Topology

Jumping straight from Docker Compose to full GitOps overwhelms most self-hosters. I structured the repository as three runnable stages so each layer solves one specific operational pain point:

```mermaid
flowchart LR
  Git["Git Repo (Kustomize)"] --> Argo["Argo CD"]
  Argo --> Ingress["Traefik Ingress + TLS"]
  Ingress --> Apps["Media & Cloud Pods"]
  Apps --> NVMe[("Local NVMe RWO")]
  Apps --> NAS[("NAS Share RWX")]
  Apps --> VPN["Gluetun VPN Sidecar"]
```

- **Level 1 (Clean Primitives):** Breaks monolithic Compose files into isolated `Deployments`, `Services`, `ConfigMaps`, and `PersistentVolumeClaims` inside a dedicated `media-stack` namespace—eliminating the "one giant pod" anti-pattern.
- **Level 2 (Ingress & Kustomize):** Replaces port sprawl (`:8080`, `:8989`, `:7878`) with domain-based routing (`*.homelab.internal`) via Traefik/NGINX Ingress, adds HTTP liveness/readiness probes, and moves shared manifests into `base/` with per-environment `overlays/`.
- **Level 3 (GitOps & Hardening):** Hands reconciliation to **Argo CD**, automates Let's Encrypt certificates with **cert-manager**, enables Intel QuickSync / NVIDIA GPU passthrough for 4K transcoding, and locks down egress with VPN sidecars.

---

### Fail-Closed VPN Sidecar Networking

Running a download client (like qBittorrent) with an app-level proxy leaves a window for real-IP leaks whenever the VPN reconnects. Instead, I co-locate the downloader and a **Gluetun** VPN container inside the same Kubernetes Pod so they share a single Linux network namespace:

```yaml
# Both containers share one network namespace; all egress routes through tun0
containers:
  - name: gluetun
    image: qmcgaw/gluetun:latest
    securityContext:
      capabilities:
        add: ["NET_ADMIN"]
  - name: qbittorrent
    image: lscr.io/linuxserver/qbittorrent:latest
```

Because `gluetun` owns the pod's firewall rules and `tun0` interface, a dropped VPN tunnel immediately halts all egress traffic from `qbittorrent` until the tunnel recovers—zero unencrypted packets can escape.

---

### Respecting Storage Semantics (RWO vs. RWX)

The fastest way to corrupt self-hosted apps (*Sonarr, Radarr, Prowlarr, Jellyseerr, Bazarr*) on Kubernetes is mounting their SQLite config databases over NFS or SMB. Network filesystems struggle with SQLite file locking under concurrent writes.

I split storage into two explicit `StorageClass` tiers:
- **Local NVMe (`ReadWriteOnce`):** Holds all application configs and SQLite/PostgreSQL databases for low-latency, lock-safe writes.
- **Network NAS (`ReadWriteMany`):** Holds bulk media libraries so downloaders, indexers, and media servers (Emby/Plex) can read and write concurrently without blocking each other.
