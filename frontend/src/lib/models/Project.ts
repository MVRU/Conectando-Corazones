export interface Contacto {
    responsable: string;
    telefono: string;
    email: string;
    sitioWeb: string;
}

export interface Objetivo {
    objetivo: number;
    cantidadEstimada: number;
    cantidadRecaudada?: number;
    unidad: 'dinero' | 'materiales' | 'voluntarios';
    especie?: string; // Colchones, libros, alimentos, etc.
}

export interface Project {
    id?: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    deadline: string; // ISO date
    institucion: string;
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