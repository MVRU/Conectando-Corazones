export type TipoObjetoResena = 'usuario' | 'proyecto' | 'plataforma';

export interface Resena {
	id_resena?: number;
	tipo_objeto?: TipoObjetoResena;
	id_objeto?: number;
	contenido: string;
	puntaje: number;
	aprobado?: boolean | null; // * para moderación
	rol?: string; // ! No está en DER, agregado como opcional para testimonios de home
	username?: string; // * FK
	autor_id?: number;
	created_at?: Date;
	autor?: any; // Objeto usuario anidado retornado por Prisma
}
