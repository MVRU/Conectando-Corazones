import { writable, derived, type Writable } from 'svelte/store';
export type TipoModalPerfil = 'edicion' | 'resena' | 'categorias' | 'tiposParticipacion';

export interface PerfilModalesState {
	edicion: boolean;
	resena: boolean;
	categorias: boolean;
	tiposParticipacion: boolean;
}

export function usePerfilModales() {
	// Estado inicial: todos los modales cerrados
	const estadoInicial: PerfilModalesState = {
		edicion: false,
		resena: false,
		categorias: false,
		tiposParticipacion: false
	};

	// Store principal
	const state: Writable<PerfilModalesState> = writable(estadoInicial);

	function abrir(tipo: TipoModalPerfil): void {
		state.update((s) => ({ ...s, [tipo]: true }));
	}

	function cerrar(tipo: TipoModalPerfil): void {
		state.update((s) => ({ ...s, [tipo]: false }));
	}

	/**
	 * Alterna el estado de un modal (abierto ↔ cerrado)
	 */
	function toggle(tipo: TipoModalPerfil): void {
		state.update((s) => ({ ...s, [tipo]: !s[tipo] }));
	}

	function cerrarTodos(): void {
		state.set(estadoInicial);
	}

	const algunoAbierto = derived(state, ($state) => Object.values($state).some((isOpen) => isOpen));

	// Stores derivados individuales para facilitar binding con componentes
	const edicion = derived(state, ($state) => $state.edicion);
	const resena = derived(state, ($state) => $state.resena);
	const categorias = derived(state, ($state) => $state.categorias);
	const tiposParticipacion = derived(state, ($state) => $state.tiposParticipacion);

	return {
		subscribe: state.subscribe,

		edicion,
		resena,
		categorias,
		tiposParticipacion,

		algunoAbierto,

		// Acciones
		abrir,
		cerrar,
		toggle,
		cerrarTodos
	};
}
