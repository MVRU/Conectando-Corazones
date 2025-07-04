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
    actual: number;
    objetivo: number;
    unidad: 'dinero' | 'materiales' | 'voluntarios';
    especie?: string; // Colchones, libros, alimentos, etc.
    deadline: string; // ISO date

    // Relación con institución creadora
    institucion: string | {
        id: string;
        razonSocial: string;
        provincia?: string;
        logo?: string;
    };

    ubicacion: string;
    fechaInicio?: string;
    fechaCierre?: string;
    provincia?: string;
    ciudad?: string;
    estado?: string;
    urgencia?: string;
    beneficiarios?: number;
    contacto?: Contacto;
    colaboradores?: { id: string }[]; // Colaboradores asignados al proyecto
}