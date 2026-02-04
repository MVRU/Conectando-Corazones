import type { ColaboracionRepository } from '../../repositories/ColaboracionRepository';
import type { ProyectoRepository } from '../../repositories/ProyectoRepository';
import type { UsuarioRepository } from '../../repositories/UsuarioRepository';
import type { EvidenciaRepository } from '../../repositories/EvidenciaRepository';
import type { ColaboracionTipoParticipacion } from '../../types/ColaboracionTipoParticipacion';
import type { Archivo } from '../../entities/Archivo';
import { obtenerNombreCompleto } from '$lib/utils/util-usuarios';
import type { Usuario } from '../../types/Usuario';

export class ObtenerAportesProyecto {
	constructor(
		private colaboracionRepo: ColaboracionRepository,
		private proyectoRepo: ProyectoRepository,
		private usuarioRepo: UsuarioRepository,
		private evidenciaRepo: EvidenciaRepository
	) {}

	async execute(proyectoId: number) {
		const project = await this.proyectoRepo.findById(proyectoId);
		if (!project) throw new Error('Proyecto no encontrado');

		const colaboraciones = await this.colaboracionRepo.getColaboracionesPorProyecto(proyectoId);
		const evidencias = await this.evidenciaRepo.findAllByProyecto(proyectoId);

		// Extraer todos los archivos de las evidencias
		const archivos: Archivo[] = evidencias.flatMap((e) => e.archivos || []);

		// Filtrar las evidencias institucionales (subidas por el dueño del proyecto)
		const evidenciasInstitucion = archivos.filter((a) => a.usuario_id === project.institucion_id);

		const colaboradoresList = await Promise.all(
			colaboraciones.map(async (colab) => {
				if (!colab.colaborador_id) return null;

				const user = await this.usuarioRepo.findById(colab.colaborador_id);
				if (!user) return null;

				const participaciones = (await this.colaboracionRepo.getAportesPorColaboracion(
					colab.id_colaboracion!
				)) as ColaboracionTipoParticipacion[];

				let aportes: { cosa: string; cantidad: string; unidad_medida?: string }[] = [];

				participaciones.forEach((p) => {
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

						const unidad_medida = permitida.unidad_medida || '';
						aportes.push({ cosa, cantidad, unidad_medida });
					}
				});

				const displayName = obtenerNombreCompleto(user as unknown as Usuario);

				let tipoLabel = 'Colaborador';
				if ('tipo_colaborador' in user) {
					const tipo = (user as any).tipo_colaborador;
					if (tipo === 'organizacion') tipoLabel = 'Colaborador - ONG';
					else tipoLabel = 'Colaborador - Voluntario/a';
				}

				if (colab.estado !== 'aprobada') {
					tipoLabel += ' (Pendiente)';
				}

				// Buscar evidencias subidas por este colaborador
				const evidenciasColaborador = archivos.filter((a) => a.usuario_id === user.id_usuario);

				return {
					id_usuario: user.id_usuario!,
					usuario: user as unknown as Usuario,
					nombre: displayName,
					tipo_colaborador: tipoLabel,
					aportes,
					evidencias: evidenciasColaborador
				};
			})
		);

		return {
			proyecto: project,
			colaboradores: colaboradoresList.filter((x): x is NonNullable<typeof x> => x !== null),
			evidenciasInstitucion
		};
	}
}
