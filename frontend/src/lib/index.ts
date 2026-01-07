// Componentes de UI
export { default as Badge } from './components/ui/elementos/Badge.svelte';
export { default as Button } from './components/ui/elementos/Button.svelte';
export { default as Select } from './components/ui/elementos/Select.svelte';
export { default as ProyectoCard } from './components/ui/cards/ProyectoCard.svelte';
export { default as Breadcrumbs } from './components/ui/navegacion/Breadcrumbs.svelte';
export { default as ModalReportarIrregularidad } from './components/ui/ModalReportarIrregularidad.svelte';

// Componentes de páginas
export { default as Proyectos } from './components/proyectos/Proyectos.svelte';

export { default as Image } from './components/ui/elementos/Image.svelte';

export { default as Header } from './components/layout/Header.svelte';
export { default as Footer } from './components/layout/Footer.svelte';

export { default as Ticker } from './components/visual/Ticker.svelte';
export { default as MotionNotice } from './components/feedback/MotionNotice.svelte';

// Stores y utilidades
export * from './stores/breadcrumbs';
export * from './stores/reducedMotion';
export * from './stores/auth';
export * from './actions/inView';
export * from './utils/device';
export * from './utils/sanitize';
export * from './mocks/mock-proyectos';
export * from './mocks/mock-proyecto-categorias';
export * from './mocks/mock-proyecto-ubicaciones';
export * from './mocks/mock-ubicaciones';

// Modelos
export * from './types/Usuario';
