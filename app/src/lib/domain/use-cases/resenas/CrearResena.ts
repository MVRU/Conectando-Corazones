import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';
import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { HistorialDeCambiosRepository } from '$lib/domain/repositories/HistorialDeCambiosRepository';
import { Resena } from '$lib/domain/entities/Resena';
import type { TipoObjetoResena } from '$lib/domain/types/Resena';

const ESTADOS_VALIDOS = ['aprobada'] as const;
type EstadoValido = typeof ESTADOS_VALIDOS[number];

interface CrearResenaInput {
	tipo_objeto: TipoObjetoResena;
	id_objeto: number;
	contenido: string;
	puntaje: number;
	autor_id: number;
	username: string;
	rol?: string;
}

export class CrearResena {
	constructor(
		private resenaRepository: ResenaRepository,
		private colaboracionRepository: ColaboracionRepository,
		private proyectoRepository: ProyectoRepository,
		private historialRepo: HistorialDeCambiosRepository
	) { }

	async execute(input: CrearResenaInput): Promise<Resena> {
		// 1. Validar duplicado
		const existente = await this.resenaRepository.findByAutorAndObjeto(
			input.autor_id,
			input.tipo_objeto,
			input.id_objeto
		);
		if (existente) {
			throw new Error('Ya escribiste una reseña para este elemento.');
		}

		// 2. Regla de negocio: Si reseña un proyecto, debe ser o haber sido colaborador del mismo
		if (input.tipo_objeto === 'proyecto') {
			let colaboraciones;
			try {
				colaboraciones = await this.colaboracionRepository.findByColaborador(input.autor_id);
			} catch {
				throw new Error('Error al verificar tu participación en el proyecto.');
			}

			const participoEnProyecto = colaboraciones.some(
				(c) =>
					c.proyecto_id === input.id_objeto &&
					ESTADOS_VALIDOS.includes(c.estado as EstadoValido)
			);

			if (!participoEnProyecto) {
				throw new Error('Debés tener una colaboración aprobada en este proyecto para poder reseñarlo.');
			}
		}

		// 3. Regla de negocio: Si reseña a un colaborador ('usuario'), deben haber coincidido en un mismo proyecto
		if (input.tipo_objeto === 'usuario') {
			if (input.autor_id === input.id_objeto) {
				throw new Error('No podés reseñarte a vos mismo.');
			}

			let misColaboraciones, colaboracionesOtro, proyectosDondeIdObjetoEsDuenio, proyectosDondeAutorEsDuenio;
			try {
				[
					misColaboraciones,
					colaboracionesOtro,
					proyectosDondeIdObjetoEsDuenio,
					proyectosDondeAutorEsDuenio
				] = await Promise.all([
					this.colaboracionRepository.findByColaborador(input.autor_id),
					this.colaboracionRepository.findByColaborador(input.id_objeto),
					this.proyectoRepository.findByInstitucionId(input.id_objeto),
					this.proyectoRepository.findByInstitucionId(input.autor_id)
				]);
			} catch {
				throw new Error('Error al verificar cruce de colaboradores.');
			}

			const misProyectosIds = new Set(
				misColaboraciones
					.filter((c) => ESTADOS_VALIDOS.includes(c.estado as EstadoValido))
					.map((c) => c.proyecto_id)
			);

			const misProyectosPropiedadIds = new Set(
				proyectosDondeAutorEsDuenio.map((p) => p.id_proyecto).filter((id): id is number => id !== undefined)
			);

			// Caso A: Coincidieron como colaboradores
			const coincidieronComoColaboradores = colaboracionesOtro.some(
				(c) =>
					c.proyecto_id !== undefined &&
					misProyectosIds.has(c.proyecto_id) &&
					ESTADOS_VALIDOS.includes(c.estado as EstadoValido)
			);

			// Caso B: El usuario reseñado es el dueño (institución) de un proyecto donde colaboró el autor
			const esDuenioDeMiProyecto = proyectosDondeIdObjetoEsDuenio.some(
				(p) => p.id_proyecto !== undefined && misProyectosIds.has(p.id_proyecto)
			);

			// Caso C: El autor es el dueño (institución) de un proyecto donde colaboró el usuario reseñado
			const soyDuenioDeSuProyecto = colaboracionesOtro.some(
				(c) =>
					c.proyecto_id !== undefined &&
					misProyectosPropiedadIds.has(c.proyecto_id) &&
					ESTADOS_VALIDOS.includes(c.estado as EstadoValido)
			);

			if (!coincidieronComoColaboradores && !esDuenioDeMiProyecto && !soyDuenioDeSuProyecto) {
				throw new Error(
					'Para reseñar a este usuario, ambos deben tener una colaboración aprobada en un mismo proyecto.'
				);
			}
		}

		// 4. Persistir
		const resena = new Resena({
			tipo_objeto: input.tipo_objeto,
			id_objeto: input.id_objeto,
			contenido: input.contenido,
			puntaje: input.puntaje,
			autor_id: input.autor_id,
			username: input.username,
			rol: input.rol,
			aprobado: true
			// created_at se asigna en el constructor con new Date()
		});

		const resenaCreada = await this.resenaRepository.create(resena);

		await this.historialRepo.create({
			tipo_objeto: 'resena',
			id_objeto: resenaCreada.id_resena ?? 0,
			accion: 'creacion',
			atributo_afectado: 'registro',
			valor_anterior: '-',
			valor_nuevo: String(resenaCreada.id_resena ?? 0),
			usuario_id: input.autor_id
		});

		return resenaCreada;
	}
}
