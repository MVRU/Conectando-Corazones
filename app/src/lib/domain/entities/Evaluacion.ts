import { Usuario } from './Usuario';
import type { SolicitudFinalizacion } from '../types/SolicitudFinalizacion';

export type VotoEvaluacion = 'aprobado' | 'rechazado';

export class Evaluacion {
    id_evaluacion?: number;
    voto: VotoEvaluacion;
    justificacion?: string | null;
    created_at?: Date;

    solicitud_id: number;
    colaborador_id: number;

    colaborador?: Usuario;
    solicitud?: SolicitudFinalizacion;

    constructor(data: {
        id_evaluacion?: number;
        voto: VotoEvaluacion;
        justificacion?: string | null;
        created_at?: Date | string;
        solicitud_id: number;
        colaborador_id: number;
        colaborador?: Partial<Usuario>;
        solicitud?: SolicitudFinalizacion;
    }) {
        this.id_evaluacion = data.id_evaluacion;
        this.voto = data.voto;
        this.justificacion = data.justificacion;
        this.created_at = data.created_at ? new Date(data.created_at) : undefined;
        this.solicitud_id = data.solicitud_id;
        this.colaborador_id = data.colaborador_id;

        if (data.colaborador) {
            this.colaborador = new Usuario(data.colaborador);
        }
        if (data.solicitud) {
            // TODO: Instanciar cuando SolicitudFinalizacion sea Entity 
            this.solicitud = data.solicitud;
        }

        this.validar();
    }

    private validar(): void {
        if (!this.solicitud_id) throw new Error('La evaluación debe estar asociada a una solicitud.');
        if (!this.colaborador_id) throw new Error('La evaluación debe tener un colaborador asociado.');

        if (this.voto === 'rechazado') {
            if (!this.justificacion || this.justificacion.trim().length < 10) {
                throw new Error('El rechazo requiere una justificación detallada (mínimo 10 caracteres).');
            }
        }
    }
}
