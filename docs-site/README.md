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

## Pruebas locales de la versión estática

Para validar el resultado final antes de publicar:

```bash
npm run build
npm run serve
```

El primer comando genera los archivos estáticos y el segundo los sirve en un servidor local para comprobación.

## Traducciones (i18n)

```bash
npm run write-translations
```

El contenido fuente está en español. El comando anterior extrae las cadenas a `i18n/<idioma>` para que puedan traducirse y versionarse.

## Contribuir a la documentación

1. Editá o agregá archivos en la carpeta [`docs-site`](../docs-site).
2. Previsualizá los cambios con `npm start`.
3. Revisá la [guía de contribución para documentación](../CONTRIBUTING.md#documentacion) antes de abrir un Pull Request.

## Documentación general

La documentación completa del proyecto se encuentra en la carpeta [`docs-site`](../docs-site).