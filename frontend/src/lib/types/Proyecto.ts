// TODO: corregir relaciones (pasaje a tablas, en relaciones 1:N el FK va del lado N)

import type { ParticipacionPermitida } from './ParticipacionPermitida';
import type { Categoria } from './Categoria';
import type { Colaboracion } from './Colaboracion';
import type { Institucion } from './Usuario';
import type { ColaboradorDisyuncion } from './Usuario';
import type { Direccion } from './Direccion';
import type { Evidencia } from './Evidencia';
import type { SolicitudFinalizacion } from './SolicitudFinalizacion';
import type { Estado } from '$lib/types/Estado';

export interface Proyecto {
  id_proyecto?: number;
  titulo: string;
  descripcion: string;
  url_portada?: string;
  created_at?: Date;
  fecha_cierre_postulaciones?: Date;
  fecha_fin_tentativa: Date;
  beneficiarios?: number;
  urgencia?: string;
  id_chat_firebase?: number;

  // * RELACIONES

  // -*- FKS para create/update
  estado_id?: number;
  institucion_id: number;

  // -*- Objetos expandidos para read
  estado?: Estado;
  participacion_permitida?: ParticipacionPermitida[];
  categorias?: Categoria[];
  colaboraciones?: Colaboracion[];
  institucion?: Institucion;
  direcciones?: Direccion[];
  evidencias?: Evidencia[];
  solicitudes_finalizacion?: SolicitudFinalizacion[];
}