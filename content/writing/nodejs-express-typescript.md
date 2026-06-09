---
title: "A Step-By-Step Guide To Setting Up A Node.js And Express App With TypeScript"
excerpt: "Everything you need to know about setting up a modern Node.js and Express application with TypeScript, from scratch to production."
date: "January 27, 2024"
readTime: "12 min read"
tags: ["API", "Node.js", "TypeScript"]
---

TypeScript has become the de facto standard for serious Node.js projects. The type safety, IDE intelligence, and refactoring confidence it provides pay dividends at scale. This guide walks you from an empty directory to a running Express server with full TypeScript support.

## 1. Initialize the Project

```bash
mkdir my-api && cd my-api
npm init -y
npm install express
npm install -D typescript ts-node-dev @types/node @types/express
```

## 2. Configure TypeScript

Generate a `tsconfig.json` and tweak the key options for a Node.js backend:

```bash
npx tsc --init
```

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 3. Project Structure

- `src/index.ts` — entry point, creates and starts the server
- `src/app.ts` — Express app factory (easier to test in isolation)
- `src/routes/` — route handlers grouped by resource
- `src/middleware/` — auth, error handling, logging
- `src/types/` — shared TypeScript interfaces

## 4. The App Factory

```typescript
// src/app.ts
import express, { Application, Request, Response, NextFunction } from "express"

export function createApp(): Application {
  const app = express()

  app.use(express.json())

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", ts: new Date().toISOString() })
  })

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not found" })
  })

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack)
    res.status(500).json({ error: err.message })
  })

  return app
}
```

```typescript
// src/index.ts
import { createApp } from "./app"

const PORT = process.env.PORT ?? 3000
const app = createApp()

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

## 5. Dev & Build Scripts

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

> **Tip:** `ts-node-dev` uses esbuild under the hood, so reloads are near-instant — much faster than `ts-node` alone.

## 6. Environment Variables

Never hard-code secrets. Use `dotenv` for local dev and your deployment platform's secret manager in production:

```typescript
import "dotenv/config" // must be first import in index.ts

const PORT = process.env.PORT ?? 3000
const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error("DATABASE_URL is required")
```

> **Warning:** Throw early if required env vars are missing. Silent failures cause confusing runtime errors deep in your stack.

## Next Steps

- Add Zod for runtime request validation
- Set up Prisma or Drizzle for type-safe database access
- Add Jest + Supertest for integration tests
- Configure ESLint + Prettier for consistent code style
- Containerize with Docker for reproducible deployments
