---
title: Arquitectura
---

## Vista general
- Frontend: **SvelteKit 5 + Tailwind 4.7.1** (sin directivas `@`).
- Backend: **Node.js, Express, TypeScript**, **Prisma ORM** con **PostgreSQL (Render)**.
- Auth/Infra: Firebase (auth), Axios, Vitest/Playwright/Supertest.

<!-- * Se agrega leyenda y enlaces para clarificar componentes externos. -->

```mermaid
flowchart LR
  A[Cliente (Web)] -->|HTTP/JSON| B[API Express]
  B --> C[(PostgreSQL en Render)]
  B --> D[Servicios externos / APIs oficiales]
  B --> E[(Firebase Storage)]
```

### Leyenda
- **Cliente (Web):** interfaz desarrollada con SvelteKit y Tailwind.
- **API Express:** capa de servicios en Node/Express.
- **PostgreSQL en Render:** base de datos gestionada en [Render](https://render.com/).
- **Firebase Storage:** almacenamiento de evidencia en [Firebase](https://firebase.google.com/).
- **Servicios externos / APIs oficiales:** fuentes de datos de terceros.