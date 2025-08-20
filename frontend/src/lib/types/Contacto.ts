// * Códigos canónicos
export const TIPOS_CONTACTO = [
    'email',
    'telefono',
    'web',
    'red_social'
] as const;

export type TipoContacto = typeof TIPOS_CONTACTO[number];

export const ETIQUETAS_CONTACTO = [
    'principal',
    'secundario'
] as const;

export type EtiquetaContacto = typeof ETIQUETAS_CONTACTO[number];


// ! Interfaz
export interface Contacto {
    id_contacto?: number;
    tipo_contacto: TipoContacto | string;
    valor: string;
    etiqueta?: EtiquetaContacto | string;
    usuario_id?: number; // * FK
}


// * Guards canónicos
export const esTipoContactoCanonico = (v: string): v is TipoContacto =>
    (TIPOS_CONTACTO as readonly string[]).includes(v);

export const esEtiquetaContactoCanonica = (v: string): v is EtiquetaContacto =>
    (ETIQUETAS_CONTACTO as readonly string[]).includes(v);