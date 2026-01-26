import type { Localidad } from './Localidad';

export type ModalidadUbicacion = 'presencial' | 'virtual';

export class Ubicacion {
    id_ubicacion?: number;
    tipo_ubicacion: string;
    modalidad: ModalidadUbicacion;

    // Campos presencial
    calle?: string;
    numero?: string;
    piso?: string;
    departamento?: string;
    referencia?: string;
    url_google_maps?: string;
    localidad_id?: number;
    localidad?: Localidad;

    // Campos virtual
    url_virtual?: string;

    constructor(data: Partial<Ubicacion>) {
        // Invariante: tipo_ubicacion es obligatorio
        if (!data.tipo_ubicacion || data.tipo_ubicacion.trim() === '') {
            throw new Error('El tipo de ubicación es requerido');
        }

        // Invariante: modalidad debe ser válida
        if (!data.modalidad || !['presencial', 'virtual'].includes(data.modalidad)) {
            throw new Error('La modalidad debe ser "presencial" o "virtual"');
        }

        // Invariante: si es presencial, campos obligatorios
        if (data.modalidad === 'presencial') {
            if (!data.calle || data.calle.trim() === '') {
                throw new Error('La calle es obligatoria para ubicaciones presenciales');
            }
            if (!data.numero || data.numero.trim() === '') {
                throw new Error('El número es obligatorio para ubicaciones presenciales');
            }
            if (!data.localidad_id) {
                throw new Error('La localidad es obligatoria para ubicaciones presenciales');
            }
        }

        this.id_ubicacion = data.id_ubicacion;
        this.tipo_ubicacion = data.tipo_ubicacion.trim();
        this.modalidad = data.modalidad;
        this.calle = data.calle?.trim();
        this.numero = data.numero?.trim();
        this.piso = data.piso?.trim();
        this.departamento = data.departamento?.trim();
        this.referencia = data.referencia?.trim();
        this.url_google_maps = data.url_google_maps?.trim();
        this.localidad_id = data.localidad_id;
        this.localidad = data.localidad;
        this.url_virtual = data.url_virtual?.trim();
    }

    /**
     * Verifica si se puede editar la referencia
     */
    puedeEditarReferencia(): boolean {
        return this.modalidad === 'presencial';
    }

    /**
     * Verifica si se puede editar la URL virtual
     */
    puedeEditarUrlVirtual(): boolean {
        return this.modalidad === 'virtual';
    }
}
