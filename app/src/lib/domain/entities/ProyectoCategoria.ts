import type { ProyectoCategoria as IProyectoCategoria } from '../types/ProyectoCategoria';
import { Categoria } from './Categoria';

export class ProyectoCategoria implements IProyectoCategoria {
    id_proyecto_categoria?: number;
    categoria_id: number;
    proyecto_id: number;
    categoria?: Categoria;

    constructor(data: IProyectoCategoria) {
        this.id_proyecto_categoria = data.id_proyecto_categoria;
        this.categoria_id = data.categoria_id;
        this.proyecto_id = data.proyecto_id;

        if (data.categoria) {
            this.categoria = new Categoria(data.categoria);
        }
    }
}
