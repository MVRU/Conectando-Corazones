import type { Proyecto } from '$lib/domain/types/Proyecto';
import type { Resena } from '$lib/domain/types/Resena';
import type { Localidad } from '$lib/domain/types/Localidad';
import { mockProyectos } from '$lib/mocks/mock-proyectos';
import { mockTestimonios } from '$lib/mocks/mock-testimonios';
import { mockResenas } from '$lib/mocks/mock-resenas';
import { mockLocalidades } from '$lib/mocks/mock-localidades';
import { filtrarResenasPorTipo } from '$lib/utils/resenas';
import { writable } from 'svelte/store';

const resenasStore = writable<Resena[]>([...mockTestimonios, ...mockResenas]);

export const perfilService = {
	obtenerProyectosUsuario(idUsuario: number | undefined, rol: string): Proyecto[] {
		if (!idUsuario) return [];

		if (rol === 'institucion') {
			return mockProyectos.filter((p) => p.institucion_id === idUsuario);
		}

		return mockProyectos.filter((p) =>
			p.colaboraciones?.some((c) => c.colaborador_id === idUsuario && c.estado === 'aprobada')
		);
	},

	filtrarProyectosPorEstado(proyectos: Proyecto[], estado: string): Proyecto[] {
		return proyectos.filter((p) => p.estado === estado);
	},

	obtenerResenasStore() {
		return resenasStore;
	},

	obtenerResenasUsuario(idUsuario: number | undefined, resenas: Resena[]): Resena[] {
		if (!idUsuario) return [];
		return filtrarResenasPorTipo(resenas, 'usuario', idUsuario);
	},

	yaResenoUsuario(
		username: string,
		idUsuarioResenado: number | undefined,
		resenas: Resena[]
	): boolean {
		if (!username || !idUsuarioResenado) return false;

		const resenasDelUsuario = resenas.filter(
			(r) =>
				r.tipo_objeto === 'usuario' && r.id_objeto === idUsuarioResenado && r.username === username
		);

		return resenasDelUsuario.length > 0;
	},

	obtenerLocalidadesPorProvincia(idProvincia: number | undefined): Localidad[] {
		if (idProvincia === undefined) return [];
		return mockLocalidades.filter((l) => l.id_provincia === idProvincia);
	},

	obtenerLocalidadPorId(idLocalidad: number | undefined): Localidad | undefined {
		if (!idLocalidad) return undefined;
		return mockLocalidades.find((l) => l.id_localidad === idLocalidad);
	},

	/**
	 * Agrega una nueva reseña al store
	 */
	agregarResena(resena: Omit<Resena, 'id_resena'>): Resena {
		const nuevaResena: Resena = {
			...resena,
			id_resena: Date.now(),
			aprobado: true
		};

		// Actualiza el store
		resenasStore.update((resenas) => [...resenas, nuevaResena]);

		return nuevaResena;
	},

	obtenerTodosLosProyectos(): Proyecto[] {
		return mockProyectos;
	}
};
