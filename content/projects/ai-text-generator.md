---
title: "AI Powered Text Generator"
description: "Text generator powered by OpenAI API, based on GPT-3.5. Features real-time streaming responses and a clean, intuitive interface."
technologies: ["TypeScript", "Next.js", "OpenAI", "Tailwind CSS"]
liveUrl: "#"
githubUrl: "#"
category: "Web App"
---

### Project Overview

The **AI Powered Text Generator** is an interactive, browser-based composition assistant. It utilizes OpenAI's GPT models to generate essays, copy, code blocks, and outlines instantly based on user parameters, displaying real-time streaming responses for a dynamic feel.

---

### The Challenge

Handling high-throughput streaming text in a React app can easily cause rendering bottleneck issues. Standard layout updates on every arriving character lead to layout thrashing, flickering page positions, and excessive DOM node updates.

Other hurdles included:
- Creating robust prompt-engineering overrides for different writing styles (e.g. professional, creative, academic).
- Designing a sleek, clean interface that scales down cleanly to mobile viewports.
- Building resilient backend API routing using Next.js Edge Runtime to support server-sent events (SSE).

---

### Technical Architecture & Decisions

#### 1. Next.js Edge Runtime
By deploying the API route on the Next.js Edge Runtime, we bypassed typical serverless execution timeouts and reduced network latency. The route pipes OpenAI's stream response directly back to the client as a readable stream.

#### 2. Streaming Client Parser
On the frontend, we used a custom hook utilizing the `EventSource` and `ReadableStream` readers. This hook updates client state at a throttled frame rate, resulting in buttery-smooth typing animations without rendering lag.

#### 3. Custom CSS Typography
We avoided typical generic font hierarchies, utilizing Outfit and Geist Mono from Google Fonts, and built custom text cursor animations to emphasize the real-time creation aesthetic.

---

### Key Features

- **Dynamic Writing Style Selector:** Instantly switches between academic, professional, and casual tones.
- **Micro-Copy Clipboard Actions:** One-click markdown copy integrations with instant toast notifications.
- **Response History Sidebar:** LocalStorage-persisted log of generated prompts for continuous editing.
- **Adaptive Input Area:** Textareas that grow dynamically with the length of prompt input.
