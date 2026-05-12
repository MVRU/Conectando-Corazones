import { TIPOS_PARTICIPACION_DEDUCIBLES } from '$lib/domain/types/TipoParticipacion';

export interface InputDeduccion {
	estadoProyecto: string;
	arcaVigente: boolean;
	colaboradorConFinesLucro: boolean;
	colaboracion?: {
		estado: string;
		tipos: { descripcion: string | undefined }[];
	} | null;
}

export function colaboradorPuedeDeducirEnProyecto(
	input: InputDeduccion
): boolean {
	if (input.estadoProyecto !== 'completado') return false;
	if (!input.arcaVigente) return false;
	if (!input.colaboradorConFinesLucro) return false;

	const col = input.colaboracion;
	if (!col || col.estado !== 'aprobada') return false;

	return col.tipos.some(
		(t) => t.descripcion && TIPOS_PARTICIPACION_DEDUCIBLES.includes(t.descripcion as 'Monetaria' | 'Especie')
	);
}
