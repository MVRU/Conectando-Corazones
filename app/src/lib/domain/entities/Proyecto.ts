// TODO: está incompleto, es solo a modo de prueba, hay que cambiar las importaciones también

import type { ParticipacionPermitida } from '../types/ParticipacionPermitida';
import type { Categoria } from '../types/Categoria';
import type { Colaboracion } from '../types/Colaboracion';
import { Usuario } from './Usuario';
import type { ProyectoUbicacion } from '../types/ProyectoUbicacion';
import type { SolicitudFinalizacion } from '../types/SolicitudFinalizacion';
import type { EstadoDescripcion } from '../types/Estado';

export class Proyecto {
    id_proyecto?: number;
    titulo: string;
    descripcion: string;
    resumen?: string;
    aprendizajes?: string;
    url_portada?: string;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    fecha_cierre_postulaciones?: Date | string | null;
    fecha_fin_tentativa?: Date | string | null;
    beneficiarios?: number | string | null;
    id_chat_firebase?: number | string | null;

    // Relaciones
    estado_id?: number;
    institucion_id: number;
    participacion_permitida_ids?: number[];
    categoria_ids?: number[];
    colaboracion_ids?: number[];
    solicitud_finalizacion_ids?: number[];

    estado?: EstadoDescripcion;
    participacion_permitida?: ParticipacionPermitida[];
    categorias?: Categoria[];
    colaboraciones?: Colaboracion[];
    institucion?: Usuario;
    ubicaciones?: ProyectoUbicacion[];
    solicitudes_finalizacion?: SolicitudFinalizacion[];

    constructor(data: Partial<Proyecto>) {
        this.titulo = data.titulo || '';
        this.descripcion = data.descripcion || '';
        this.institucion_id = data.institucion_id || 0;
        
        Object.assign(this, data);

        if (data.institucion) {
            this.institucion = new Usuario(data.institucion);
        }
    }

    estaActivo(): boolean {
        return this.estado === 'en_curso';
    }

    esCreadoPor(usuarioId: number): boolean {
        return this.institucion?.id_usuario === usuarioId;
    }
}