import type { Resena } from '$lib/domain/types/Resena'; // TODO: reemplazar por la interface real de Reseña

export interface ResenaRepository {
    findByUsuario(usuarioId: number): Promise<Resena[]>;
    save(resena: Resena): Promise<Resena>;
    findAll(): Promise<Resena[]>;
    // TODO: agregar update, delete, etc. segun sea necesario
}
