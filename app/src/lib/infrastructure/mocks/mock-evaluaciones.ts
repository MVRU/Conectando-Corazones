import type { Evaluacion } from '$lib/domain/types/Evaluacion';

export const mockEvaluaciones: Evaluacion[] = [
	{
		id_evaluacion: 1,
		solicitud_id: 13,
		colaborador_id: 4, // María González
		voto: 'aprobado',
		created_at: new Date('2026-02-01')
	},
	{
		id_evaluacion: 2,
		solicitud_id: 14,
		colaborador_id: 8, // Ana Martínez
		voto: 'aprobado',
		created_at: new Date('2026-02-11')
	},
	{
		id_evaluacion: 3,
		solicitud_id: 1,
		colaborador_id: 7, // Empresa Solidaria
		voto: 'aprobado',
		created_at: new Date('2026-01-15')
	}
];
