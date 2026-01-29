import type { Ubicacion } from '$lib/domain/entities/Ubicacion';

export interface UbicacionUpdateData {
	referencia?: string;
	url_virtual?: string;
}

export interface UbicacionRepository {
	findById(id: number): Promise<Ubicacion | null>;
	update(id: number, data: UbicacionUpdateData): Promise<Ubicacion>;
	getEstadosProyectosAsociados(id: number): Promise<string[]>;
}
