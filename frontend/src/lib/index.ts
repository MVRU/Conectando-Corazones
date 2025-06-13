// place files you want to import through the `$lib` alias in this folder.

// Componentes de UI
export { default as Badge } from './components/ui/Badge.svelte';
export { default as Button } from './components/ui/Button.svelte';
export { default as ProjectCard } from './components/ui/ProjectCard.svelte';
export { default as Breadcrumbs } from './components/ui/Breadcrumbs.svelte';

// Componentes de secciones
export { default as Projects } from './components/sections/Projects.svelte';

// Reexport your entry components here
export { default as Image } from './components/ui/Image.svelte';

export { default as Header } from './components/layout/Header.svelte';
export { default as Footer } from './components/layout/Footer.svelte';

export { default as Ticker } from './components/visual/Ticker.svelte';
export { default as MotionNotice } from './components/ui/MotionNotice.svelte';

// Export stores y utilidades
export * from './stores/breadcrumbs';
export * from './stores/reducedMotion';
export * from './actions/inView';
export * from './utils/device';