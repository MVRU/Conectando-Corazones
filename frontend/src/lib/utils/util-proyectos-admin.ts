import type { Proyecto } from '$lib/types/Proyecto';

export type FiltroEstadoProyecto =
	| ''
	| 'en_curso'
	| 'completado'
	| 'en_revision'
	| 'en_auditoria'
	| 'cancelado';

export type EstadoProyectoAdmin = Proyecto['estado'] | 'en_curso';

export function filtrarProyectosAdmin(
	proyectos: Proyecto[],
	filtroEstado: FiltroEstadoProyecto,
	filtroInstitucion: string,
	busquedaProyecto: string
): Proyecto[] {
	return proyectos.filter((p) => {
		const coincideEstado = !filtroEstado || p.estado === filtroEstado;
		const coincideInstitucion =
			!filtroInstitucion ||
			p.institucion?.nombre_legal?.toLowerCase().includes(filtroInstitucion.toLowerCase());
		const coincideBusqueda =
			!busquedaProyecto || p.titulo.toLowerCase().includes(busquedaProyecto.toLowerCase());
		return coincideEstado && coincideInstitucion && coincideBusqueda;
	});
}

export function actualizarEstadoProyecto(
	proyectos: Proyecto[],
	idProyecto: number | undefined,
	nuevoEstado: EstadoProyectoAdmin
): Proyecto[] {
	if (!idProyecto) return proyectos;
	return proyectos.map((p) =>
		p.id_proyecto === idProyecto
			? {
					...p,
					estado: nuevoEstado
			  }
			: p
	);
}
