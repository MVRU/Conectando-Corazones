import type { Resena as IResena, TipoObjetoResena } from '../types/Resena';

export class Resena implements IResena {
	id_resena?: number;
	tipo_objeto?: TipoObjetoResena;
	id_objeto?: number;
	contenido: string;
	puntaje: number;
	aprobado?: boolean | null;
	rol?: string;
	username?: string;
	autor_id?: number;
	created_at?: Date;
	autor?: any;

	constructor(data: Partial<IResena>) {
		this.id_resena = data.id_resena;
		this.tipo_objeto = data.tipo_objeto;
		this.id_objeto = data.id_objeto;

		this.contenido = data.contenido?.trim() ?? '';
		this.puntaje = data.puntaje ?? 0;

		this.aprobado = data.aprobado ?? null;
		this.rol = data.rol;
		this.username = data.username;
		this.autor_id = data.autor_id;

		this.created_at = data.created_at ?? new Date();
		this.autor = data.autor;

		this.validar();
	}

	private validar(): void {
		if (!this.contenido || this.contenido.trim().length === 0) {
			throw new Error('El contenido de la reseña no puede estar vacío.');
		}

		if (this.contenido.length > 500) {
			throw new Error('El contenido no puede superar los 500 caracteres.');
		}

		if (this.puntaje < 1 || this.puntaje > 5) {
			throw new Error('El puntaje debe estar entre 1 y 5.');
		}

		if (
			this.tipo_objeto &&
			!['usuario', 'proyecto', 'plataforma'].includes(this.tipo_objeto)
		) {
			throw new Error("El tipo_objeto debe ser 'usuario', 'proyecto' o 'plataforma'.");
		}
	}

	estaAprobada(): boolean {
		return this.aprobado === true;
	}

	estaPendienteModeracion(): boolean {
		return this.aprobado === null || this.aprobado === undefined;
	}
}
