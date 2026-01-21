import type { Usuario } from '$lib/domain/entities/Usuario';

export interface UsuarioRepository {
	getById(id: number): Promise<Usuario | null>;
	getByEmail(email: string): Promise<Usuario | null>;
	create(usuario: Partial<Usuario>): Promise<Usuario>;
	update(id: number, usuario: Partial<Usuario>): Promise<Usuario>;
	// TODO: agregar update, delete, etc. segun sea necesario
}
