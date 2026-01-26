import type { Ubicacion, ModalidadUbicacion } from '$lib/domain/entities/Ubicacion';

export interface UbicacionCreateData {
    tipo_ubicacion: string;
    modalidad: ModalidadUbicacion;
    calle?: string;
    numero?: string;
    piso?: string;
    departamento?: string;
    referencia?: string;
    url_google_maps?: string;
    localidad_id?: number;
    url_virtual?: string;
}

export interface UbicacionUpdateData {
    referencia?: string;
    url_virtual?: string;
}

export interface UbicacionRepository {
    findById(id: number): Promise<Ubicacion | null>;
    findByProyectoId(proyectoId: number): Promise<Ubicacion[]>;
    create(data: UbicacionCreateData): Promise<Ubicacion>;
    createMany(data: UbicacionCreateData[]): Promise<Ubicacion[]>;
    update(id: number, data: UbicacionUpdateData): Promise<Ubicacion>;

    // Para transacciones con proyecto
    createWithProyectoRelation(
        proyectoId: number,
        ubicaciones: UbicacionCreateData[]
    ): Promise<Ubicacion[]>;
}
