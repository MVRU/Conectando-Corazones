import type { ParticipacionPermitidaCreate } from './ParticipacionPermitidaCreate';
import type { UbicacionCreate } from './UbicacionCreate';
import type { EstadoDescripcion } from '../Estado';

export interface ProyectoCreate {
	titulo: string;
	descripcion: string;
	url_portada?: string;
	fecha_fin_tentativa: Date;
	beneficiarios?: number;
	institucion_id?: number;
	categoria_ids: number[];
	participaciones: ParticipacionPermitidaCreate[];
	ubicaciones: UbicacionCreate[];
	estado?: EstadoDescripcion;
}
