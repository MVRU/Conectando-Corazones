import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';
import type { Resena } from '$lib/domain/types/Resena';
import { mockResenas } from '$lib/infrastructure/mocks/mock-resenas';
import { mockTestimonios } from '$lib/infrastructure/mocks/mock-testimonios';

let resenasInMemory: Resena[] = [...mockTestimonios, ...mockResenas];

export class MockResenaRepository implements ResenaRepository {
    async findByUsuario(usuarioId: number): Promise<Resena[]> {
        return resenasInMemory.filter(r => r.tipo_objeto === 'usuario' && r.id_objeto === usuarioId);
    }

    async findAll(): Promise<Resena[]> {
        return [...resenasInMemory];
    }

    async save(resena: Resena): Promise<Resena> {
        resenasInMemory = [...resenasInMemory, resena];
        return resena;
    }
}
