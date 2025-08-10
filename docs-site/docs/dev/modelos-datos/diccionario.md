---
title: Diccionario de datos
---

> **Propósito**: Ser la **fuente de verdad** de campos, tipos, validaciones y ejemplos.  
> Si un campo no está acá, no existe en el contrato.

### Proyecto
| Campo       | Tipo      | Nulo | Fuente  | Validaciones                                | Ejemplo                |
| ----------- | --------- | ---- | ------- | ------------------------------------------- | ---------------------- |
| id          | uuid (PK) | no   | DB      | formato UUID                                | `9c3f…`                |
| titulo      | string    | no   | usuario | 3..120 chars                                | "Cocinas para escuela" |
| estado      | enum      | no   | sistema | `Abierto` \| `En ejecución` \| `Finalizado` | `Abierto`              |
| fechaInicio | date      | sí   | usuario | ISO 8601                                    | `2025-08-10`           |
| fechaCierre | date      | sí   | usuario | >= `fechaInicio`                            | `2025-09-30`           |
| provincia   | string    | sí   | usuario | lista estandarizada                         | "Santa Fe"             |

### Evidencia
| Campo | Tipo | Nulo | Fuente  | Validaciones                | Ejemplo                |
| ----- | ---- | ---- | ------- | --------------------------- | ---------------------- |
| id    | uuid | no   | DB      | UUID                        | `af1…`                 |
| tipo  | enum | no   | usuario | `foto` \| `doc` \| `recibo` | `recibo`               |
| url   | url  | no   | sistema | https, accesible            | `https://…/recibo.pdf` |
| hash  | str  | sí   | sistema | sha256 si aplica            | `a9b…`                 |

> **Nota**: la columna *Fuente* indica quién provee el dato (usuario, sistema, DB) y la validación que aplica (front/back).
