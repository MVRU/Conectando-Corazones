export interface ProyectoCategoria {
    id_proyecto_categoria?: number;
    categoria_id: number;
    proyecto_id: number;
    categoria?: import('./Categoria').Categoria;
}