---
title: "Stop Reaching for any: 5 TypeScript Generics Patterns You’ll Actually Use"
excerpt: "Stop reaching for any. Learn TypeScript generics with 5 practical patterns—constraints, API wrappers, keyof, and conditional types—you can use today."
date: "August 9, 2024"
readTime: "4 min read"
tags: ["TypeScript", "Fundamentals"]
project: "i8n-automation-cli"
---

You write a helper function, hit a wall of red squiggly lines, and slap `: any` on the parameter just to move on. We’ve all done it—and we’ve all paid for it later when a runtime bug slips past the compiler.

Most developers avoid **TypeScript generics** because the `<T>` syntax looks like academic type theory. In reality, it’s just a placeholder that lets one function work for many types without giving up type safety.

By the end of this post, you’ll have **5 practical generic patterns** you can drop into your codebase today—from safe array helpers and typed API responses to `keyof` lookups and conditional types.

## Why Generics Exist: Escaping the `any` Trap

Without generics, TypeScript forces a frustrating trade-off. You either use `any` and turn off type checking, or you duplicate the same function for `string`, `number`, and every custom type in your app.

Generics give you a third option: **write the logic once, and let TypeScript remember the exact type that went in.**

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

Think of `<T>` like a function parameter—except instead of passing a *value*, you’re passing a *type*.

## 1. Generic Functions: Let TypeScript Do the Inference

You rarely need to write `<string>` or `<number>` manually. When you define a generic function, TypeScript usually infers `T` automatically from the argument you pass in.

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

const num = first([1, 2, 3])        // T inferred as number
const str = first(["a", "b", "c"])  // T inferred as string
const explicit = first<boolean>([]) // T explicitly set when TypeScript can't guess
```

**Rule of thumb:** Let TypeScript infer `T` whenever possible. Only pass it explicitly (like `first<boolean>([])`) when the input doesn't give TypeScript enough information—such as an empty array.

## 2. Generic Constraints: Put Guardrails on `<T>`

By default, `<T>` accepts *literally anything*—a number, a boolean, `null`, an object. That means TypeScript won’t let you access `.length` or `.id` on `T`, because it can’t guarantee that property exists.

Use `extends` to set a minimum requirement for `T`:

```typescript
// T can be anything, as long as it has a .length property
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b
}

longest("hello", "hi")        // ✅ strings have .length
longest([1, 2, 3], [4, 5])    // ✅ arrays have .length
longest(10, 20)               // ❌ compile error — numbers don't have .length
```

**Why this matters:** Constraints give you flexibility *without* blind spots. You keep autocomplete and compile-time safety while still supporting multiple types.

## 3. Generic Interfaces: Build One API Wrapper for Every Endpoint

If you’ve ever written `UserApiResponse`, `PostApiResponse`, and `OrderApiResponse` with the exact same `status` and `message` fields, this pattern will immediately clean up your codebase.

Wrap the shared shape in a generic interface, and plug in the payload type per endpoint:

```typescript
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

type UserResponse = ApiResponse<User>
type PostListResponse = ApiResponse<Post[]>

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}
```

Change `ApiResponse<T>` once, and every endpoint in your app stays in sync.

<!-- TODO: Optional — add a 2-3 line real example of a generic helper or interface from i8n-automation-cli -->

## 4. `keyof` With Generics: Eliminate Typo Bugs in Object Lookups

Passing a property name as a plain `string` is a classic source of silent `undefined` bugs. Combining generics with `keyof` locks the key parameter to **only the keys that actually exist on that object**.

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: "Nelson", age: 28, role: "engineer" }

const name = getProperty(user, "name") // string ✅
const age  = getProperty(user, "age")  // number ✅
const x    = getProperty(user, "foo")  // ❌ compile error — "foo" isn't a key on user
```

Notice the return type `T[K]`: TypeScript doesn't just validate the key—it also knows `"name"` returns a `string` and `"age"` returns a `number`.

## 5. Conditional Types: Add `if / else` Logic at the Type Level

Once you're comfortable with `extends` in constraints, conditional types use the exact same syntax as a JavaScript ternary—just for types:

```typescript
type IsArray<T> = T extends any[] ? "yes" : "no"

type A = IsArray<string[]> // "yes"
type B = IsArray<number>   // "no"
```

Where this gets genuinely useful is pairing it with `infer` to **extract a type from inside another type**. For example, unwrapping whatever a `Promise` resolves to:

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

type Result = UnwrapPromise<Promise<User>> // User
```

> **Quick mental model for `infer`:** Read `Promise<infer U>` as: *"If `T` is a Promise, grab whatever type is inside it and call it `U`."*

*(Note: TypeScript ships a built-in `Awaited<T>` utility type that handles nested promises using this same idea.)*

## The Key Takeaway

Generics aren't about writing clever, unreadable types. They exist for one practical reason: **letting you write reusable code without ever falling back to `any`.**

Start small. Next time you’re about to type `any` on a helper function or API wrapper, swap it for `<T>` and add an `extends` constraint only if TypeScript asks for one.

### Want to Go Deeper?

Once these 5 patterns feel natural, explore these next:
1. Built-in utility types (`Partial`, `Required`, `Pick`, `Omit`, `ReturnType`, `Parameters`)
2. Mapped types for transforming object shapes
3. Template literal types for type-safe strings
4. Real-world type definitions in libraries you already use (React, Zod, tRPC)

**What’s the one TypeScript generics pattern—or error message—that still trips you up?** Reach out or share this with a teammate who still sneaks `any` into PRs.
