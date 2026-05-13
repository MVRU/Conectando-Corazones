import type { ColaboracionRepository } from '../../repositories/ColaboracionRepository';
import type { ProyectoRepository } from '../../repositories/ProyectoRepository';
import type { ColaboracionTipoParticipacion } from '../../types/ColaboracionTipoParticipacion';
import type { Evidencia } from '../../types/Evidencia';

export class ObtenerMisAportes {
	constructor(
		private colaboracionRepo: ColaboracionRepository,
		private proyectoRepo: ProyectoRepository
	) { }

	async execute(usuarioId: number, proyectoId: number) {
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) throw new Error('Proyecto no encontrado');

		const colaboracion = await this.colaboracionRepo.getColaboracion(proyectoId, usuarioId);

		if (!colaboracion || !colaboracion.id_colaboracion) {
			return { colaboracion: null, aportes: [], proyecto };
		}

		const [rawAportes, todasEvidencias] = await Promise.all([
			this.colaboracionRepo.getAportesPorColaboracion(
				colaboracion.id_colaboracion
			) as Promise<ColaboracionTipoParticipacion[]>,
			this.colaboracionRepo.getEvidenciasPorColaboracion(
				colaboracion.id_colaboracion,
				usuarioId
			) as Promise<Evidencia[]>
		]);

		const evidenciasPorParticipacion = new Map<number, Evidencia[]>();
		for (const evidencia of todasEvidencias) {
			const ppId = evidencia.id_participacion_permitida!;
			const arr = evidenciasPorParticipacion.get(ppId);
			if (arr) arr.push(evidencia);
			else evidenciasPorParticipacion.set(ppId, [evidencia]);
		}

		const aportes = rawAportes.map((aporte) => {
			const pp = proyecto.participacion_permitida?.find(
				(p: any) => p.id_participacion_permitida === aporte.participacion_permitida_id
			);

			const evidenciasDelAporte =
				evidenciasPorParticipacion.get(aporte.participacion_permitida_id!) ?? [];

			const evidenciasEntrada = evidenciasDelAporte
				.filter((e) => e.tipo_evidencia === 'entrada')
				.flatMap((e) => e.archivos || [])
				.filter((a) => a.usuario_id === usuarioId);

			const evidenciasSalida = evidenciasDelAporte
				.filter((e) => e.tipo_evidencia === 'salida')
				.flatMap((e) => e.archivos || []);

			return {
				...aporte,
				participacion_permitida: pp,
				evidenciasEntrada,
				evidenciasSalida
			};
		});

		return {
			colaboracion,
			aportes,
			proyecto
		};
	}
}
