---
title: "i18n-cli — AI-Native Localization Engine"
description: "Babel AST codemod and multi-provider LLM pipeline that safely internationalizes React and TypeScript apps with 218 automated tests."
technologies: ["TypeScript", "Node.js", "Babel AST", "Gemini 3.8", "OpenAI", "react-i18next", "Vitest", "CLI"]
githubUrl: "https://github.com/nelsonfrank/i8n-automation-cli"
category: "Developer Tools"
role: "Creator & Lead Engineer"
year: "2026"
problem: "Retrofitting internationalization into an existing React app by hand takes weeks, yet naive regex or raw LLM scripts silently break production code. They corrupt nested JSX, drop interpolation variables, and translate string literals that double as internal state keys."
result: "Built a 3-phase Babel AST + LLM CLI pipeline with an interactive review queue for ambiguous strings, atomic rollback on Ctrl+C, and 218 passing Vitest tests across 30 suites."
myPart: "I designed and implemented the Babel AST extractor and codemod injector, pluggable LLM provider adapters (Gemini, OpenAI, DeepL, Ollama), pseudo-localization verifier, and interactive review CLI."
relatedPosts: ["typescript-generics"]
nextProject: "homelab"
---

### The 3-Phase AST → LLM → AST Pipeline

The core rule behind `i18n-cli` is simple: **never let an LLM rewrite source code directly**. LLMs are great at translating natural language with context, while an Abstract Syntax Tree (AST) compiler is deterministic at editing JSX and TypeScript.

```mermaid
flowchart LR
  TSX["React TSX Files"] --> Extract["1. Babel AST Extract"]
  Extract --> Ambig{"Ambiguous?"}
  Ambig -->|Yes| Queue["i18n-review.json"]
  Ambig -->|No| LLM["2. LLM Translate"]
  LLM --> Codemod["3. AST Codemod"]
  Codemod --> Verify["Round-Trip Verify & Write"]
```

1. **Extract (`@babel/parser` + `@babel/traverse`):** Walks every TSX file and collects only user-visible JSX text, attributes (`aria-label`, `placeholder`, `title`), and template literals—ignoring object keys, imports, and type unions.
2. **Translate (Pluggable Providers):** Sends extracted strings with surrounding component context, sibling labels, and masked interpolation tokens (`{{count}}`) to Google Gemini, OpenAI, DeepL, or a local Ollama model.
3. **Rewrite (Deterministic Codemod):** Injects `useTranslation()`, replaces literals with `t('key')` calls, and preserves the repository's Prettier formatting.

---

### Solving the Dual-Use String Trap

In real React codebases, strings frequently pull double duty as both UI labels and internal logic comparisons:

```tsx
// "Dar es Salaam" is both a visible chip and a state filter key
const filtered = listings.filter((item) => item.city === selectedCity)
return <button onClick={() => setSelectedCity("Dar es Salaam")}>Dar es Salaam</button>
```

Translating the string inside `setSelectedCity(...)` silently breaks filtering in every non-English locale. Whenever the AST analyzer detects a literal used in a state setter, equality check, or object lookup, it refuses to guess and routes that entry to `i18n-review.json` for a quick human confirmation.

---

### Verification Gates & Atomic Rollbacks

Before any file is modified on disk, `i18n-cli` runs two checks:
- **AST round-trip verification:** Re-parses every generated file with Babel to guarantee zero syntax regressions or dropped interpolation variables.
- **Pseudo-localization mode:** Replaces strings with accented, expanded text (`[~Hëllö Wörld~]`) so teams can spot layout clipping and hardcoded concatenations before spending money on LLM translation tokens.

All transformed files are written into a temporary staging buffer first. If the developer hits `Ctrl+C` (`SIGINT`) or a provider call fails mid-run (`SIGTERM`), the signal handler restores every original file atomically so the working tree is never left half-migrated.
