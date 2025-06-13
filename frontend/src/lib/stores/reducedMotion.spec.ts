import { describe, it, expect, vi } from 'vitest';
import { reducedMotion, motionNoticeVisible } from './reducedMotion';
import * as device from '../utils/device';

/**
 * ! Utilidad para obtener el valor actual de un store Svelte.
 * Se suscribe y desuscribe inmediatamente para obtener el valor sincronamente.
 * @param store - Store de Svelte
 * @returns Valor actual del store
 */

function getValue(store: any) {
    let value: any;
    const unsubscribe = store.subscribe((v: any) => (value = v));
    unsubscribe();
    return value;
}

/**
 * ! Test para el store reducedMotion y su integración con motionNoticeVisible.
 *
 * - Verifica que en dispositivos de bajo rendimiento se active la reducción de animaciones
 *   y se muestre el aviso correspondiente.
 * - Verifica que al cambiar el valor del store se actualice la clase en <html>.
 * - Verifica que el aviso no se oculte al cambiar la preferencia de animaciones.
 */

describe('reducedMotion store', () => {
    // Simula un dispositivo de bajo rendimiento y verifica el comportamiento esperado
    it('activates and shows notice on low-end device', () => {
        vi.spyOn(device, 'isLowEndDevice').mockReturnValue(true);
        const html = document.documentElement;
        html.classList.remove('reduced-motion');

        const val = getValue(reducedMotion);
        expect(val).toBe(true); // reducedMotion debe estar activo
        expect(getValue(motionNoticeVisible)).toBe(true); // El aviso debe mostrarse
        expect(html.classList.contains('reduced-motion')).toBe(true); // La clase debe estar en <html>
    });

    // Verifica que al cambiar el store se actualice la clase en <html>
    it('toggle updates class', () => {
        reducedMotion.set(false);
        expect(document.documentElement.classList.contains('reduced-motion')).toBe(false);
    });

    // Verifica que el aviso no se oculte al cambiar la preferencia de animaciones
    it('does not hide notice when toggling', () => {
        motionNoticeVisible.set(true);
        reducedMotion.set(false);
        expect(getValue(motionNoticeVisible)).toBe(true);
    });
});
