import type { HistorialDeCambios } from '../types/HistorialDeCambios';

export interface HistorialDeCambiosRepository {
	create(cambio: HistorialDeCambios, tx?: any): Promise<HistorialDeCambios>;
	findByObjeto(tipoObjeto: string, idObjeto: number): Promise<HistorialDeCambios[]>;
}
