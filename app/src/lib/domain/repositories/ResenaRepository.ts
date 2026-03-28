import type { Resena } from '$lib/domain/types/Resena';

export interface ResenaRepository {
	findByUsuario(usuarioId: number): Promise<Resena[]>;
	findByObjetoAprobadas(tipoObjeto: string, idObjeto: number, limite?: number): Promise<Resena[]>;
	save(resena: Resena): Promise<Resena>;
	findAll(): Promise<Resena[]>;
}
