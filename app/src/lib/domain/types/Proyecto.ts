import type { ParticipacionPermitida } from './ParticipacionPermitida';
import type { Categoria } from './Categoria';
import type { Colaboracion } from './Colaboracion';
import type { Institucion } from './Usuario';
import type { ProyectoUbicacion } from './ProyectoUbicacion';
import type { SolicitudFinalizacion } from './SolicitudFinalizacion';
import type { EstadoDescripcion } from '$lib/domain/types/Estado';

export interface Proyecto {
	id_proyecto?: number;
	titulo: string;
	descripcion: string;
	resumen?: string | null;
	aprendizajes?: string | null;
	url_portada?: string | null;
	created_at?: Date | string | null;
	updated_at?: Date | string | null;
	fecha_cierre_postulaciones?: Date | string | null;
	fecha_fin_tentativa?: Date | string | null;
	beneficiarios?: number | string | null;
	id_chat_firebase?: number | string | null;

	// * RELACIONES

	// -*- FKS para create/update
	estado_id?: number;
	institucion_id: number | null;
	participacion_permitida_ids?: number[];
	categoria_ids?: number[];
	colaboracion_ids?: number[];
	solicitud_finalizacion_ids?: number[];

	// -*- Objetos expandidos para read
	estado?: EstadoDescripcion;
	participacion_permitida?: ParticipacionPermitida[];
	categorias?: Categoria[];
	colaboraciones?: Colaboracion[];
	institucion?: Institucion;
	ubicaciones?: ProyectoUbicacion[];
	solicitudes_finalizacion?: SolicitudFinalizacion[];
}
