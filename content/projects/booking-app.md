---
title: "Booking App"
description: "A full-featured booking application with calendar integration, payment processing, and real-time availability updates."
technologies: ["Flutter", "Dart", "Firebase", "Stripe"]
liveUrl: "#"
githubUrl: "#"
category: "Mobile App"
---

### Project Overview

**Booking App** is a high-performance cross-platform mobile application that allows users to find, book, and pay for professional services (e.g. workspace sessions, appointments, classes) directly from their iOS or Android device.

---

### The Challenge

Real-time inventory and slot booking systems are notoriously vulnerable to race conditions (e.g., two users booking the same slot at the exact same millisecond). Ensuring transaction integrity on a distributed serverless setup was paramount.

Key technical requirements:
- Eliminating double-bookings using cloud database transactions.
- Offloading calendar syncing tasks without blocking user payment interfaces.
- Achieving buttery-smooth 60fps animations inside Flutter when rendering complex scheduling lists.

---

### Technical Architecture & Decisions

#### 1. Cross-Platform Flutter Framework
We chose Flutter for visual consistency. By building custom stateful render components, we achieved native-quality navigation, sliding sheets, and calendar overlays across both platforms from a single codebase.

#### 2. Firebase Transactions & Cloud Functions
To guarantee booking integrity, slot allocations are executed inside Firestore transaction blocks. If a conflict occurs during booking, the database automatically retries or rejects, ensuring data consistency. Payment processing is triggered securely using Stripe API calls inside Node.js Firebase Cloud Functions.

#### 3. Real-time Scheduling State
A local state manager (using Riverpod) listens to realtime slots data streams, displaying instant changes in booking availability to all active clients without manual refreshing.

---

### Key Features

- **Dynamic Interactive Calendar:** Multi-view calendar supporting day, week, and list formats.
- **Stripe Payments Integration:** One-tap card validation and Google Pay / Apple Pay module setups.
- **Instant Push Alerts:** Firebase Cloud Messaging (FCM) updates reminding users of upcoming bookings.
- **Profile Dashboard:** Activity histories, billings downloads, and feedback scores.
