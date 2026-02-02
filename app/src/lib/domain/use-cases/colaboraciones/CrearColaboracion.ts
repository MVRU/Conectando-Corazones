import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import { Colaboracion } from '$lib/domain/entities/Colaboracion';

export class CrearColaboracion {
	constructor(private colaboracionRepository: ColaboracionRepository) {}

	async execute(data: {
		proyecto_id: number;
		colaborador_id: number;
		mensaje?: string;
	}): Promise<Colaboracion> {
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
