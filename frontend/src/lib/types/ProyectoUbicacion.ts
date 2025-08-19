export interface ProyectoUbicacion {
    id_proyecto_ubicacion?: number;
    proyecto_id: number;
    direccion_id: number;
    tipo_ubicacion?: 'principal' | 'alternativa' | 'voluntariado' | string;
}