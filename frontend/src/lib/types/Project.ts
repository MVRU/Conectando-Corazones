// FIX: corregir todo esto para que coincida con DER

import type { Contacto } from './Contacto';
import type { InstitucionUser, ColaboradorUser } from './User';

export interface Objetivo { // FIX: difiere del DER y es participacion_permitida, no objetivos, redundante con atributo objetivo
    objetivo: number;
    cantidad?: number; // FIX: en DER está como actual
    unidad: 'dinero' | 'materiales' | 'voluntarios'; // FIX: difiere del DER
    especie?: string; // FIX: difiere del DER y se arrastra hace tiempo
}

export interface Project {
    id?: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    deadline: string; // ISO date
    institucion: {
        id: string;
        razonSocial?: string;
    }
    colaboradores?: ColaboradorUser[];
    ubicacion: string; // FIX: difiere del DER
    fechaInicio?: string;
    fechaCierre?: string;
    provincia?: string; // FIX: ¿para qué está la ubicación?
    ciudad?: string; // FIX: ¿para qué está la ubicación?
    estado?: string;
    urgencia?: string;
    beneficiarios?: number;
    contacto?: Contacto; // FIX: difiere del DER

    objetivos: Objetivo[]; // FIX: difiere del DER y es participacion_permitida, no objetivos, nombre redundante con atributo objetivo
}
