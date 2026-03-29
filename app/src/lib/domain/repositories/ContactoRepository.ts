import type { Contacto } from '../entities/Contacto';

export interface ContactoRepository {
	findByUsuario(usuarioId: number): Promise<Contacto[]>;
	findById(id: number): Promise<Contacto | null>;
	createManyForUsuario(
		usuarioId: number,
		contactos: Contacto[],
		actorUserId: number
	): Promise<Contacto[]>;
	replaceAllForUsuario(
		usuarioId: number,
		contactos: Contacto[],
		actorUserId: number
	): Promise<Contacto[]>;
	update(
		id: number,
		data: Partial<Pick<Contacto, 'tipo_contacto' | 'valor' | 'etiqueta'>>,
		actorUserId: number
	): Promise<Contacto>;
	delete(id: number, actorUserId: number): Promise<void>;
}
