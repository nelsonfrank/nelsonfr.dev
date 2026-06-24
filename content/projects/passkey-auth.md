---
title: "Passkey Authentication Engine"
description: "A secure, biometric-based passwordless and multi-factor authentication system utilizing WebAuthn and SimpleWebAuthn, designed to prevent credential phishing."
technologies: ["TypeScript", "NestJS", "React", "TypeORM", "PostgreSQL", "WebAuthn"]
liveUrl: "#"
githubUrl: "https://github.com/nelsonfrank/passkey-auth-demo"
category: "Web App"
---

### Project Overview

The **Passkey Authentication Engine** is a production-ready, biometric-driven authentication platform designed to replace legacy password and OTP systems. By implementing the WebAuthn standard, the application enables secure, single-gesture sign-ins and multi-factor verification utilizing browser-native APIs and local device authenticators (such as TouchID, FaceID, or hardware keys). The project features a NestJS backend and a React-based frontend to deliver a sleek, phishing-resistant security pipeline.

---

### The Challenge

Implementing WebAuthn introduces complex cryptographic handshakes and serialization differences between client-side array buffers and backend-compatible JSON objects. A core engineering challenge is ensuring secure, replay-immune registration and authentication flows by generating, validating, and persisting high-entropy challenges, while enforcing strict credential signature counters to prevent token-cloning attacks.

Other hurdles included:
- Handling the schema requirements for storing WebAuthn public keys, credential IDs, and transport list states in a relational PostgreSQL database via TypeORM.
- Accommodating the signature counter mismatch quirks of synced passkeys (e.g., iCloud Keychain) without compromising security or causing user lockouts.
- Handling WebAuthn browser constraints, such as origin validation restrictions and secure context requirements that can disrupt frontend scripts.

---

### Technical Architecture & Decisions

#### 1. Decoupled Attestation & Assertion Verification
We structured the authentication system into discrete challenge-response loops. The NestJS backend coordinates challenge generation and verification using `@simplewebauthn/server` (v13.3.0), storing transient challenges in the user record. This decoupled lifecycle guarantees that only clients possessing the private key matching the verified challenge can generate valid JWT signatures.

#### 2. Strict Relying Party (RP) Domain Scoping
To mitigate credential-phishing attacks, the authentication engine strictly enforces Relying Party ID (`rpID`) verification. The backend dynamically verifies that the client's assertion origin matches the configured server hostname. If a request is proxied through an unauthorized origin, the verification fails instantly on the backend, rendering intercepted credentials useless to attackers.

#### 3. Optimized Asymmetric Key Storage
Instead of relying on heavy third-party storage formats, we map credential payloads to lightweight database records. We serialize WebAuthn `Uint8Array` public keys into URL-safe Base64 strings (`isoBase64URL`) before saving them in the `passkey_credentials` table. During login, the server retrieves the key, decodes it back to a binary buffer, and executes native cryptographic signature checks, minimizing database query overhead and CPU utilization.

---

### Key Features

- **Biometric Passwordless Login:** Password-free entry utilizing TouchID/FaceID via native WebAuthn integrations.
- **Dynamic Device Registration Exclusions:** Prevents registration of already enrolled authenticators by checking existing credentials on challenge requests.
- **Cloned Token Protection:** Real-time checking of the signature counter to detect and block cloned authenticator replays.
- **Automatic Fallback State Handling:** Clean visual error states and feedback when WebAuthn APIs are invoked in non-secure or unsupported contexts.
