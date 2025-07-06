export interface Contacto {
    responsable: string;
    telefono: string;
    email: string;
    sitioWeb: string;
}

export interface Project {
    id?: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    cantidadEstimada: number;
    cantidadRecaudada?: number;
    objetivo: number;
    unidad: 'dinero' | 'materiales' | 'voluntarios';
    especie?: string; // Colchones, libros, alimentos, etc.
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
}