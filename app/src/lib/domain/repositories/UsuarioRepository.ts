import type { Usuario } from '../entities/Usuario';

export interface UsuarioRepository {
	create(usuario: Usuario): Promise<Usuario>;
	findById(id: number): Promise<Usuario | null>;
	findByUsername(username: string): Promise<Usuario | null>;
	findByUsernameBasic(username: string): Promise<Usuario | null>;
	findByEmail(email: string): Promise<Usuario | null>;
	findByAuthId?(authId: string): Promise<Usuario | null>; // Optional to avoid breaking other impls immediately
	update(usuario: Usuario): Promise<Usuario>;
}
