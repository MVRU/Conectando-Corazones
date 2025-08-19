import type { ParticipacionPermitida } from './ParticipacionPermitida';
import type { Categoria } from './Categoria';
import type { Colaboracion } from './Colaboracion';
import type { Institucion } from './Usuario';
import type { ColaboradorDisyuncion } from './Usuario';
import type { Direccion } from './Direccion';
import type { Evidencia } from './Evidencia';
import type { SolicitudFinalizacion } from './SolicitudFinalizacion';
import type { EstadoDescripcion } from '$lib/types/Estado';

export type Modalidad = 'presencial' | 'virtual' | 'mixta'; // ! VER

export interface Proyecto { // ! VER: ¿volvemos a agregar el atributo "urgencia"? ¿Y "beneficiarios"?
  id_proyecto?: number;
  titulo: string;
  descripcion: string;
  url_portada?: string;
  created_at?: Date;
  fecha_cierre_postulaciones?: Date;
  fecha_fin_tentativa: Date;
  modalidad?: Modalidad;
  id_chat_firebase?: number;

  // * RELACIONES

  // -*- FKS para create/update
  estado_id?: number;

  participacion_permitida_ids?: number[];
  categoria_ids?: number[];
  colaboracion_ids?: number[];
  institucion_id?: number;

  direccion_id?: number;
  evidencia_ids?: number[];
  solicitud_finalizacion_ids?: number[];

  // -*- Objetos expandidos para read
  estado?: EstadoDescripcion;
  participacion_permitida?: ParticipacionPermitida[];
  categorias?: Categoria[];
  colaboraciones?: Colaboracion[];
  institucion?: Institucion;

  direccion?: Direccion;
  evidencias?: Evidencia[];
  solicitudes_finalizacion?: SolicitudFinalizacion[];
}