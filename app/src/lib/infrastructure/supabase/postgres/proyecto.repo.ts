import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { Proyecto } from '$lib/domain/types/Proyecto';
import { supabase } from '$lib/infrastructure/supabase/client';

export class ProyectoRepoSupabase implements ProyectoRepository {
	async findAll(): Promise<Proyecto[]> {
		const { data, error } = await supabase.from('proyectos').select('*');

		if (error) {
			console.error('Error fetching proyectos:', error);
			throw new Error(error.message);
		}

		return data as Proyecto[];
	}

	async findById(id: number): Promise<Proyecto | null> {
		const { data, error } = await supabase
			.from('proyectos')
			.select('*')
			.eq('id_proyecto', id)
			.single();

		if (error) {
			if (error.code === 'PGRST116') {
				return null;
			}
			console.error(`Error fetching proyecto ${id}:`, error);
			throw new Error(error.message);
		}

		return data as Proyecto;
	}

	async create(proyecto: Partial<Proyecto>): Promise<Proyecto> {
		const { data, error } = await supabase.from('proyectos').insert(proyecto).select().single();

		if (error) {
			console.error('Error creating proyecto:', error);
			throw new Error(error.message);
		}

		return data as Proyecto;
	}

	async update(id: number, proyecto: Partial<Proyecto>): Promise<Proyecto> {
		const { data, error } = await supabase
			.from('proyectos')
			.update(proyecto)
			.eq('id_proyecto', id)
			.select()
			.single();

		if (error) {
			console.error(`Error updating proyecto ${id}:`, error);
			throw new Error(error.message);
		}

		return data as Proyecto;
	}
}
