// TODO: corregir todo esto

import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { Proyecto } from '$lib/domain/types/Proyecto';

export class ObtenerProyectosPerfil {
	constructor(private proyectoRepository: ProyectoRepository) {}

	async execute(idUsuario: number | undefined, rol: string): Promise<Proyecto[]> {
		if (!idUsuario) return [];

		const proyectos = await this.proyectoRepository.findAll();

		if (rol === 'institucion') {
			return proyectos.filter((p) => p.institucion_id === idUsuario);
		}

		return proyectos.filter((p) =>
			p.colaboraciones?.some((c) => c.colaborador_id === idUsuario && c.estado === 'aprobada')
		);
	}
}
