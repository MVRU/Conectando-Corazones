import type { PrioridadTipo } from '$lib/types/ProyectoUbicacion';
import type { ParticipacionPermitidaCreate } from './ParticipacionPermitidaCreate';

export interface ProyectoCreate {
  titulo: string;
  descripcion: string;
  url_portada?: string;
  fecha_fin_tentativa: Date;
  beneficiarios?: number;
  institucion_id?: number;
  categoria_ids: number[];
  participaciones: ParticipacionPermitidaCreate[];
  ubicaciones: {
    tipo_ubicacion: PrioridadTipo;
    que_sehace: string;
    direccion: {
      calle: string;
      numero: string;
      referencia?: string;
      localidad_id: number;
    };
  }[];
}

