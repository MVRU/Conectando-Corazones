import type { Proyecto } from '$lib/domain/types/Proyecto'; // TODO: reemplazar por la interface real de Proyecto

export interface ProyectoRepository {
	findAll(): Promise<Proyecto[]>;
	findById(id: number): Promise<Proyecto | null>;
	create(proyecto: Partial<Proyecto>): Promise<Proyecto>;
	update(id: number, proyecto: Partial<Proyecto>): Promise<Proyecto>;
}
