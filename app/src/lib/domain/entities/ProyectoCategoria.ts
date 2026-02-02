import type { ProyectoCategoria as IProyectoCategoria } from '../types/ProyectoCategoria';
import { Categoria } from './Categoria';

export class ProyectoCategoria implements IProyectoCategoria {
	id_proyecto_categoria?: number;
	categoria_id: number;
	proyecto_id: number;
	categoria?: Categoria;

	constructor(data: IProyectoCategoria) {
		if (!data) {
			throw new Error('Los datos de la relación proyecto-categoría son obligatorios');
		}

		if (typeof data.categoria_id !== 'number' || data.categoria_id <= 0) {
			throw new Error('El ID de categoría debe ser un número positivo válido');
		}

		if (typeof data.proyecto_id !== 'number' || data.proyecto_id <= 0) {
			throw new Error('El ID de proyecto debe ser un número positivo válido');
		}

		if (
			data.id_proyecto_categoria !== undefined &&
			(typeof data.id_proyecto_categoria !== 'number' || data.id_proyecto_categoria <= 0)
		) {
			throw new Error('El ID de la relación debe ser un número positivo válido');
		}

		this.id_proyecto_categoria = data.id_proyecto_categoria;
		this.categoria_id = data.categoria_id;
		this.proyecto_id = data.proyecto_id;

		if (data.categoria) {
			this.categoria = new Categoria(data.categoria);
		}
	}
}
