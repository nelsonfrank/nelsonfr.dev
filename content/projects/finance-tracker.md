---
title: "Finance Tracker"
description: "Personal finance app with data visualization, interactive charts, and real-time tracking. Designed thoughtful UX for complex financial data exploration."
technologies: ["Next.js", "TypeScript", "shadcn/ui", "Recharts", "D3.js"]
githubUrl: "https://github.com/nelsonfrank/finance-tracker-monorepo"
category: "Open Source"
---

### Project Overview

**Finance Tracker** is a comprehensive personal wealth management application designed to help individuals monitor, categorize, and forecast their financial metrics in real-time. By connecting complex data aggregates with interactive, rich visualizations, users get deep insight into their spending, income, and savings dynamics.

---

### The Challenge

Modern financial dashboards are often overwhelming. Users face walls of numbers, poorly scaling charts, and complex setups. The goal of this project was to establish a premium, high-fidelity experience that simplifies complex balance tracking without sacrificing analytical depth.

Key difficulties included:
- Processing raw transactions efficiently on the client to avoid lag.
- Implementing responsive SVG layouts using D3.js and Recharts that look great on both 4K screens and mobile phones.
- Establishing client-side caching to ensure quick navigation between weekly, monthly, and yearly intervals.

---

### Technical Architecture & Decisions

#### 1. Next.js App Router & Server Components
Leveraging Next.js App Router allowed for critical performance gains. Heavy financial calculations and historical data processing are offloaded to Server Components, feeding clean, structured JSON payloads directly to client chart systems.

#### 2. D3.js & Recharts Core Integration
We combined the ease of **Recharts** for standard graphs with **D3.js**'s low-level layout algorithms (specifically for force-directed budget categories). This hybrid system renders complex relational diagrams while maintaining clean React state management.

#### 3. Client State Optimization
We used local memory caching for layout calculations, reducing unnecessary re-renders when toggling between chart representations (e.g. Pie charts vs. Area timelines).

---

### Key Features

- **Interactive Spending Timelines:** Multi-colored area charts featuring brush controls for scrolling through custom dates.
- **Categorization Hub:** Bubble chart groupings allowing users to see at a glance where most of their resources flow.
- **Real-Time Forecasting:** Linear regression algorithms projecting future net worth values based on average spending thresholds.
- **Dark Mode Optimization:** Custom custom CSS variables utilizing Tailwind HSL values for premium readability.
