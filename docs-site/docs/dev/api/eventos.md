
## `dev/api/eventos.md`
```md
---
title: Eventos y auditoría
---

Definiciones de eventos de dominio y logs de auditoría.

| Evento                     | Emisor   | Payload clave                                 | Persistencia |
| -------------------------- | -------- | --------------------------------------------- | ------------ |
| `proyecto.creado`          | API      | `proyectoId`, `titulo`, `institucion`         | sí           |
| `evidencia.subida`         | Frontend | `proyectoId`, `tipo`, `url`, `hash`           | sí           |
| `proyecto.estado.cambiado` | Backend  | `proyectoId`, `estadoAnterior`, `estadoNuevo` | sí           |

Convención de nombres: `<agregado>.<verbo>` y payloads **inmutables**.
