import type { ColaboracionRepository } from '../../repositories/ColaboracionRepository';
import type { ProyectoRepository } from '../../repositories/ProyectoRepository';
import type { UsuarioRepository } from '../../repositories/UsuarioRepository';
import type { ColaboracionTipoParticipacion } from '../../types/ColaboracionTipoParticipacion';
import type { Evidencia } from '../../types/Evidencia';
import type { Colaboracion } from '../../types/Colaboracion';

export class ObtenerDetalleAportesColaborador {
	constructor(
		private colaboracionRepo: ColaboracionRepository,
		private proyectoRepo: ProyectoRepository,
		private usuarioRepo: UsuarioRepository
	) {}

	async execute(proyectoId: number, colaboradorId: number) {
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) throw new Error('Proyecto no encontrado');

		const colaborador = await this.usuarioRepo.getById(colaboradorId);
		if (!colaborador) throw new Error('Colaborador no encontrado');

		const colaboracion = await this.colaboracionRepo.getColaboracion(proyectoId, colaboradorId);
		if (!colaboracion || !colaboracion.id_colaboracion) {
			return { colaborador, aportes: [], proyecto, colaboradores: [] };
		}

		// Obtener aportes del colaborador seleccionado
		const rawAportes = (await this.colaboracionRepo.getAportesPorColaboracion(
			colaboracion.id_colaboracion
		)) as ColaboracionTipoParticipacion[];

		const aportes = await Promise.all(
			rawAportes.map(async (aporte) => {
				const pp = proyecto.participacion_permitida?.find(
					(p) => p.id_participacion_permitida === aporte.participacion_permitida_id
				);

				if (!pp) return null;

				const todasEvidencias = (await this.colaboracionRepo.getEvidencias(
					aporte.participacion_permitida_id!
				)) as Evidencia[];

				const evidenciasEntrada = todasEvidencias
					.filter((e) => e.tipo_evidencia === 'entrada')
					.flatMap((e) => e.archivos || [])
					.filter((a) => a.usuario_id === colaboradorId);

				const evidenciasSalida = todasEvidencias
					.filter((e) => e.tipo_evidencia === 'salida')
					.flatMap((e) => e.archivos || []);

				let titulo = '';
				let cantidad = '';

				if (pp.tipo_participacion?.descripcion === 'Monetaria') {
					titulo = 'Donación monetaria';
					cantidad = `$${aporte.cantidad}`;
				} else if (pp.tipo_participacion?.descripcion === 'Voluntariado') {
					titulo = 'Voluntariado';
					const unidad = pp.unidad_medida || '';
					cantidad = `${aporte.cantidad} ${unidad}`;
				} else {
					if (pp.especie) {
						titulo = pp.especie;
					} else {
						titulo = pp.tipo_participacion?.descripcion || 'Aporte';
					}

					titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1);
					const unidad = pp.unidad_medida || '';
					cantidad = `${aporte.cantidad} ${unidad}`;
				}

				return {
					titulo,
					cantidad,
					evidencias_entrada: evidenciasEntrada,
					evidencias_salida: evidenciasSalida,
					raw: { ...aporte, participacion_permitida: pp }
				};
			})
		);

		// Lógica para obtener la lista de todos los colaboradores
		const allCollaborations = await this.colaboracionRepo.getColaboracionesPorProyecto(proyectoId);
		const approvedCollaborations = allCollaborations.filter(
			(c: Colaboracion) => c.estado === 'aprobada'
		);

		const uniqueCollaboratorIds = [
			...new Set(
				approvedCollaborations
					.map((c: Colaboracion) => c.colaborador_id)
					.filter((id): id is number => id !== undefined)
			)
		];

		const colaboradoresList = await Promise.all(
			uniqueCollaboratorIds.map(async (userId: number) => {
				const user = await this.usuarioRepo.getById(userId);
				if (!user) return null;

				const userColabs = approvedCollaborations.filter(
					(c: Colaboracion) => c.colaborador_id === userId
				);

				let aportesList: { cosa: string; cantidad: string }[] = [];

				for (const colab of userColabs) {
					const participations = (await this.colaboracionRepo.getAportesPorColaboracion(
						colab.id_colaboracion!
					)) as ColaboracionTipoParticipacion[];

					participations.forEach((p) => {
						const permitida = proyecto.participacion_permitida?.find(
							(pp) => pp.id_participacion_permitida === p.participacion_permitida_id
						);

						if (permitida && permitida.tipo_participacion) {
							let cosa = '';
							let cantidadStr = '';

							if (permitida.tipo_participacion.descripcion === 'Monetaria') {
								cosa = 'Donación monetaria';
								cantidadStr = `$${p.cantidad}`;
							} else if (permitida.tipo_participacion.descripcion === 'Voluntariado') {
								cosa = 'Voluntariado';
								const unidad = permitida.unidad_medida || '';
								cantidadStr = `${p.cantidad} ${unidad}`;
							} else {
								if (permitida.especie) {
									cosa = permitida.especie;
								} else {
									cosa = permitida.tipo_participacion.descripcion;
								}

								cosa = cosa.charAt(0).toUpperCase() + cosa.slice(1);
								const unidad = permitida.unidad_medida || '';
								cantidadStr = `${p.cantidad} ${unidad}`;
							}
							aportesList.push({ cosa, cantidad: cantidadStr });
						}
					});
				}

				const nombre =
					user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : user.username;
				let tipoUserLabel = 'Colaborador';
				if ('tipo_colaborador' in user) {
					const tipo = (user as any).tipo_colaborador;
					if (tipo === 'organizacion') tipoUserLabel = 'Colaborador - ONG';
					else tipoUserLabel = 'Colaborador - Voluntario/a';
				}
				const displayUserName = (
					'nombre_legal' in user ? (user as any).nombre_legal : nombre
				) as string;

				return {
					id_usuario: user.id_usuario ?? userId,
					nombre: displayUserName,
					tipo_colaborador: tipoUserLabel,
					aportes: aportesList
				};
			})
		);

		return {
			colaborador,
			aportes: aportes.filter((a) => a !== null),
			proyecto,
			colaboradores: colaboradoresList.filter((c) => c !== null)
		};
	}
}
