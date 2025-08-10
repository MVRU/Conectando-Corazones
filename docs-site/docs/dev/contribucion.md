---
title: Contribución
---

<!-- * Guía para mantener consistencia y legibilidad en el código. -->

## Estilo de código

- Se aplica **SOLID**, **DRY** y **KISS** para favorecer la mantenibilidad.
- Se usan comentarios breves según [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments):
  - `// *` puntos clave o recordatorios.
  - `// TODO` tareas pendientes.
  - `// !` advertencias críticas.
  - `// ?` dudas o decisiones sujetas a revisión.
  - `// FIX` errores o inconsistencias a corregir.
- Se prefiere nombres semánticos y evitar comentarios obvios.

## Convenciones de commits

- Se siguen [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Mensajes en imperativo y breves (máx. 72 caracteres).
- Commits pequeños y enfocados.

## Flujo previo a un Pull Request

1. Asegurar que las dependencias estén instaladas en el paquete afectado.
2. Ejecutar linters y formateadores:
   - Backend: `cd backend && npm run lint`.
   - Frontend: `cd frontend && npm run lint`.
3. Ejecutar pruebas:
   - Backend: `cd backend && npm test`.
   - Frontend: `cd frontend && npm test`.
4. Verificar que los cambios estén cubiertos y que no existan errores.

## Documentación relacionada

- Consultá el archivo [CONTRIBUTING.md](https://github.com/MVRU/Conectando-Corazones/blob/main/CONTRIBUTING.md) para lineamientos generales.

<!-- -!- Actualizar estas instrucciones si se modifican los scripts de lint o test. -->