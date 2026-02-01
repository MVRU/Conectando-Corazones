import type { ProyectoCategoria } from '../entities/ProyectoCategoria';

export interface ProyectoCategoriaRepository {
    findByProyectoId(proyectoId: number): Promise<ProyectoCategoria[]>;

    createMany(proyectoId: number, categoriaIds: number[], tx?: any): Promise<ProyectoCategoria[]>;

    categoriasExisten(categoriaIds: number[]): Promise<boolean>;
}
