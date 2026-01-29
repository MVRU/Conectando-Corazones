import type { ColaboracionRepository } from '../../repositories/ColaboracionRepository';
import type { ProyectoRepository } from '../../repositories/ProyectoRepository';
import type { UsuarioRepository } from '../../repositories/UsuarioRepository';
import type { ColaboracionTipoParticipacion } from '../../types/ColaboracionTipoParticipacion';

export class ObtenerAportesProyecto {
	constructor(
		private colaboracionRepo: ColaboracionRepository,
		private proyectoRepo: ProyectoRepository,
		private usuarioRepo: UsuarioRepository
	) {}

	async execute(proyectoId: number) {
		const project = await this.proyectoRepo.findById(proyectoId);
		if (!project) throw new Error('Proyecto no encontrado');

		const colaboraciones = await this.colaboracionRepo.getColaboracionesPorProyecto(proyectoId);

		const colaboradoresList = await Promise.all(
			colaboraciones.map(async (colab) => {
				if (!colab.colaborador_id) return null;

				const user = await this.usuarioRepo.findById(colab.colaborador_id);
				if (!user) return null;

				const participations = (await this.colaboracionRepo.getAportesPorColaboracion(
					colab.id_colaboracion!
				)) as ColaboracionTipoParticipacion[];

				let aportes: { cosa: string; cantidad: string }[] = [];

				participations.forEach((p) => {
					const permitida = project.participacion_permitida?.find(
						(pp) => pp.id_participacion_permitida === p.participacion_permitida_id
					);

					if (permitida && permitida.tipo_participacion) {
						let cosa = '';
						let cantidad = '';

						if (permitida.tipo_participacion.descripcion === 'Monetaria') {
							cosa = 'Donación monetaria';
							cantidad = `$${p.cantidad}`;
						} else {
							if (permitida.especie) {
								cosa = permitida.especie;
							} else if (permitida.tipo_participacion.descripcion === 'Voluntariado') {
								const unidad = permitida.unidad_medida || 'voluntarios';
								cosa = unidad.charAt(0).toUpperCase() + unidad.slice(1);
							} else {
								cosa = permitida.tipo_participacion.descripcion;
							}

							cosa = cosa.charAt(0).toUpperCase() + cosa.slice(1);
							const unidad = permitida.unidad_medida || '';
							cantidad = `${p.cantidad} ${unidad}`;
						}

						aportes.push({ cosa, cantidad });
					}
				});

				const nombre =
					user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : user.username;

				let tipoLabel = 'Colaborador';
				if ('tipo_colaborador' in user) {
					const tipo = (user as any).tipo_colaborador;
					if (tipo === 'organizacion') tipoLabel = 'Colaborador - ONG';
					else tipoLabel = 'Colaborador - Voluntario/a';
				}

				const displayName = (
					'nombre_legal' in user ? (user as any).nombre_legal : nombre
				) as string;

				return {
					id_usuario: user.id_usuario!,
					nombre: displayName,
					tipo_colaborador: tipoLabel,
					aportes
				};
			})
		);

		return {
			proyecto: project,
			colaboradores: colaboradoresList.filter((x): x is NonNullable<typeof x> => x !== null)
		};
	}
}
