// Repositorio de Provincias - Contrato para acceso a datos
import type { Provincia } from '$lib/domain/entities/Provincia';

export interface ProvinciaRepository {
    findAll(): Promise<Provincia[]>;
    findById(id: number): Promise<Provincia | null>;
}
