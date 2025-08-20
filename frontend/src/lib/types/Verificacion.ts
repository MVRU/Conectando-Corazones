// * Códigos canónicos
export const TIPOS_VERIFICACION = [
    'email_institucional',
    'documental',
    'renaper'
] as const;

export type TipoVerificacion = typeof TIPOS_VERIFICACION[number];

export const ESTADOS_VERIFICACION = [
    'aprobada',
    'pendiente',
    'rechazada'
] as const;

export type EstadoVerificacion = typeof ESTADOS_VERIFICACION[number];

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