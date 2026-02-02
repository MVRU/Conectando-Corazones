import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';
import { Colaboracion } from '$lib/domain/entities/Colaboracion';

export class CrearColaboracion {
	constructor(
		private colaboracionRepository: ColaboracionRepository,
		private proyectoRepository: ProyectoRepository,
		private usuarioRepository: UsuarioRepository
	) {}

	async execute(data: {
		proyecto_id: number;
		colaborador_id: number;
		mensaje?: string;
	}): Promise<Colaboracion> {
		// 1. Validar que el usuario existe y es un colaborador
		const usuario = await this.usuarioRepository.findById(data.colaborador_id);
		if (!usuario) {
			throw new Error('Usuario no encontrado.');
		}
		if (usuario.rol !== 'colaborador') {
			throw new Error('Solo los usuarios con rol Colaborador pueden postularse.');
		}

		// 2. Validar que el proyecto existe
		const proyecto = await this.proyectoRepository.findById(data.proyecto_id);
		if (!proyecto) {
			throw new Error('Proyecto no encontrado.');
		}

		// 3. Validar estado del proyecto: solo "en_curso"
		if (!proyecto.estaActivo()) {
			throw new Error('Solo se permiten postulaciones si el proyecto está en curso.');
		}

		// 4. Validación de unicidad: un colaborador no puede enviar más de una solicitud al mismo proyecto
		const existente = await this.colaboracionRepository.findByProyectoAndColaborador(
			data.proyecto_id,
			data.colaborador_id
		);

		if (existente && existente.estado !== 'anulada') {
			throw new Error('Ya tenés una solicitud activa para este proyecto.');
		}

		// 5. Crear la colaboración (el estado inicial por defecto en la entidad es 'pendiente')
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
