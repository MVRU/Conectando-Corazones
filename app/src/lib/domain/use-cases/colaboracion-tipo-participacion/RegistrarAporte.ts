import type { ColaboracionTipoParticipacionRepository } from '../../repositories/ColaboracionTipoParticipacionRepository';
import type { ColaboracionRepository } from '../../repositories/ColaboracionRepository';
import type { ParticipacionPermitidaRepository } from '../../repositories/ParticipacionPermitidaRepository';
import type { ProyectoRepository } from '../../repositories/ProyectoRepository';
import { ColaboracionTipoParticipacion } from '../../entities/ColaboracionTipoParticipacion';

export interface RegistrarAporteInput {
    colaboracion_id: number;
    participacion_permitida_id: number;
    cantidad: number;
}

export class RegistrarAporte {
    constructor(
        private aporteRepo: ColaboracionTipoParticipacionRepository,
        private colaboracionRepo: ColaboracionRepository,
        private participacionPermitidaRepo: ParticipacionPermitidaRepository,
        private proyectoRepo: ProyectoRepository
    ) { }

    async execute(
        data: RegistrarAporteInput,
        usuarioId: number
    ): Promise<ColaboracionTipoParticipacion> {
        if (!data.colaboracion_id) {
            throw new Error('El ID de la colaboración es requerido.');
        }
        if (!data.participacion_permitida_id) {
            throw new Error('El ID de la participación permitida es requerido.');
        }

        // Restricción de acceso
        const colaboracion = await this.colaboracionRepo.findById(data.colaboracion_id);
        if (!colaboracion) {
            throw new Error('Colaboración no encontrada.');
        }
        if (colaboracion.colaborador_id !== usuarioId) {
            throw new Error('No tenés permiso para registrar aportes en esta colaboración.');
        }
        if (colaboracion.estado !== 'aprobada') {
            throw new Error('Solo colaboradores con solicitud aprobada pueden registrar aportes.');
        }

        // Validar participacionPermitida
        const participacionPermitida = await this.participacionPermitidaRepo.findById(
            data.participacion_permitida_id
        );
        if (!participacionPermitida) {
            throw new Error('La participación permitida no existe.');
        }
        if (participacionPermitida.id_proyecto !== colaboracion.proyecto_id) {
            throw new Error(
                'El aporte debe corresponder a una ParticipacionPermitida activa en el proyecto.'
            );
        }

        const proyecto = await this.proyectoRepo.findById(colaboracion.proyecto_id!);
        if (!proyecto) {
            throw new Error('Proyecto no encontrado.');
        }
        if (!proyecto.estaActivo()) {
            throw new Error('No se pueden registrar aportes en proyectos que no están en curso.');
        }

        // Crear aporte + métricas + auditoría
        const aporte = new ColaboracionTipoParticipacion({
            colaboracion_id: data.colaboracion_id,
            participacion_permitida_id: data.participacion_permitida_id,
            cantidad: data.cantidad
        });

        return await this.aporteRepo.upsertConActualizacionMetricas(
            aporte,
            usuarioId
        );
    }
}
