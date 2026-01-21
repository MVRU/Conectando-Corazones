import type { Resena } from '$lib/domain/types/Resena';
import { writable } from 'svelte/store';
import { mockTestimonios } from 'tests/mocks/mock-testimonios';
import { mockResenas } from 'tests/mocks/mock-resenas';

// Store global de reseñas
const resenasStore = writable<Resena[]>([...mockTestimonios, ...mockResenas]);

/**
 * Caso de uso: Agregar una nueva reseña
 * 
 * @param resena - Datos de la reseña (sin id_resena)
 * @returns La reseña creada con su ID
 * 
 * TODO: Reemplazar con llamada real a Supabase
 */
export function agregarResena(resena: Omit<Resena, 'id_resena'>): Resena {
	const nuevaResena: Resena = {
		...resena,
		id_resena: Date.now(),
		aprobado: true
	};

	// Actualiza el store
	resenasStore.update((resenas) => [...resenas, nuevaResena]);

	return nuevaResena;
}

/**
 * Obtener el store de reseñas
 */
export function obtenerResenasStore() {
	return resenasStore;
}
