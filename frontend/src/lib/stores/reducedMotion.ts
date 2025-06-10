import { readable } from 'svelte/store';
import { browser } from '$app/environment';
import { isLowEndDevice } from '../utils/device';

/**
 * Indica si el usuario prefiere reducir las animaciones
 * y sirve para desactivar efectos pesados en dispositivos con poca potencia.
 */
export const reducedMotion = readable(false, (set) => {
    if (!browser) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    const evaluate = (matches: boolean) => {
        const value = matches || isLowEndDevice();
        document.documentElement.classList.toggle('reduced-motion', value);
        set(value);
    };

    evaluate(query.matches);
    const handler = (e: MediaQueryListEvent) => evaluate(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
});

