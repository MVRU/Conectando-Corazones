// place files you want to import through the `$lib` alias in this folder.

// Componentes de UI
export { default as Badge } from './components/ui/elements/Badge.svelte';
export { default as Button } from './components/ui/elements/Button.svelte';
export { default as Select } from './components/ui/elements/Select.svelte';
export { default as ProjectCard } from './components/ui/cards/ProjectCard.svelte';
export { default as Breadcrumbs } from './components/ui/navigation/Breadcrumbs.svelte';

// Componentes de páginas
export { default as Projects } from './components/projects/Projects.svelte';

// Reexport your entry components here
export { default as Image } from './components/ui/elements/Image.svelte';

export { default as Header } from './components/layout/Header.svelte';
export { default as Footer } from './components/layout/Footer.svelte';

export { default as Ticker } from './components/visual/Ticker.svelte';
export { default as MotionNotice } from './components/feedback/MotionNotice.svelte';

// Export stores y utilidades
export * from './stores/breadcrumbs';
export * from './stores/reducedMotion';
export * from './stores/auth';
export * from './actions/inView';
export * from './utils/device';
export * from './mocks/mock-projects';

// Export modelos
export * from './types/User';
