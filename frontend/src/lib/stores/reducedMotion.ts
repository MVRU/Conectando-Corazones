import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { isLowEndDevice } from '../utils/device';

// * Indica si la reducción se activó automáticamente por el dispositivo
export const autoReducedMotion = writable(false);

// * Indica si el aviso de animaciones debería mostrarse
export const motionNoticeVisible = writable(false);

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

        // Mostrar aviso si el dispositivo es lento o el sistema tiene preferencia reducida
        if (isLowEndDevice() || query.matches) {
            motionNoticeVisible.set(true);
        }

        // Escuchar cambios en la preferencia del sistema
        const handler = (e: MediaQueryListEvent) => {
            if (stored === null) {
                const val = e.matches || isLowEndDevice();
                document.documentElement.classList.toggle('reduced-motion', val);
                store.set(val);
                autoReducedMotion.set(isLowEndDevice());
                if (isLowEndDevice() || e.matches) {
                    motionNoticeVisible.set(true);
                }
            }
        };

        query.addEventListener('change', handler);
    }

    function set(value: boolean) {
        store.set(value);
        if (browser) {
            document.documentElement.classList.toggle('reduced-motion', value);
            localStorage.setItem('reducedMotion', JSON.stringify(value));
            autoReducedMotion.set(false); // el usuario hizo override

            // El aviso solo se oculta si el dispositivo no es lento y no hay preferencia del sistema
            if (!isLowEndDevice() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                motionNoticeVisible.set(value);
            } else {
                motionNoticeVisible.set(true); // se mantiene visible aunque se activen las animaciones
            }
        }
    }

    function toggle() {
        set(!get(store));
    }

    return {
        subscribe: store.subscribe,
        set,
        toggle
    };
}

export const reducedMotion = createReducedMotion();