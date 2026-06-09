---
title: "Get Started On GraphQL Query And Mutation"
excerpt: "Learn the fundamentals of GraphQL queries and mutations. A comprehensive guide to getting started with GraphQL in your projects."
date: "April 8, 2023"
readTime: "8 min read"
tags: ["API", "GraphQL", "Fundamentals"]
---

GraphQL has rapidly become one of the most popular API query languages, giving clients the power to ask for exactly what they need — nothing more, nothing less. If you're coming from a REST background, the mental shift can feel steep at first, but once it clicks, you won't want to go back.

## What is a GraphQL Query?

A query is how you fetch data in GraphQL. Unlike REST where different endpoints return fixed shapes of data, a query lets you describe the exact shape of the response you want. The server then resolves only the fields you requested.

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    posts {
      title
      publishedAt
    }
  }
}
```

> **Tip:** Always name your operations (e.g. `GetUser`) — it makes debugging in Apollo Studio and server logs dramatically easier.

## What is a Mutation?

While queries are read-only, mutations are how you write data. They follow the same syntax but signal to the server that a side-effect is intended — creating, updating, or deleting records.

```graphql
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    createdAt
  }
}
```

## Variables

Hard-coding values into a query string is an antipattern. Variables keep queries clean and reusable. Pass them as a separate JSON object alongside the query.

```json
{
  "input": {
    "title": "Hello GraphQL",
    "body": "This is my first GraphQL-powered post.",
    "authorId": "usr_abc123"
  }
}
```

## Sending Requests from the Client

GraphQL runs over a single HTTP endpoint (usually `/graphql`) using POST. You can use any HTTP client, but libraries like Apollo Client and urql add caching, reactive updates, and error handling out of the box.

```typescript
// Using fetch directly
const response = await fetch("/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: `
      query GetUser($id: ID!) {
        user(id: $id) { id name email }
      }
    `,
    variables: { id: "usr_abc123" },
  }),
})

const { data, errors } = await response.json()
```

> **Warning:** Always check for the `errors` array in the response. GraphQL can return a 200 status with partial data and errors simultaneously.

## Key Takeaways

- Queries fetch data; mutations write it — both use the same syntax
- Always use named operations and variables
- GraphQL runs over a single POST endpoint
- Client libraries (Apollo, urql) add caching and reactive updates
- Always handle the `errors` array even on HTTP 200 responses

This is just the beginning. Once you're comfortable with queries and mutations, explore subscriptions for real-time data, fragments for reusable field sets, and directives for conditional field inclusion.
