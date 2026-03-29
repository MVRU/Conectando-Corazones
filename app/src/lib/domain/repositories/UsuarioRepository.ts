import type { Usuario } from '../entities/Usuario';

export interface UsuarioRepository {
	create(usuario: Usuario): Promise<Usuario>;
	findById(id: number, includeInactive?: boolean): Promise<Usuario | null>;
	findByUsername(username: string, includeInactive?: boolean): Promise<Usuario | null>;
	findByUsernameBasic(username: string, includeInactive?: boolean): Promise<Usuario | null>;
	findByEmail(email: string, includeInactive?: boolean): Promise<Usuario | null>;
	findByAuthId(authId: string, includeInactive?: boolean): Promise<Usuario | null>;
	findAll(filtros?: { rol?: string; estado?: string; includeInactive?: boolean }): Promise<Usuario[]>;
	update(usuario: Usuario): Promise<Usuario>;
	delete(id: number): Promise<void>;
	hasActiveProjects(id: number): Promise<boolean>;
	hasActiveCollaborations(id: number): Promise<boolean>;
}
