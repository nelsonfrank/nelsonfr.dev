---
title: "Live Markdown Editor"
description: "A real-time markdown editor with live preview, syntax highlighting, and export functionality. Built for developers who write."
technologies: ["TypeScript", "React", "CodeMirror", "Markdown"]
liveUrl: "#"
githubUrl: "#"
category: "Web App"
---

### Project Overview

**Live Markdown Editor** is a distraction-free, browser-based editor tailored for technical bloggers and engineers. It offers a split-pane layout showing code on the left and a live-rendered HTML output on the right, synchronized with smooth scrolling.

---

### The Challenge

Synchronizing state and rendering rich Markdown previews in real-time requires efficient parsing. Traditional parsing on every keystroke can block the main thread, especially when handling long articles with complex equations, code segments, and table matrices.

Challenges solved:
- Synchronizing scrolling between CodeMirror and the HTML preview pane.
- Providing instant syntax highlighting inside the editor without sluggish typing.
- Rendering GFM (GitHub Flavored Markdown) and mathematical LaTeX equations cleanly.

---

### Technical Architecture & Decisions

#### 1. CodeMirror 6 Integration
We integrated CodeMirror 6 to manage the editor state. By utilizing its modular extension ecosystem, we configured custom themes, folding, line numbers, and instant markdown tag wrapping shortcuts.

#### 2. Throttled AST Parsing (Unified / Rehype)
Markdown parsing is managed via a `unified` pipeline using `remark-parse`, `remark-rehype`, and `rehype-stringify`. The compiler runs inside a background Web Worker when documents exceed 5,000 characters, completely avoiding UI thread freeze.

#### 3. Scroll Synchronization Algorithm
We calculated percentage offsets based on layout bounding boxes, ensuring that scrolling the editor smoothly drives the preview pane to the matching header block.

---

### Key Features

- **Split-Pane Split View:** Side-by-side editing with a toggle option for distraction-free solo writing modes.
- **Syntax Highlight Blocks:** Elegant pre-built Prism theme modules for JS, TS, HTML, Rust, and Python.
- **Export Multi-Formats:** Download raw markdown, compiled HTML, or generated PDF documents instantly.
- **Automatic Auto-Save:** Session-based local state persistence protecting work against unexpected tab crashes.
