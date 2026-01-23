import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { Proyecto } from '$lib/domain/types/Proyecto';
import { mockProyectos } from '$lib/infrastructure/mocks/mock-proyectos';

export class MockProyectoRepository implements ProyectoRepository {
	async findAll(): Promise<Proyecto[]> {
		return mockProyectos;
	}

	async findById(id: number): Promise<Proyecto | null> {
		const proyecto = mockProyectos.find((p) => p.id_proyecto === id);
		return proyecto || null;
	}

	async create(proyecto: Partial<Proyecto>): Promise<Proyecto> {
		const nuevoProyecto = {
			...proyecto,
			id_proyecto: Date.now(), // Simulación de ID
			created_at: new Date(),
			updated_at: new Date()
		} as Proyecto;
		
		mockProyectos.push(nuevoProyecto);
		return nuevoProyecto;
	}
}
