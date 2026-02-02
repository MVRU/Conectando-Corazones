import type { Usuario } from '../entities/Usuario';

export interface UsuarioRepository {
	create(usuario: Usuario): Promise<Usuario>;
	findById(id: number): Promise<Usuario | null>;
	findByUsername(username: string): Promise<Usuario | null>;
	findByUsernameBasic(username: string): Promise<Usuario | null>; // Versión optimizada para auth
	// findByEmail(email: string): Promise<Usuario | null>; // TODO: implementar este método para que obtenga de relación con Contacto
	update(usuario: Usuario): Promise<Usuario>;
}
