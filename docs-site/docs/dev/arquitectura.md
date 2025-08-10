---
title: Arquitectura
---

## Vista general
- Frontend: **SvelteKit 5 + Tailwind 4.7.1** (sin directivas `@`).
- Backend: **Node.js, Express, TypeScript**, **Prisma ORM** con **PostgreSQL (Render)**.
- Auth/Infra: Firebase (auth), Axios, Vitest/Playwright/Supertest.

```mermaid
flowchart LR
  A[Cliente (Web)] -->|HTTP/JSON| B[API Express]
  B --> C[(PostgreSQL)]
  B --> D[Servicios externos / APIs oficiales]
  B --> E[Storage de evidencia]
