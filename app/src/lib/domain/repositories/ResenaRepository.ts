import type { Resena } from '$lib/domain/entities/Resena';

export interface ResenaRepository {
	findById(id: number): Promise<Resena | null>;
	findByObjeto(tipoObjeto: string, idObjeto: number): Promise<Resena[]>;
	findByAutor(autorId: number): Promise<Resena[]>;
	findByAutorAndObjeto(
		autorId: number,
		tipoObjeto: string,
		idObjeto: number
	): Promise<Resena | null>;
	findAll(soloAprobadas?: boolean): Promise<Resena[]>;
	create(resena: Resena): Promise<Resena>;
	delete(id: number): Promise<void>;
}
