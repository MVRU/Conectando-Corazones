import { MockProyectoRepository } from '$lib/infrastructure/repositories/mock/MockProyectoRepository';
import { ObtenerProyectosPerfil } from '$lib/domain/use-cases/perfil/ObtenerProyectosPerfil';
import type { Proyecto } from '$lib/domain/types/Proyecto';

// Inyeccion de dependencias manual
const proyectoRepo = new MockProyectoRepository();
const obtenerProyectosUC = new ObtenerProyectosPerfil(proyectoRepo);

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
	}
};
