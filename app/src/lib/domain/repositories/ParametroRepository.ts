import type { Parametro } from '../entities/Parametro';

export interface ParametroRepository {
    findAll(filtro?: string): Promise<Parametro[]>;
    findById(id: string): Promise<Parametro | null>;
    findByNombre(nombre: string): Promise<Parametro | null>;
    updateValor(id: string, nuevoValor: string): Promise<Parametro>;
}
