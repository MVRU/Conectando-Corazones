# Estructura de Carpetas del Frontend (SvelteKit)

Este documento describe la organización de carpetas y archivos del proyecto frontend, realizado con **SvelteKit**, **TypeScript** y **Tailwind CSS**.

## Visión General

El proyecto sigue la estructura estándar de una aplicación SvelteKit moderna, aprovechando el enrutamiento basado en archivos y el directorio `$lib` para código compartido.

## Estructura de Raíz (`frontend/`)

En la raíz del directorio `frontend` se encuentran los archivos de configuración del entorno de desarrollo y dependencias:

- **Archivos de Configuración**:
  - `svelte.config.js`: Configuración de SvelteKit (adaptadores, preprocesadores).
  - `vite.config.ts`: Configuración de Vite (plugins, alias).
  - `tailwind.config.ts` / `postcss.config.js` (si existen explícitamente) o configuración integrada via plugin de Vite (como `@tailwindcss/vite`).
  - `tsconfig.json`: Configuración de TypeScript.
  - `playwright.config.ts`: Configuración para tests end-to-end.
  - `vitest.config.ts`: Configuración para tests unitarios.

- **Directorios Base**:
  - `src/`: Código fuente de la aplicación.
  - `static/`: Archivos estáticos públicos (imágenes, favicon, etc.) que se sirven tal cual en la raíz.
  - `tests/`: Tests end-to-end con Playwright.
  - `node_modules/`: Dependencias instaladas.

## Directorio `src/`

Es el núcleo de la aplicación.

### `routes/` (Enrutamiento)
SvelteKit utiliza un sistema de **enrutamiento basado en el sistema de archivos**. Cada carpeta dentro de `routes/` corresponde a una ruta en la URL de la aplicación.

- **Archivos Especiales**:
  - `+page.svelte`: Define la vista principal de una ruta.
  - `+layout.svelte`: Define un layout o plantilla que envuelve a las páginas hijas.
  - `+error.svelte`: Página de error personalizada para esa ruta y sus hijas.
  - `+server.ts` / `+page.server.ts`: Endpoints o lógica de servidor (carga de datos, acciones de formulario).

- **Estructura Observada**: 
  - Las rutas están organizadas semánticamente (ej: `about`, `contact`, `login`, `proyectos`).
  - Existen carpetas para funcionalidades específicas como `dashboard`, `mi-panel`, y `api` (probablemente para endpoints internos).

### `lib/` (Código Compartido - Alias `$lib`)
Este directorio contiene todo el código reutilizable que se puede importar en cualquier parte de la aplicación usando el alias `$lib`.

La estructura interna de `lib` sigue una organización clara:

- **`components/`**: Componentes de UI reutilizables.
  - **Organización por Dominio**: Los componentes parecen estar agrupados por la página o funcionalidad a la que pertenecen (ej: `home/`, `proyectos/`, `registro/`).
  - **`ui/`**: Probablemente contiene componentes base genéricos (botones, inputs, cards) independientes del dominio.
  - **`layout/`**: Componentes estructurales (Header, Footer).
- **`stores/`**: Manejo de estado global de Svelte (Svelte Stores).
- **`utils/`**: Funciones de utilidad y helpers.
- **`types/`**: Definiciones de tipos TypeScript e interfaces compartidas.
- **`services/`**: Lógica para interactuar con APIs externas o servicios.
- **`mocks/`**: Datos de prueba (mock data) utilizados para desarrollo sin backend o testing.
- **`actions/`**: Acciones de Svelte (use:action).
- **`composables/`**: Lógica reactiva reutilizable (posiblemente siguiendo patrones tipo hooks).
- **`assets/`**: Recursos estáticos importables desde código.

### `static/`
Archivos que se sirven públicamente sin procesamiento de compilación (imágenes, logos, etc.).
- `img/`: Imágenes del sitio.
- `evidencias/`, `instituciones/`, `team/`: Subcarpetas organizadas para tipos específicos de imágenes.

## Convenciones Identificadas

1.  **Componentes por Funcionalidad**: En lugar de tener una carpeta plana de componentes, se agrupan según la vista o entidad principal (`lib/components/home`, `lib/components/proyectos`), lo que facilita la mantenibilidad.
2.  **Separación de UI y Lógica**:
    - La UI reside en `routes` y `lib/components`.
    - La lógica de negocio y estado se extrae a `lib/stores`, `lib/utils` y `lib/services`.
    - Los tipos se centralizan en `lib/types`.
3.  **Uso de TypeScript**: Todo el proyecto utiliza `.ts` y `.svelte` con `<script lang="ts">`, asegurando tipado estático.
4.  **Estilos**: Se utiliza Tailwind CSS para estilizado utilitario, integrándose con el sistema de componentes.
