import type { Categoria as ICategoria } from '../types/Categoria';

export class Categoria implements ICategoria {
	id_categoria?: number;
	descripcion: string;

	constructor(data: ICategoria) {
		if (!data) {
			throw new Error('Los datos de la categoría son obligatorios');
		}

		// 1. Validar ID si está presente
		if (
			data.id_categoria !== undefined &&
			(typeof data.id_categoria !== 'number' || data.id_categoria <= 0)
		) {
			throw new Error('El ID de categoría debe ser un número positivo válido');
		}

		// 2. Normalizar descripción
		const descOriginal = data.descripcion || '';
		const desc = descOriginal.trim().replace(/\s+/g, ' ');

		// 3. Invariantes de Negocio
		const esNueva = data.id_categoria === undefined;
		const tieneDescripcionInfo = desc.length > 0;

		// Solo validamos estrictamente si es una categoría nueva (obligatoria)
		// o si se provee una descripción para una existente (debe cumplir el formato).
		// Si es una existente y desc está vacía, se ignora (caso de selección por ID).
		if (esNueva || tieneDescripcionInfo) {
			if (esNueva && desc.length === 0) {
				throw new Error('La descripción de la categoría no puede estar vacía');
			}

			if (desc.length > 0) {
				if (desc.length < 3) {
					throw new Error('La descripción de la categoría debe tener al menos 3 caracteres');
				}
				if (desc.length > 60) {
					throw new Error('La descripción de la categoría no puede superar los 60 caracteres');
				}

				// Debe contener al menos una letra (no puede ser solo números o símbolos)
				const tieneLetras = /[a-zA-ZÁÉÍÓÚáéíóúÑñ]/.test(desc);
				if (!tieneLetras) {
					throw new Error('La descripción de la categoría debe incluir al menos una letra');
				}

				// No puede ser puramente numérica
				if (/^\d+$/.test(desc)) {
					throw new Error('La descripción de la categoría no puede ser puramente numérica');
				}
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
