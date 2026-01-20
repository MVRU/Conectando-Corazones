import type { Proyecto } from '$lib/types/Proyecto'; // TODO: reemplazar por la interface real de Proyecto

export interface ProyectoRepository {
	findAll(): Promise<Proyecto[]>;
	findById(id: number): Promise<Proyecto | null>;
	create(proyecto: Partial<Proyecto>): Promise<Proyecto>;
    // TODO: agregar update, delete, etc. segun sea necesario
}