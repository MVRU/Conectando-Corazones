import type { Categoria as ICategoria } from '../types/Categoria';

export class Categoria implements ICategoria {
	id_categoria?: number;
	descripcion: string;

	constructor(data: ICategoria) {
		// Si tiene ID, se asume que existe y no es obligatorio tener la descripción cargada en este objeto
		const esExistente = !!data.id_categoria;
		if (!esExistente && (!data.descripcion || data.descripcion.trim().length === 0)) {
			throw new Error('La descripción de la categoría no puede estar vacía');
		}
		this.id_categoria = data.id_categoria;
		this.descripcion = data.descripcion || '';
	}
}
