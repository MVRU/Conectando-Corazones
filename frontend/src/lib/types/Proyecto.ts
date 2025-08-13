import type { Estado } from './Estado';
import type { TipoParticipacion } from './TipoParticipacion';
import type { Categoria } from './Categoria';
import type { Colaboracion } from './Colaboracion';
import type { Institucion } from './Usuarios';
import type { ColaboradorDisyuncion } from './Usuarios';
import type { Direccion } from './Direccion';
import type { Evidencia } from './Evidencia';
import type { SolicitudFinalizacion } from './SolicitudFinalizacion';

export interface Proyecto {
  id_proyecto: string;
  titulo: string;
  descripcion: string;
  url_portada: string;
  created_at: Date;
  fecha_cierre_postulaciones: Date;
  fecha_fin_tentativa: Date;
  modalidad: string;
  id_chat_firebase: string;
  estado: Estado;
  participacion_permitida: TipoParticipacion[];
  categorias: Categoria[];
  colaboraciones: Colaboracion[];
  institucion: Institucion;
  colaboradores: ColaboradorDisyuncion[];
  direccion: Direccion;
  evidencias: Evidencia[];
  solicitudes_finalizacion: SolicitudFinalizacion[];
}
