import type { Direccion } from './Direccion';

// * Códigos canónicos
export const PRIORIDAD_TIPO = ['principal', 'alternativa', 'virtual'] as const;

export type PrioridadTipo = (typeof PRIORIDAD_TIPO)[number];

// ! Interfaz
export interface ProyectoUbicacion {
    id_proyecto_ubicacion?: number;
    proyecto_id: number;
    direccion_id: number;
    tipo_ubicacion?: PrioridadTipo | string;
    que_sehace?: string;
    direccion?: Direccion; // * Objeto expandido al leer
}

// * Guards canónicos
export const esPrioridadTipoCanonico = (v: string): v is PrioridadTipo =>
    (PRIORIDAD_TIPO as readonly string[]).includes(v);