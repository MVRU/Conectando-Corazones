import type { Categoria as ICategoria } from '../types/Categoria';

export class Categoria implements ICategoria {
	id_categoria?: number;
	descripcion: string;

	constructor(data: ICategoria) {
		if (!data.descripcion || data.descripcion.trim().length === 0) {
			throw new Error('La descripción de la categoría no puede estar vacía');
		}
		this.id_categoria = data.id_categoria;
		this.descripcion = data.descripcion;
	}
}
