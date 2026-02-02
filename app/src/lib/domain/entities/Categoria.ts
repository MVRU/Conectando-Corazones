import type { Categoria as ICategoria } from '../types/Categoria';

export class Categoria implements ICategoria {
	id_categoria?: number;
	descripcion: string;

	constructor(data: ICategoria) {
		if (!data) {
			throw new Error('Los datos de la categoría son obligatorios');
		}

		if (
			data.id_categoria !== undefined &&
			(typeof data.id_categoria !== 'number' || data.id_categoria <= 0)
		) {
			throw new Error('El ID de categoría debe ser un número positivo válido');
		}

		const idPresente = !!data.id_categoria;
		const desc = (data.descripcion || '').trim().replace(/\s+/g, ' ');

		// Invariante: Solo validamos descripción a fondo si es una categoría "nueva" (sin ID)
		// o si se provee explícitamente una descripción para una existente.
		if (!idPresente || (idPresente && data.descripcion)) {
			if (desc.length === 0) {
				throw new Error('La descripción de la categoría no puede estar vacía');
			}
			if (desc.length < 3) {
				throw new Error('La descripción de la categoría debe tener al menos 3 caracteres');
			}
			if (desc.length > 60) {
				throw new Error('La descripción de la categoría no puede superar los 60 caracteres');
			}
			if (!/[a-zA-ZÁÉÍÓÚáéíóúÑñ]/.test(desc)) {
				throw new Error('La descripción de la categoría debe incluir al menos una letra');
			}
		}

		this.id_categoria = data.id_categoria;
		this.descripcion = desc;
	}

	/**
	 * Verifica si esta categoría es la genérica de "Otra"
	 */
	esOtra(): boolean {
		const descLc = this.descripcion.toLowerCase();
		return descLc === 'otra' || descLc === 'otro';
	}
}
