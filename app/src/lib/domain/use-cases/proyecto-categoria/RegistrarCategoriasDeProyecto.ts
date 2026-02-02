import type { ProyectoCategoriaRepository } from '$lib/domain/repositories/ProyectoCategoriaRepository';
import type { ProyectoCategoria } from '$lib/domain/entities/ProyectoCategoria';

export interface RegistrarCategoriasInput {
	proyectoId: number;
	categoriaIds: number[];
}

const MIN_CATEGORIAS = 1;
const MAX_CATEGORIAS = 5;

import type { CategoriaRepository } from '$lib/domain/repositories/CategoriaRepository';

export class RegistrarCategoriasDeProyecto {
	constructor(
		private readonly proyectoCategoriaRepository: ProyectoCategoriaRepository,
		private readonly categoriaRepository: CategoriaRepository
	) {}

	async execute(input: RegistrarCategoriasInput, tx?: any): Promise<ProyectoCategoria[]> {
		const { proyectoId, categoriaIds } = input;

		// 1. Validar ID de proyecto
		if (!proyectoId || proyectoId <= 0) {
			throw new Error('El ID del proyecto debe ser un número positivo');
		}

		// 2. Validar input de categorías
		if (!Array.isArray(categoriaIds)) {
			throw new Error('Las categorías deben ser un array');
		}

		// 3. Eliminar duplicados
		const uniqueIds = [...new Set(categoriaIds)];

		// 4. Validar cantidad mínima
		if (uniqueIds.length < MIN_CATEGORIAS) {
			throw new Error(`El proyecto debe tener al menos ${MIN_CATEGORIAS} categoría`);
		}

		// 5. Validar cantidad máxima
		if (uniqueIds.length > MAX_CATEGORIAS) {
			throw new Error(`El proyecto puede tener máximo ${MAX_CATEGORIAS} categorías`);
		}

		// 6. Validar IDs positivos
		for (const id of uniqueIds) {
			if (!id || id <= 0) {
				throw new Error('Los IDs de categorías deben ser números positivos');
			}
		}

		// 7. Validar existencia en BD
		const categoriasEncontradas = await this.categoriaRepository.findByIds(uniqueIds);
		if (categoriasEncontradas.length !== uniqueIds.length) {
			throw new Error('Una o más categorías no existen en la base de datos');
		}

		// 8. Crear relaciones
		return this.proyectoCategoriaRepository.createMany(proyectoId, uniqueIds, tx);
	}
}
