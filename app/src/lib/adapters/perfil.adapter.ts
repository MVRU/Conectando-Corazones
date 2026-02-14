import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { LocalidadRepoPrisma } from '$lib/infrastructure/supabase/postgres/localidad.repo';
import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';
import { ObtenerProyectosPerfil } from '$lib/domain/use-cases/perfil/ObtenerProyectosPerfil';
import { ObtenerResenasPerfil } from '$lib/domain/use-cases/perfil/ObtenerResenasPerfil';
import { ObtenerLocalidades } from '$lib/domain/use-cases/ubicacion/ObtenerLocalidades';

import type { Proyecto } from '$lib/domain/entities/Proyecto';
import type { Resena } from '$lib/domain/types/Resena';
import type { Localidad } from '$lib/domain/types/Localidad';
import { writable } from 'svelte/store';

class StubResenaRepository implements ResenaRepository {
	async findAll(): Promise<Resena[]> {
		return [];
	}
	async findByUsuario(id: number): Promise<Resena[]> {
		return [];
	}
	async findByObjetoAprobadas(
		tipoObjeto: string,
		idObjeto: number,
		limite?: number
	): Promise<Resena[]> {
		return [];
	}
	async save(resena: Resena): Promise<Resena> {
		return resena;
	}
	async findById(id: number): Promise<Resena | null> {
		return null;
	}
	async delete(id: number): Promise<void> {
		return;
	}
}

// Inyeccion de dependencias manual
const proyectoRepo = new PostgresProyectoRepository();
const resenaRepo = new StubResenaRepository();
const localidadRepo = new LocalidadRepoPrisma();

const obtenerProyectosUC = new ObtenerProyectosPerfil(proyectoRepo);
const obtenerResenasUC = new ObtenerResenasPerfil(resenaRepo);
const obtenerLocalidadesUC = new ObtenerLocalidades(localidadRepo);

const _resenasStore = writable<Resena[]>([]);
resenaRepo.findAll().then((r) => _resenasStore.set(r));

export const perfilAdapter = {
	// --- Proyectos ---
	async obtenerProyectosUsuario(idUsuario: number | undefined, rol: string): Promise<Proyecto[]> {
		return obtenerProyectosUC.execute(idUsuario, rol);
	},

	filtrarProyectosPorEstado(proyectos: Proyecto[], estado: string): Proyecto[] {
		return proyectos.filter((p) => p.estado === estado);
	},

	obtenerTodosLosProyectos(): Promise<Proyecto[]> {
		return proyectoRepo.findAll();
	},

	// --- Reseñas ---
	obtenerResenasStore() {
		return _resenasStore;
	},

	async obtenerResenasUsuario(
		idUsuario: number | undefined,
		resenas?: Resena[]
	): Promise<Resena[]> {
		return obtenerResenasUC.execute(idUsuario);
	},

	async yaResenoUsuario(
		username: string,
		idUsuarioResenado: number | undefined,
		resenas?: Resena[]
	): Promise<boolean> {
		return obtenerResenasUC.yaReseno(username, idUsuarioResenado);
	},

	async agregarResena(resena: Omit<Resena, 'id_resena'>): Promise<Resena> {
		const nueva = { ...resena, id_resena: Date.now(), aprobado: true } as Resena;
		await resenaRepo.save(nueva);
		_resenasStore.update((curr) => [...curr, nueva]);
		return nueva;
	},

	// --- Localidades ---
	async obtenerLocalidadesPorProvincia(idProvincia: number | undefined): Promise<Localidad[]> {
		return obtenerLocalidadesUC.porProvincia(idProvincia);
	},

	async obtenerLocalidadPorId(idLocalidad: number | undefined): Promise<Localidad | null> {
		return obtenerLocalidadesUC.porId(idLocalidad);
	}
};
