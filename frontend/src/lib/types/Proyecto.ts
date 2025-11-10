import type { ParticipacionPermitida } from './ParticipacionPermitida';
import type { Categoria } from './Categoria';
import type { Colaboracion } from './Colaboracion';
import type { Institucion } from './Usuario';
import type { ProyectoUbicacion } from './ProyectoUbicacion';
import type { Evidencia } from './Evidencia';
import type { SolicitudFinalizacion } from './SolicitudFinalizacion';
import type { EstadoDescripcion } from '$lib/types/Estado';

export interface Proyecto {
  id_proyecto?: number;
  titulo: string;
  descripcion: string;
  resumen?: string;
  aprendizajes?: string;
  url_portada?: string;
  created_at?: Date | string | null;
  fecha_cierre_postulaciones?: Date | string | null;
  fecha_fin_tentativa?: Date | string | null;
  beneficiarios?: number | string | null;
  id_chat_firebase?: number | string | null;

  // * RELACIONES

  // -*- FKS para create/update
  estado_id?: number;
  institucion_id: number;
  participacion_permitida_ids?: number[];
  categoria_ids?: number[];
  colaboracion_ids?: number[];
  evidencia_ids?: number[];
  solicitud_finalizacion_ids?: number[];

  // -*- Objetos expandidos para read
  estado?: EstadoDescripcion;
  participacion_permitida?: ParticipacionPermitida[];
  categorias?: Categoria[];
  colaboraciones?: Colaboracion[];
  institucion?: Institucion;
  ubicaciones?: ProyectoUbicacion[];
  evidencias?: Evidencia[];
  solicitudes_finalizacion?: SolicitudFinalizacion[];
}