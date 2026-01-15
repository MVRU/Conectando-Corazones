import type { TipoUbicacion, ModalidadUbicacion } from '../Ubicacion';

/**
 * Para actualizar solo la referencia de una ubicación existente
 */
export interface UbicacionExistenteUpdate {
    id_proyecto_ubicacion: number; // Requerido para identificar
    referencia?: string; // Único campo editable
}

/**
 * Para crear una ubicación completamente nueva
 */
export interface UbicacionNuevaCreate {
    tipo_ubicacion: TipoUbicacion;
    modalidad: ModalidadUbicacion;
    
    // Para modalidad presencial
    direccion_presencial?: {
        calle: string;
        numero: string;
        piso?: string;
        departamento?: string;
        referencia?: string;
        url_google_maps?: string;
        localidad_id: number;
    };
    
    // Para modalidad virtual
    url_virtual?: string;
}
