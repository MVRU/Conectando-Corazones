// -*- DECISIÓN DE DISEÑO -*-
// Modelo único para proyectos utilizado en toda la app.
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
    institucion: string;
    ubicacion: string;
    fechaInicio?: string;
    fechaCierre?: string;
    provincia?: string;
    ciudad?: string;
    estado?: string;
    urgencia?: string;
    beneficiarios?: number;
    solicitudesColaboracion?: number;
}