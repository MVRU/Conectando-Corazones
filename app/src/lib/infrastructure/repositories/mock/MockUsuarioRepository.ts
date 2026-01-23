import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';
import type { Usuario } from '$lib/domain/types/Usuario';
import { mockUsuarios } from '$lib/infrastructure/mocks/mock-usuarios';

export class MockUsuarioRepository implements UsuarioRepository {
	async getById(id: number): Promise<Usuario | null> {
		const user = Object.values(mockUsuarios).find((u) => u.id_usuario === id);
		return user || null;
	}

	async getByEmail(email: string): Promise<Usuario | null> {
		const user = Object.values(mockUsuarios).find((u) =>
			u.contactos?.some((c) => c.tipo_contacto === 'email' && c.valor === email)
		);
		return (user as unknown as Usuario) || null;
	}

	async create(usuario: Partial<Usuario>): Promise<Usuario> {
		throw new Error('Método no implementado.');
	}

	async update(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
		throw new Error('Método no implementado.');
	}
}
