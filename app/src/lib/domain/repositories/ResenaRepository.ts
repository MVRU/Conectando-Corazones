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
	
	// Métodos legados de origin/main mantenidos por retrocompatibilidad
	findByUsuario(usuarioId: number): Promise<Resena[]>;
	findByObjetoAprobadas(tipoObjeto: string, idObjeto: number, limite?: number): Promise<Resena[]>;
	save(resena: Resena): Promise<Resena>;
}
