export enum MotivoReporte {
	SPAM = 'Spam',
	FRAUDE = 'Fraude',
	USO_INDEBIDO_FONDOS = 'Uso indebido de fondos',
	CONTENIDO_FALSO = 'Contenido falso o engañoso',
	EVIDENCIA_MANIPULADA = 'Evidencia manipulada',
	CONDUCTA_INAPROPIADA = 'Conducta inapropiada',
	SUPLANTACION_IDENTIDAD = 'Suplantación de identidad',
	INCUMPLIMIENTO_NORMAS = 'Incumplimiento de normas',
	CONFLICTO_INTERESES = 'Conflicto de intereses',
	OTRO = 'Otro'
}

export interface Reporte {
	id_reporte?: number;
	tipo_objeto: 'Usuario' | 'Proyecto' | string; // qué objeto se está reportando
	id_objeto: number; // id del objeto que se está reportando
	motivo: MotivoReporte;
	descripcion: string;
	created_at?: Date;
	estado?: 'pendiente' | 'resuelto' | 'rechazado';
	fecha_resolucion?: Date | null;
	comentario_resolucion?: string | null; // comentario del admin que resuelve el reporte

	// * Relaciones (FKs)
	reportante_id: number; // -*- usuario que reporta
	admin_id?: number | null; // -*- usuario admin que resuelve el reporte
}
