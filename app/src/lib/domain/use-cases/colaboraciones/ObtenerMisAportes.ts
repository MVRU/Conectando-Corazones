import type { ColaboracionRepository } from '../../repositories/ColaboracionRepository';
import type { ProyectoRepository } from '../../repositories/ProyectoRepository';
import type { ColaboracionTipoParticipacion } from '../../types/ColaboracionTipoParticipacion';
import type { Evidencia } from '../../types/Evidencia';

export class ObtenerMisAportes {
	constructor(
		private colaboracionRepo: ColaboracionRepository,
		private proyectoRepo: ProyectoRepository
	) {}

	async execute(usuarioId: number, proyectoId: number) {
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) throw new Error('Proyecto no encontrado');

		const colaboracion = await this.colaboracionRepo.getColaboracion(proyectoId, usuarioId);

		if (!colaboracion || !colaboracion.id_colaboracion) {
			return { colaboracion: null, aportes: [], proyecto };
		}

		const rawAportes = (await this.colaboracionRepo.getAportesPorColaboracion(
			colaboracion.id_colaboracion
		)) as ColaboracionTipoParticipacion[];

		const aportes = await Promise.all(
			rawAportes.map(async (aporte) => {
				const pp = proyecto.participacion_permitida?.find(
					(p) => p.id_participacion_permitida === aporte.participacion_permitida_id
				);

				const todasEvidencias = (await this.colaboracionRepo.getEvidencias(
					aporte.participacion_permitida_id!
				)) as Evidencia[];

				const evidenciasEntrada = todasEvidencias
					.filter((e) => e.tipo_evidencia === 'entrada')
					.flatMap((e) => e.archivos || [])
					.filter((a) => a.usuario_id === usuarioId);

				const evidenciasSalida = todasEvidencias
					.filter((e) => e.tipo_evidencia === 'salida')
					.flatMap((e) => e.archivos || []);

				return {
					...aporte,
					participacion_permitida: pp,
					evidenciasEntrada,
					evidenciasSalida
				};
			})
		);

		return {
			colaboracion,
			aportes,
			proyecto
		};
	}
}
