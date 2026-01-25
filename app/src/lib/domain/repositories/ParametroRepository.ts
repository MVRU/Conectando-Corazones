import type { Parametro } from '../entities/Parametro';

export interface ParametroRepository {
    findAll(filtro?: string): Promise<Parametro[]>;
    findById(id: number): Promise<Parametro | null>;
    findByNombre(nombre: string): Promise<Parametro | null>;
    updateValor(id: number, nuevoValor: string): Promise<Parametro>;
}
