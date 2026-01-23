import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import type { Colaboracion } from '$lib/domain/types/Colaboracion';
import { mockColaboraciones } from '$lib/infrastructure/mocks/mock-colaboraciones';
import { mockColaboracionTipoParticipacion } from '$lib/infrastructure/mocks/mock-colaboracion-tipo-participacion';
import { mockEvidencias } from '$lib/infrastructure/mocks/mock-evidencias';

export class MockColaboracionRepository implements ColaboracionRepository {
	async getColaboracion(proyectoId: number, usuarioId: number): Promise<Colaboracion | null> {
		const colab = mockColaboraciones.find(
			(c) => c.proyecto_id === proyectoId && c.colaborador_id === usuarioId
		);
		return colab || null;
	}

	async getAportesPorColaboracion(colaboracionId: number): Promise<any[]> {
		return mockColaboracionTipoParticipacion.filter((c) => c.colaboracion_id === colaboracionId);
	}

	async getEvidencias(participacionPermitidaId: number): Promise<any[]> {
		return mockEvidencias.filter(
			(e) =>
				e.participacion_permitida?.id_participacion_permitida === participacionPermitidaId ||
				e.id_participacion_permitida === participacionPermitidaId
		);
	}

	async getColaboracionesPorProyecto(proyectoId: number): Promise<Colaboracion[]> {
		return mockColaboraciones.filter(
			(c) => c.proyecto_id === proyectoId && c.estado === 'aprobada'
		);
	}
}
