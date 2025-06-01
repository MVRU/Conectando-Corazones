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
}