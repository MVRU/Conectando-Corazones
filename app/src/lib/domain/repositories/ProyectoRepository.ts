import type { Proyecto } from '../entities/Proyecto';
import type { EstadoDescripcion } from '../types/Estado';
import type { ProyectoSearchCriteria } from '../types/dto/ProyectoSearchCriteria';

export interface ProyectoRepository {
	findAll(): Promise<Proyecto[]>;
	findAllSummary(): Promise<Proyecto[]>; // Versión optimizada para listados
	findByInstitucionId(id: number): Promise<Proyecto[]>; // Proyectos de una institución específica
	findById(id: number): Promise<Proyecto | null>;
	findByUsuarioId(id: number): Promise<Proyecto[]>; // Proyectos donde el usuario colabora o es dueño
	search(criteria: ProyectoSearchCriteria): Promise<Proyecto[]>;
	create(proyecto: Proyecto): Promise<Proyecto>;
	update(proyecto: Proyecto): Promise<Proyecto>;
	updateEstado(id: number, nuevoEstado: EstadoDescripcion): Promise<Proyecto>;
	cancel(id: number, usuarioEjecutorId: number, justificacion?: string): Promise<void>;
}
