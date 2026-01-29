import type { Colaboracion } from '../types/Colaboracion';
import { Usuario } from './Usuario';
import type { ProyectoUbicacion } from '../types/ProyectoUbicacion';
import type { SolicitudFinalizacion } from '../types/SolicitudFinalizacion';
import type { EstadoDescripcion } from '../types/Estado';
import { ParticipacionPermitida } from './ParticipacionPermitida';
import { Categoria } from './Categoria';
import { Estado } from './Estado';

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

	// Claves foráneas o IDs
	estado_id?: number;
	institucion_id: number | null;

	// Relaciones
	estado_obj?: Estado; // Renombramos para no conflictuar con estado (string)
	estado?: EstadoDescripcion; // Mantenemos el string por compatibilidad
	participacion_permitida?: ParticipacionPermitida[];
	categorias?: Categoria[];
	colaboraciones?: Colaboracion[];
	institucion?: Usuario;
	ubicaciones?: ProyectoUbicacion[];
	solicitudes_finalizacion?: SolicitudFinalizacion[];

	constructor(data: Partial<Proyecto> | any) {
		this.id_proyecto = data.id_proyecto;
		this.titulo = data.titulo || '';
		this.descripcion = data.descripcion || '';
		this.institucion_id = data.institucion_id || 0;
		this.resumen = data.resumen || undefined;
		this.aprendizajes = data.aprendizajes || undefined;
		this.url_portada = data.url_portada || undefined;
		this.beneficiarios = data.beneficiarios || undefined;
		this.id_chat_firebase = data.id_chat_firebase || undefined;

		// Fechas
		this.created_at = data.created_at || undefined;
		this.updated_at = data.updated_at || undefined;
		this.fecha_cierre_postulaciones = data.fecha_cierre_postulaciones || undefined;
		this.fecha_fin_tentativa = data.fecha_fin_tentativa || undefined;

		this.estado_id = data.estado_id;

		// Instanciar objetos de dominio si vienen en los datos
		if (data.institucion) {
			this.institucion = new Usuario(data.institucion);
		}
		if (data.participacion_permitida) {
			this.participacion_permitida = data.participacion_permitida.map(
				(p: any) => new ParticipacionPermitida(p)
			);
		}
		if (data.categorias) {
			this.categorias = data.categorias.map((c: any) => new Categoria(c));
		}
		if (data.estado_obj) {
			this.estado_obj = new Estado(data.estado_obj);
			this.estado = this.estado_obj.descripcion;
		}
		if (data.ubicaciones) {
			this.ubicaciones = data.ubicaciones;
		}
		if (data.colaboraciones) {
			this.colaboraciones = data.colaboraciones;
		}
	}

	// * Lógica de Negocio y Estados * //

	estaActivo(): boolean {
		return this.estado === 'en_curso';
	}

	esCreadoPor(usuarioId: number): boolean {
		return this.institucion?.id_usuario === usuarioId;
	}

	objetivosAlcanzados(): boolean {
		// Validar si todas las participaciones permitidas han alcanzado su objetivo
		if (!this.participacion_permitida || this.participacion_permitida.length === 0) {
			return false; // Sin participaciones no hay objetivos que cumplir (o true? Depende negocio)
		}
		return this.participacion_permitida.every((p) => p.estaCompleto());
	}

	// Máquina de Estados
	puedeCambiarA(nuevoEstado: EstadoDescripcion): boolean {
		const actual = this.estado;
		if (!actual) return true;

		if (nuevoEstado === 'cancelado') {
			return actual !== 'completado';
		}

		switch (actual) {
			case 'en_curso':
				return nuevoEstado === 'pendiente_solicitud_cierre';
			case 'pendiente_solicitud_cierre':
				return nuevoEstado === 'en_revision' || nuevoEstado === 'en_curso';
			case 'en_revision':
				return (
					nuevoEstado === 'completado' ||
					nuevoEstado === 'pendiente_solicitud_cierre' || // Rechazo
					nuevoEstado === 'en_auditoria' // Escalamiento
				);
			case 'en_auditoria':
				return (
					nuevoEstado === 'completado' || nuevoEstado === 'pendiente_solicitud_cierre' // Devolución
				);
			case 'completado':
			case 'cancelado':
				return false; // Terminales
			default:
				return false;
		}
	}
}
