---
title: "i18n-cli — AI-Native Localization Engine"
description: "An AI-native CLI pipeline that safely internationalizes React & TypeScript codebases through AST parsing, context-aware machine translation, and strict verification gates."
technologies: ["TypeScript", "Node.js", "Babel AST", "Gemini 3.8", "OpenAI", "react-i18next", "Vitest", "CLI"]
githubUrl: "https://github.com/nelsonfrank/i8n-automation-cli"
category: "Developer Tools"
# TODO(content): Fill in case-study metadata and TL;DR fields
role: ""
year: ""
problem: ""
result: ""
myPart: ""
relatedPosts: ["typescript-generics"]
nextProject: "homelab"
---

### Project Overview

**i18n-cli** is a production-grade, AI-native command-line pipeline engineered to safely internationalize existing React and TypeScript codebases. Built on the core principle of **correctness and honesty over coverage**, the engine replaces brittle regex search-and-replace patterns with deep Abstract Syntax Tree (AST) analysis, context-aware LLM translation, and multi-tier verification gates.

The tool extracts hardcoded UI strings, rewrites JSX to leverage `react-i18next` bundles, preserves template expressions and plurals, verifies syntax integrity with zero regressions, and automatically routes ambiguous strings to an interactive review queue.

---

### The Challenge

Automating codebase internationalization through naive regex or raw text LLM prompts leads to catastrophic, silent application breakage:

- **The Dual-Use Trap:** In JavaScript/TypeScript, string literals often serve dual roles simultaneously—acting as user-visible UI labels while also functioning as internal state comparison keys (e.g. `property.location === selectedCity`). Blindly translating state keys breaks filters, form validations, and conditional logic.
- **Dynamic JSX & Component Hierarchy:** Template literals with expressions, nested JSX tags, and ternary operators get corrupted when fed into isolated machine translation APIs without structural boundaries.
- **AI Hallucinations & Syntactic Drift:** Generic LLM rewrites often alter punctuation, drop interpolation variables (`{{count}}`), or introduce invalid TypeScript syntax that breaks compilation.

---

### Technical Architecture & Decisions

#### 1. Decoupled AST $\rightarrow$ AI $\rightarrow$ AST Pipeline
The architecture completely decouples code extraction and rewriting from language translation:
- **Phase 1 (AST Extraction):** Utilizing `@babel/parser` and `@babel/traverse`, the CLI parses JSX/TSX syntax trees to distinguish actual rendered UI text from object keys, imported constants, and variable identifiers.
- **Phase 2 (Context-Rich AI Translation):** Strings are extracted alongside surrounding structural metadata, component hierarchies, and sibling strings. The tool prompts LLM providers with strict structural schemas, glossary constraints, and variable masking rules.
- **Phase 3 (AST Codemod Generation):** Babel generator transforms the source file by injecting `useTranslation` hooks, replacing raw literals with `t('key')` calls, and formatting outputs to match existing project `.prettierrc` standards.

#### 2. Multi-Provider Translation Engine
`i18n-cli` incorporates a provider-agnostic translation layer supporting:
- **Google Gemini 3.8 Flash:** High-throughput, cost-effective structured output generation.
- **OpenAI (GPT-4o):** Multi-language semantic precision with structured outputs.
- **DeepL & Ollama:** Local and specialized machine translation for offline or privacy-compliant workflows.

#### 3. Multi-Tier Verification Gates & Review Queue
Before committing changes to disk, the pipeline enforces strict verification:
- **AST Round-Trip Validation:** Verifies that the transformed file parses without syntax or semantic errors.
- **Pseudo-Localization Stress Testing:** Replaces text with accented, extended characters (e.g. `[~Hëllö Wörld~]`) to test for layout clipping, string concatenation issues, and missing translations.
- **Review Queue Resolution:** When encountering ambiguous strings or dual-use variables, the CLI halts automatic transformation and writes to an interactive review queue (`i18n-review.json`) for explicit developer approval.

#### 4. Signal Safety & Atomic Rollbacks
To prevent partial file corruption if a process is interrupted (e.g., `Ctrl+C` or uncaught network failure), `i18n-cli` traps OS termination signals (`SIGINT`, `SIGTERM`). It writes outputs to a temporary staging buffer and executes an atomic rollback if any step fails.

---

### Key Features

- **AST-Powered Safety:** Precision extraction that ignores internal object keys, props, and business logic tokens.
- **Preserved Dynamic Interpolations:** Intelligently handles plurals, nested ternary expressions, and template literals into `react-i18next` parameters.
- **Zero-Regression Test Suite:** Over 218 passing automated tests across 30 test suites ensuring bulletproof transforms across edge cases.
- **Multi-Provider Flexibility:** Seamless switching between Gemini, OpenAI, DeepL, and local Ollama models.
- **Safe Review Queue & Rollbacks:** Transactional file writes with atomic signal rollback and an interactive CLI approval loop.
