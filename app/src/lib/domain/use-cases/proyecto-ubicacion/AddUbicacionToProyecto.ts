import type { ProyectoUbicacionRepository } from '$lib/domain/repositories/ProyectoUbicacionRepository';
import type { ProyectoUbicacion } from '$lib/domain/entities/ProyectoUbicacion';
import type { UbicacionCreate } from '$lib/domain/types/dto/UbicacionCreate';

export interface AddUbicacionToProyectoInput {
    proyectoId: number;
    ubicacion: UbicacionCreate;
}

const ESTADOS_BLOQUEADOS = ['completado', 'cancelado', 'en_auditoria'];

export class AddUbicacionToProyecto {
    constructor(private readonly repository: ProyectoUbicacionRepository) { }

    async execute(input: AddUbicacionToProyectoInput): Promise<ProyectoUbicacion> {
        const { proyectoId, ubicacion } = input;

        // Validar ID del proyecto
        if (!proyectoId || proyectoId <= 0) {
            throw new Error('El ID del proyecto debe ser un número positivo');
        }

        // Validar datos de ubicación
        this.validarUbicacion(ubicacion);

        // Validar que el proyecto no esté en estado bloqueado
        const estadoProyecto = await this.repository.getEstadoProyecto(proyectoId);

        if (!estadoProyecto) {
            throw new Error('Proyecto no encontrado');
        }

        if (ESTADOS_BLOQUEADOS.includes(estadoProyecto)) {
            throw new Error(
                `No se pueden agregar ubicaciones a un proyecto en estado "${estadoProyecto}"`
            );
        }

        // Validar que no exista una ubicación equivalente
        const existeDuplicada = await this.repository.existsUbicacionEquivalente(proyectoId, ubicacion);
        if (existeDuplicada) {
            throw new Error('Ya existe una ubicación con los mismos datos en este proyecto');
        }

        // Crear ubicación y relación en transacción
        return this.repository.createWithUbicacion(proyectoId, ubicacion);
    }

    private validarUbicacion(ubicacion: UbicacionCreate): void {
        if (!ubicacion.tipo_ubicacion || ubicacion.tipo_ubicacion.trim() === '') {
            throw new Error('El tipo de ubicación es requerido');
        }

        if (!ubicacion.modalidad || !['presencial', 'virtual'].includes(ubicacion.modalidad)) {
            throw new Error('La modalidad debe ser "presencial" o "virtual"');
        }

        if (ubicacion.modalidad === 'presencial') {
            const dir = ubicacion.direccion_presencial;
            if (!dir) {
                throw new Error('Los datos de dirección son requeridos para ubicaciones presenciales');
            }
            if (!dir.calle || dir.calle.trim() === '') {
                throw new Error('La calle es obligatoria para ubicaciones presenciales');
            }
            if (!dir.numero || dir.numero.trim() === '') {
                throw new Error('El número es obligatorio para ubicaciones presenciales');
            }
            if (!dir.localidad_id) {
                throw new Error('La localidad es obligatoria para ubicaciones presenciales');
            }
        }
    }
}
