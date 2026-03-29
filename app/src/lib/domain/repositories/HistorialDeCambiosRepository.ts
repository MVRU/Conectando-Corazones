import type { HistorialDeCambios } from '../types/HistorialDeCambios';

export interface FiltrosHistorial {
	tipo_objeto?: string;
	id_objeto?: number;
	accion?: string;
	usuario_id?: number;
	desde?: Date;
	hasta?: Date;
	limit?: number;
	offset?: number;
}

export interface HistorialDeCambiosRepository {
	create(cambio: HistorialDeCambios, tx?: unknown): Promise<HistorialDeCambios>;
	findByObjeto(tipoObjeto: string, idObjeto: number): Promise<HistorialDeCambios[]>;
	findAll(filtros?: FiltrosHistorial): Promise<HistorialDeCambios[]>;
	findByUsuario(usuarioId: number): Promise<HistorialDeCambios[]>;
	findByAccion(accion: string): Promise<HistorialDeCambios[]>;
}
