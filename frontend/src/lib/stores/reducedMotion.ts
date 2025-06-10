import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { isLowEndDevice } from '../utils/device';

/**
 * DECISIÓN DE DISEÑO:
 * Cambiamos a `writable` para permitir que el usuario modifique la preferencia
 * y persistimos el valor en `localStorage`.
 */

// -* Indica si la reducción se activó automáticamente por el dispositivo *-
export const autoReducedMotion = writable(false);

function createReducedMotion() {
    const store = writable(false);

    if (browser) {
        const stored = localStorage.getItem('reducedMotion');
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const auto = stored === null && isLowEndDevice();
        autoReducedMotion.set(auto);

        const initial = stored !== null ? JSON.parse(stored) : query.matches || auto;
        document.documentElement.classList.toggle('reduced-motion', initial);
        store.set(initial);

        const handler = (e: MediaQueryListEvent) => {
            if (stored === null) {
                const val = e.matches || isLowEndDevice();
                document.documentElement.classList.toggle('reduced-motion', val);
                store.set(val);
                autoReducedMotion.set(isLowEndDevice());
            }
        };
        query.addEventListener('change', handler);
    }

    function set(value: boolean) {
        store.set(value);
        if (browser) {
            localStorage.setItem('reducedMotion', JSON.stringify(value));
            document.documentElement.classList.toggle('reduced-motion', value);
            autoReducedMotion.set(false);
        }
    }

    function toggle() {
        set(!get(store));
    }

    return { subscribe: store.subscribe, set, toggle };
}

export const reducedMotion = createReducedMotion();

// -* Indica si el aviso de animaciones debería mostrarse *-
export const motionNoticeVisible = writable(false);
if (browser) {
    const hidden = localStorage.getItem('hideMotionNotice') === '1';
    motionNoticeVisible.set(hidden ? false : get(autoReducedMotion));

    // * Muestra el aviso solo cuando el dispositivo lo solicita
    autoReducedMotion.subscribe((auto) => {
        if (!hidden && auto) motionNoticeVisible.set(true);
    });
}

