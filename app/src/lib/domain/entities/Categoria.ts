import type { Categoria as ICategoria } from '../types/Categoria';

export class Categoria implements ICategoria {
	id_categoria?: number;
	descripcion: string;

	constructor(data: ICategoria) {
		this.id_categoria = data.id_categoria;
		this.descripcion = data.descripcion;
	}
}
