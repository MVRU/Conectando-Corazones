import { render } from '@testing-library/svelte';
import type { ComponentProps, SvelteComponent } from 'svelte';

/**
 * Wrapper personalizado para render de Svelte Testing Library
 * con configuración común para todos los tests de componentes
 */
export function renderComponent<T extends SvelteComponent>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: any,
    props?: ComponentProps<T>
) {
    return render(component, { props });
}

/**
 * Helper para esperar a que se resuelvan todas las promesas pendientes
 * Útil para tests asíncronos
 */
export async function flushPromises() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Helper para esperar un tiempo específico
 * @param ms Milisegundos a esperar
 */
export async function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Re-exportar utilidades comunes de testing-library
 * para tener un único punto de importación
 */
export { screen, fireEvent, waitFor } from '@testing-library/svelte';
