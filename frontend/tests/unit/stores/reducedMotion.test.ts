import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import * as device from '$lib/utils/device';

// * Importación dinámica para aislar el estado del módulo en cada test
let reducedMotion: any;
let motionNoticeVisible: any;

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
	beforeEach(() => {
		vi.resetModules();
		localStorage.clear();
		document.documentElement.classList.remove('reduced-motion');
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	async function loadStores() {
		const mod = await import('$lib/stores/reducedMotion');
		reducedMotion = mod.reducedMotion;
		motionNoticeVisible = mod.motionNoticeVisible;
	}

	// Simula un dispositivo de bajo rendimiento y verifica el comportamiento esperado
	it('activates and shows notice on low-end device', async () => {
		vi.spyOn(device, 'isLowEndDevice').mockReturnValue(true);
		vi.spyOn(device, 'hasSlowConnection').mockReturnValue(false);
		const html = document.documentElement;
		await loadStores();

		const val = getValue(reducedMotion);
		expect(val).toBe(true); // reducedMotion debe estar activo
		expect(getValue(motionNoticeVisible)).toBe(true); // El aviso debe mostrarse
		expect(html.classList.contains('reduced-motion')).toBe(true); // La clase debe estar en <html>
	});

	// Verifica que al cambiar el store se actualice la clase en <html>
	it('toggle updates class', async () => {
		await loadStores();
		reducedMotion.set(false);
		expect(document.documentElement.classList.contains('reduced-motion')).toBe(false);
	});

	// Simula una conexión lenta y verifica que se active la reducción de animaciones
	it('activates on slow connection', async () => {
		vi.spyOn(device, 'isLowEndDevice').mockReturnValue(false);
		vi.spyOn(device, 'hasSlowConnection').mockReturnValue(true);
		document.documentElement.classList.remove('reduced-motion');
		await loadStores();

		const val = getValue(reducedMotion);
		expect(val).toBe(true);
		expect(document.documentElement.classList.contains('reduced-motion')).toBe(true);
	});

	// Verifica que el aviso no se oculte al cambiar la preferencia de animaciones
	it('does not hide notice when toggling', async () => {
		await loadStores();
		motionNoticeVisible.set(true);
		reducedMotion.set(false);
		expect(getValue(motionNoticeVisible)).toBe(true);
	});
});
