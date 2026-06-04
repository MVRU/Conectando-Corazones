// * Códigos canónicos
export const TIPOS_VERIFICACION = [
	'email_institucional',
	'institucional',
	'renaper',
	'arca'
] as const;

export type TipoVerificacion = (typeof TIPOS_VERIFICACION)[number];

export const ESTADOS_VERIFICACION = ['aprobada', 'pendiente', 'rechazada'] as const;

export type EstadoVerificacion = (typeof ESTADOS_VERIFICACION)[number];

// ! Interfaz

export interface Verificacion {
	id_verificacion?: number;
	tipo: TipoVerificacion | string;
	estado: EstadoVerificacion;
	created_at?: Date;
	fecha_vencimiento?: Date;
	usuario_id?: number; // * FK a usuario verificado
}

// * Guards canónicos
export const esTipoVerificacionCanonico = (v: string): v is TipoVerificacion =>
	(TIPOS_VERIFICACION as readonly string[]).includes(v);

export const esEstadoVerificacionCanonico = (v: string): v is EstadoVerificacion =>
	(ESTADOS_VERIFICACION as readonly string[]).includes(v);

/**
 * La verificación ARCA (RG 2681) está vigente si fue aprobada y la
 * fecha de vencimiento del certificado es posterior a "hoy".
 */
export const esArcaVigente = (v: Verificacion | null | undefined, hoy: Date = new Date()): boolean => {
	if (!v) return false;
	if (v.tipo !== 'arca') return false;
	if (v.estado !== 'aprobada') return false;
	if (!v.fecha_vencimiento) return false;
	return new Date(v.fecha_vencimiento).getTime() > hoy.getTime();
};
