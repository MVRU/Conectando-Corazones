import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import { Colaboracion } from '$lib/domain/entities/Colaboracion';

export class CrearColaboracion {
	constructor(
		private colaboracionRepository: ColaboracionRepository,
		private proyectoRepository: ProyectoRepository
	) {}

	async execute(data: {
		proyecto_id: number;
		colaborador_id: number;
		mensaje?: string;
	}): Promise<Colaboracion> {
		const proyecto = await this.proyectoRepository.findById(data.proyecto_id);
		if (!proyecto) {
			throw new Error('Proyecto no encontrado.');
		}
		if (!proyecto.estaActivo()) {
			throw new Error('No se pueden enviar solicitudes si el proyecto no está en curso.');
		}

		const existente = await this.colaboracionRepository.findByProyectoAndColaborador(
			data.proyecto_id,
			data.colaborador_id
		);

		if (existente && existente.estado !== 'anulada') {
			throw new Error('Ya tenés una solicitud activa para este proyecto.');
		}

		const colaboracion = new Colaboracion({
			proyecto_id: data.proyecto_id,
			colaborador_id: data.colaborador_id,
			mensaje: data.mensaje,
			estado: 'pendiente',
			created_at: new Date()
		});

		return await this.colaboracionRepository.create(colaboracion);
	}
}
