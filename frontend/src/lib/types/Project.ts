import type { Contacto } from './Contacto';
import type { InstitucionUser, ColaboradorUser } from './User';

export interface Objetivo {
    objetivo: number;
    cantidad?: number;
    unidad: 'dinero' | 'materiales' | 'voluntarios';
    especie?: string;
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
    ubicacion: string;
    fechaInicio?: string;
    fechaCierre?: string;
    provincia?: string;
    ciudad?: string;
    estado?: string;
    urgencia?: string;
    beneficiarios?: number;
    contacto?: Contacto;

    objetivos: Objetivo[];
}
