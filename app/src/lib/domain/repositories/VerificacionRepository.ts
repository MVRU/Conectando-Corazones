import type { Verificacion } from '../types/Verificacion';

export interface VerificacionRepository {
	create(verificacion: Verificacion & { usuario_id: number }, actorUserId: number): Promise<Verificacion>;
	findById(id: number): Promise<Verificacion | null>;
	findByUsuario(usuarioId: number): Promise<Verificacion[]>;
	findPendienteByUsuarioAndTipo(usuarioId: number, tipo: string): Promise<Verificacion | null>;
	updateEstado(
		id: number,
		estado: string,
		context: { actorUserId: number; fecha_vencimiento?: Date | null }
	): Promise<Verificacion>;
}
