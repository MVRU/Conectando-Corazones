import type { ProyectoCategoria } from '$lib/types/ProyectoCategoria';
import { mockCategorias } from '$lib/mocks/mock-categorias';

export const mockProyectoCategorias: ProyectoCategoria[] = [
    { id_proyecto_categoria: 1, proyecto_id: 1, categoria_id: 2, categoria: mockCategorias[1] },
    { id_proyecto_categoria: 2, proyecto_id: 1, categoria_id: 7, categoria: mockCategorias[6] },
    { id_proyecto_categoria: 3, proyecto_id: 2, categoria_id: 1, categoria: mockCategorias[0] },
    { id_proyecto_categoria: 4, proyecto_id: 3, categoria_id: 3, categoria: mockCategorias[2] },
    { id_proyecto_categoria: 5, proyecto_id: 4, categoria_id: 3, categoria: mockCategorias[2] },
    { id_proyecto_categoria: 6, proyecto_id: 5, categoria_id: 2, categoria: mockCategorias[1] },
    { id_proyecto_categoria: 7, proyecto_id: 5, categoria_id: 4, categoria: mockCategorias[3] },
    { id_proyecto_categoria: 8, proyecto_id: 6, categoria_id: 1, categoria: mockCategorias[0] },
    { id_proyecto_categoria: 9, proyecto_id: 7, categoria_id: 6, categoria: mockCategorias[5] },
    { id_proyecto_categoria: 10, proyecto_id: 8, categoria_id: 7, categoria: mockCategorias[6] }
];  