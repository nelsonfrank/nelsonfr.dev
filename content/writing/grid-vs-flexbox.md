---
title: "CSS Grid vs Flexbox: When To Use Each"
excerpt: "A practical guide to understanding the differences between CSS Grid and Flexbox, with real-world examples and use cases."
date: "June 18, 2024"
readTime: "6 min read"
tags: ["CSS", "Fundamentals", "Layout"]
---

CSS Grid and Flexbox are both powerful layout systems, and they're designed to complement each other — not compete. The confusion usually comes from trying to use one for everything. Once you understand what each is optimized for, choosing becomes natural.

## The Core Distinction

- **Flexbox** is one-dimensional — it lays items out along a single axis (row or column).
- **Grid** is two-dimensional — it controls both rows and columns simultaneously.

> **Tip:** A simple rule: if you're thinking about items in a line, use Flexbox. If you're thinking about a grid of rows and columns, use Grid.

## When to Use Flexbox

Flexbox excels at distributing space among items in a single direction and aligning them within a container. It's the right tool for:

- Navigation bars (horizontal list of links)
- Button groups and toolbars
- Centering a single element (the classic use case)
- Card footers that push content to opposite ends
- Any UI where item count is dynamic and you want items to flow naturally

```css
/* Classic flex centering */
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Space-between nav */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
```

## When to Use Grid

Grid is purpose-built for two-dimensional layouts — placing items in both rows and columns at once. It shines for:

- Page-level layouts (header, sidebar, main, footer)
- Card grids and image galleries
- Dashboard layouts with complex placement
- Any layout where you need items to align across both axes

```css
/* Classic 3-column card grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Named areas for page layout */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
```

## They Work Together

The most maintainable layouts use both. Use Grid for the macro layout (overall page structure) and Flexbox for the micro layout (components within those grid areas).

```css
/* Grid for overall structure */
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
}

/* Flexbox inside a grid cell */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
```

## Quick Reference

- Nav bar → Flexbox (`row`, `space-between`)
- Card grid → Grid (`auto-fill`, `minmax`)
- Page shell → Grid (named areas or template columns)
- Button inside a card → Flexbox (`align-items`, `gap`)
- Centered modal → Grid or Flexbox (both work equally well)
