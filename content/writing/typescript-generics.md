---
title: "Mastering TypeScript Generics"
excerpt: "Go beyond basic types. Learn how generics make your TypeScript code flexible, reusable, and fully type-safe."
date: "August 9, 2024"
readTime: "11 min read"
tags: ["TypeScript", "Fundamentals"]
---

Generics are the most powerful feature in TypeScript's type system, and also the most avoided. Once you get past the angle-bracket syntax anxiety, you'll find that generics let you write code that is simultaneously flexible and rigorously type-safe.

## The Problem Generics Solve

Without generics, you face a false choice: use `any` and lose all type safety, or write duplicated functions for each type you need to support.

```typescript
// ❌ Loses type information
function identity(value: any): any {
  return value
}
const result = identity(42) // result: any

// ✅ Preserves type information
function identity<T>(value: T): T {
  return value
}
const result = identity(42)        // result: number
const name   = identity("Nelson")  // name: string
```

## Generic Functions

The `T` is a type parameter — a placeholder that gets filled in by TypeScript at the call site, either inferred from the arguments or explicitly provided.

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

const num = first([1, 2, 3])        // T inferred as number
const str = first(["a", "b", "c"]) // T inferred as string
const explicit = first<boolean>([]) // T explicitly set
```

## Generic Constraints

Unbounded generics accept literally any type. Constraints narrow what `T` can be, which lets you safely access properties or call methods on it:

```typescript
// T must have a length property
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b
}

longest("hello", "hi")        // ✅ strings have .length
longest([1, 2, 3], [4, 5])    // ✅ arrays have .length
longest(10, 20)                // ❌ numbers don't have .length
```

## Generic Interfaces and Types

```typescript
// Generic API response wrapper
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// Type-safe usage
type UserResponse = ApiResponse<User>
type PostListResponse = ApiResponse<Post[]>

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}
```

## The keyof Operator with Generics

Combining generics with `keyof` lets you write functions that safely access object properties by key:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: "Nelson", age: 28, role: "engineer" }

const name = getProperty(user, "name") // string ✅
const age  = getProperty(user, "age")  // number ✅
const x    = getProperty(user, "foo")  // ❌ compile error — "foo" not a key
```

## Conditional Types

TypeScript's conditional types let you express type logic that depends on other types — essentially if/else at the type level:

```typescript
type IsArray<T> = T extends any[] ? "yes" : "no"

type A = IsArray<string[]>  // "yes"
type B = IsArray<number>    // "no"

// Practical example: unwrap a Promise
type Awaited<T> = T extends Promise<infer U> ? U : T

type Result = Awaited<Promise<User>>  // User
```

> **Tip:** The `infer` keyword inside conditional types lets you capture and name a type that TypeScript infers in that position — incredibly powerful for utility types.

## Where to Go Next

- Study TypeScript's built-in utility types (`Partial`, `Required`, `Pick`, `Omit`, `ReturnType`, `Parameters`)
- Explore mapped types for transforming object shapes
- Learn template literal types for string manipulation at the type level
- Practice by reading the type definitions of popular libraries (React, Zod, tRPC)
