import type { Usuario } from '../entities/Usuario';

export interface UsuarioRepository {
	create(usuario: Usuario): Promise<Usuario>;
	findById(id: number): Promise<Usuario | null>;
	findByUsername(username: string): Promise<Usuario | null>;
	findByUsernameBasic(username: string): Promise<Usuario | null>;
	findByEmail(email: string): Promise<Usuario | null>;
	findByAuthId(authId: string): Promise<Usuario | null>;
	findAll(filtros?: { rol?: string; estado?: string }): Promise<Usuario[]>;
	update(usuario: Usuario): Promise<Usuario>;
	delete(id: number): Promise<void>;
	hasActiveProjects(id: number): Promise<boolean>;
	hasActiveCollaborations(id: number): Promise<boolean>;
}
