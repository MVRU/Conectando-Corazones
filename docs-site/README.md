# Sitio de documentación

Este sitio utiliza [Docusaurus](https://docusaurus.io/) para generar páginas estáticas.

## Requisitos

- Node.js ≥ 18
- npm

## Instalación de dependencias

```bash
npm install
```

## Desarrollo local

```bash
npm start
```

Abre un servidor de desarrollo con recarga en caliente.

## Despliegue

Antes de desplegar, definí las variables para GitHub Pages:

```bash
export GIT_USER=tu_usuario         # -*- reemplazá con tu usuario de GitHub
# o
export USE_SSH=true                # -*- habilitá despliegue mediante SSH
```

Si el sitio se sirve desde un subdirectorio, ajustá `baseUrl` en `docusaurus.config.ts` (por defecto `/`).

```bash
npm run deploy
```

## Contribuir a la documentación

1. Editá o agregá archivos en la carpeta [`docs-site`](../docs-site).
2. Previsualizá los cambios con `npm start`.
3. Seguí el proceso para documentación descripto en la [guía de contribución](../CONTRIBUTING.md) antes de abrir un Pull Request.

## Documentación general

La documentación completa del proyecto se encuentra en la carpeta [`docs-site`](../docs-site).