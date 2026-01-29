import type { Proyecto } from '../entities/Proyecto';
import type { EstadoDescripcion } from '../types/Estado';

export interface ProyectoRepository {
	findAll(): Promise<Proyecto[]>;
	findById(id: number): Promise<Proyecto | null>;
	create(proyecto: Proyecto): Promise<Proyecto>;
	update(proyecto: Proyecto): Promise<Proyecto>;
	updateEstado(id: number, nuevoEstado: EstadoDescripcion): Promise<Proyecto>;
}
