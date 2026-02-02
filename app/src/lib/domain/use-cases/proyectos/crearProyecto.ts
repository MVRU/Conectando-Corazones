import { Proyecto } from '../../entities/Proyecto';
import type { ProyectoRepository } from '../../repositories/ProyectoRepository';
import type { UsuarioRepository } from '../../repositories/UsuarioRepository';
import type { ProyectoCreate } from '../../types/dto/ProyectoCreate';
import { Categoria } from '../../entities/Categoria';
import { ParticipacionPermitida } from '../../entities/ParticipacionPermitida';
import { Ubicacion } from '../../entities/Ubicacion';

export class CrearProyecto {
	constructor(
		private proyectoRepo: ProyectoRepository,
		private usuarioRepo: UsuarioRepository
	) {}

	async execute(data: ProyectoCreate): Promise<Proyecto> {
		if (!data.institucion_id) {
			throw new Error('El ID de la institución es requerido.');
		}

		// 1. Validar rol del usuario
		const usuario = await this.usuarioRepo.findById(data.institucion_id);
		if (!usuario) {
			throw new Error('Institución no encontrada.');
		}

		if (usuario.rol !== 'institucion' && usuario.rol !== 'administrador') {
			throw new Error('Solo los usuarios con rol Institución pueden crear proyectos.');
		}

		// 2. Manejar estados y verificación
		let estadoFinal = data.estado || 'en_curso';
		const estaVerificada = usuario.estado_verificacion === 'aprobada';

		if (estadoFinal === 'en_curso' && !estaVerificada) {
			// Si no está verificada, solo puede ser borrador
			estadoFinal = 'borrador';
		}

		// 3. Validar límite de proyectos activos (solo si se intenta publicar)
		if (estadoFinal === 'en_curso') {
			const proyectosExistentes = await this.proyectoRepo.findByInstitucionId(data.institucion_id);
			const activos = proyectosExistentes.filter((p) => p.estado === 'en_curso');

			if (activos.length >= 5) {
				throw new Error(
					'No podés publicar más de 5 proyectos activos al mismo tiempo. Guardá tu progreso como Borrador o finalizá un proyecto existente.'
				);
			}
		}

		// 4. Mapear y crear el proyecto
		const proyecto = new Proyecto({
			titulo: data.titulo,
			descripcion: data.descripcion,
			url_portada: data.url_portada,
			fecha_fin_tentativa: data.fecha_fin_tentativa,
			beneficiarios: data.beneficiarios,
			institucion_id: data.institucion_id,
			estado: estadoFinal,
			categorias: (data.categoria_ids || []).map(
				(id) => new Categoria({ id_categoria: id, descripcion: '' })
			),
			participacion_permitida: (data.participaciones || []).map(
				(p) =>
					new ParticipacionPermitida({
						tipo_participacion: { descripcion: p.tipo_participacion } as any,
						objetivo: p.objetivo,
						unidad_medida: p.unidad_medida,
						especie: p.especie
					})
			),
			ubicaciones: (data.ubicaciones || []).map((u) => ({
				ubicacion: new Ubicacion({
					tipo_ubicacion: u.tipo_ubicacion,
					modalidad: u.modalidad,
					calle: u.direccion_presencial?.calle,
					numero: u.direccion_presencial?.numero,
					piso: u.direccion_presencial?.piso,
					departamento: u.direccion_presencial?.departamento,
					referencia: u.direccion_presencial?.referencia,
					url_google_maps: u.direccion_presencial?.url_google_maps,
					url_virtual: u.url_virtual,
					localidad_id: u.direccion_presencial?.localidad_id
				} as any)
			}))
		});

		return this.proyectoRepo.create(proyecto);
	}
}
