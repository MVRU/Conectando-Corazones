import type { Estado } from '../entities/Estado';
import type { EstadoDescripcion } from '../types/Estado';

export interface EstadoRepository {
	findAll(): Promise<Estado[]>;
	findByDescripcion(descripcion: EstadoDescripcion): Promise<Estado | null>;
}
