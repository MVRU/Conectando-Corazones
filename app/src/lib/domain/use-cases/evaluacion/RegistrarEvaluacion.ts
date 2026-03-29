import { Evaluacion, type VotoEvaluacion } from '$lib/domain/entities/Evaluacion';
import type { EvaluacionRepository } from '$lib/domain/repositories/EvaluacionRepository';
import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import type { SolicitudFinalizacionRepository } from '$lib/domain/repositories/SolicitudFinalizacionRepository';
import type { HistorialDeCambiosRepository } from '$lib/domain/repositories/HistorialDeCambiosRepository';

export class RegistrarEvaluacion {
    constructor(
        private evaluacionRepo: EvaluacionRepository,
        private proyectoRepo: ProyectoRepository,
        private colaboracionRepo: ColaboracionRepository,
        private solicitudRepo: SolicitudFinalizacionRepository,
        private historialRepo: HistorialDeCambiosRepository
    ) { }

    async execute(params: {
        proyectoId: number;
        solicitudId: number;
        colaboradorId: number;
        voto: VotoEvaluacion;
        justificacion?: string;
    }): Promise<void> {
        // 1. Validar estao del proyecto
        const proyecto = await this.proyectoRepo.findById(params.proyectoId);
        if (!proyecto) throw new Error('Proyecto no encontrado');
        if (proyecto.estado !== 'en_revision') {
            throw new Error(`El proyecto no está en revisión (Estado actual: ${proyecto.estado})`);
        }

        // 2. Validar permiso del Colaborador
        const colaboracion = await this.colaboracionRepo.findByProyectoAndColaborador(params.proyectoId, params.colaboradorId);
        if (!colaboracion || colaboracion.estado !== 'aprobada') {
            throw new Error('El usuario no es un colaborador activo de este proyecto.');
        }

        // 3. Verificar si ya votó
        const existente = await this.evaluacionRepo.findBySolicitudAndColaborador(params.solicitudId, params.colaboradorId);
        if (existente) throw new Error('Ya has enviado tu evaluación para esta solicitud.');

        // 4. Crear Evaluación
        const nuevaEvaluacion = new Evaluacion({
            solicitud_id: params.solicitudId,
            colaborador_id: params.colaboradorId,
            voto: params.voto,
            justificacion: params.justificacion
        });

        const ev = await this.evaluacionRepo.create(nuevaEvaluacion);

        // Registro de Auditoría: El Voto
        await this.historialRepo.create({
            tipo_objeto: 'evaluacion',
            id_objeto: ev.id_evaluacion || 0,
            accion: 'creacion',
            atributo_afectado: 'registro',
            valor_anterior: '-',
            valor_nuevo: String(ev.id_evaluacion),
            justificacion: params.justificacion,
            usuario_id: params.colaboradorId
        });

        // 5. Lógica de consenso y umbral
        if (params.voto === 'rechazado') {
            // Caso rechazo:
            const rechazosPrevios = await this.proyectoRepo.countSolicitudesRechazadas(params.proyectoId)
            const nuevoEstado = rechazosPrevios >= 2 ? 'en_auditoria' : 'pendiente_solicitud_cierre';
            
            const estadoAnterior = proyecto.estado ?? 'en_revision';
            await this.proyectoRepo.updateEstado(params.proyectoId, nuevoEstado);
            
            // Auditoría: Cambio de estado del Proyecto por rechazo
            await this.historialRepo.create({
                tipo_objeto: 'proyecto',
                id_objeto: params.proyectoId,
                accion: 'cambio_estado',
                atributo_afectado: 'estado',
                valor_anterior: estadoAnterior,
                valor_nuevo: nuevoEstado,
                justificacion: `Rechazo automático por voto negativo. Rechazos acumulados: ${rechazosPrevios + 1}`,
                usuario_id: params.colaboradorId
            });

            await this.solicitudRepo.updateEstado(params.solicitudId, 'rechazada');
            
            // Auditoría: Cierre de la Solicitud
            await this.historialRepo.create({
                tipo_objeto: 'solicitud_finalizacion',
                id_objeto: params.solicitudId,
                accion: 'edicion',
                atributo_afectado: 'estado',
                valor_anterior: 'pendiente',
                valor_nuevo: 'rechazada',
                justificacion: 'Solicitud rechazada por voto negativo del colaborador',
                usuario_id: params.colaboradorId
            });
        } else {
            // Caso aprobado: verificar si todos aprobaron
            const conteo = await this.evaluacionRepo.countVotosBySolicitud(params.solicitudId);

            // Contar colaboradores activos
            const colaboradores = await this.colaboracionRepo.findByProyecto(params.proyectoId);
            const totalActivos = colaboradores.filter(c => c.estado === 'aprobada').length;

            if (conteo.aprobados >= totalActivos) {
                // Hay consenso -> proyecto completado
                const estadoAnterior = proyecto.estado ?? 'en_revision';
                await this.proyectoRepo.updateEstado(params.proyectoId, 'completado');
                
                // Auditoría: Proyecto Completado
                await this.historialRepo.create({
                    tipo_objeto: 'proyecto',
                    id_objeto: params.proyectoId,
                    accion: 'cambio_estado',
                    atributo_afectado: 'estado',
                    valor_anterior: estadoAnterior,
                    valor_nuevo: 'completado',
                    justificacion: 'Proyecto completado por consenso de colaboradores',
                    usuario_id: params.colaboradorId
                });

                await this.solicitudRepo.updateEstado(params.solicitudId, 'aprobada');

                // Auditoría: Solicitud Aprobada
                await this.historialRepo.create({
                    tipo_objeto: 'solicitud_finalizacion',
                    id_objeto: params.solicitudId,
                    accion: 'edicion',
                    atributo_afectado: 'estado',
                    valor_anterior: 'pendiente',
                    valor_nuevo: 'aprobada',
                    justificacion: 'Solicitud aprobada por consenso',
                    usuario_id: params.colaboradorId
                });
            }
        }
    }
}
