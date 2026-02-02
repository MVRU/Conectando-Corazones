import type { Colaboracion } from '../entities/Colaboracion';

export interface ColaboracionRepository {
	// Métodos CRUD principales
	findById(id: number): Promise<Colaboracion | null>;
	findByProyecto(proyectoId: number): Promise<Colaboracion[]>;
	findByColaborador(colaboradorId: number): Promise<Colaboracion[]>;
	findByProyectoAndColaborador(
		proyectoId: number,
		colaboradorId: number
	): Promise<Colaboracion | null>;
	create(colaboracion: Colaboracion): Promise<Colaboracion>;
	update(id: number, colaboracion: Partial<Colaboracion>): Promise<Colaboracion>;
	delete(id: number): Promise<void>;

	// Métodos legacy para compatibilidad con casos de uso existentes
	// TODO: Refactorizar casos de uso para eliminar estos métodos
	getColaboracion(proyectoId: number, usuarioId: number): Promise<Colaboracion | null>;
	getAportesPorColaboracion(colaboracionId: number): Promise<any[]>;
	getEvidencias(participacionPermitidaId: number): Promise<any[]>;
	getColaboracionesPorProyecto(proyectoId: number): Promise<Colaboracion[]>;
}
