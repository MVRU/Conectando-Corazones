export interface Resena {
	id_resena?: number;
	tipo_objeto?: string;
	id_objeto?: number;
	contenido: string;
	puntaje: number;
	aprobado?: boolean; // * para moderación
	rol?: string; // ! No está en DER, agregado como opcional para testimonios de home
	usuario_id: string; // * FK
}
