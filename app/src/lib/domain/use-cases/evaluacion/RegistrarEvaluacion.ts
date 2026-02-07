import { Evaluacion, type VotoEvaluacion } from '$lib/domain/entities/Evaluacion';
import type { EvaluacionRepository } from '$lib/domain/repositories/EvaluacionRepository';
import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';

export class RegistrarEvaluacion {
    constructor(
        private evaluacionRepo: EvaluacionRepository,
        private proyectoRepo: ProyectoRepository,
        private colaboracionRepo: ColaboracionRepository
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

        await this.evaluacionRepo.create(nuevaEvaluacion);

        // 5. Lógica de consenso y umbral
        if (params.voto === 'rechazado') {
            // Caso rechazo:
            const rechazosPrevios = await this.proyectoRepo.countSolicitudesRechazadas(params.proyectoId)
            if (rechazosPrevios >= 2) {
                // 2 previos + 1 actual = 3 => Auditoría
                await this.proyectoRepo.updateEstado(params.proyectoId, 'en_auditoria');
            } else {
                // Menos de 3 => Vuelve a pendiente_solicitud_cierre
                await this.proyectoRepo.updateEstado(params.proyectoId, 'pendiente_solicitud_cierre');
            }

            // TODO: Marcar la Solicitud actual como 'rechazada'
        } else {
            // Caso aprobado: verificar si todos aprobaron
            const conteo = await this.evaluacionRepo.countVotosBySolicitud(params.solicitudId);

            // Contar colaboradores activos
            const colaboradores = await this.colaboracionRepo.findByProyecto(params.proyectoId);
            const totalActivos = colaboradores.filter(c => c.estado === 'aprobada').length;

            if (conteo.aprobados >= totalActivos) {
                // Hay consenso -> proyecto completado
                await this.proyectoRepo.updateEstado(params.proyectoId, 'completado');
                // TODO: Marcar Solicitud como 'aprobada'
            }
        }
    }
}
