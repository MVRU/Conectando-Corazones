import type { Evaluacion } from '$lib/domain/types/Evaluacion';

export const mockEvaluaciones: Evaluacion[] = [
	{
		id_evaluacion: 1,
		solicitud_id: 13,
		colaborador_id: 4, // María González
		voto: null,
		created_at: new Date('2026-02-01')
	}
];
