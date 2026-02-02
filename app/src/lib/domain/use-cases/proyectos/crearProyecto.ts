import { Proyecto } from '../../entities/Proyecto';
import type { ProyectoRepository } from '../../repositories/ProyectoRepository';
import type { ProyectoCreate } from '../../types/dto/ProyectoCreate';
import { Categoria } from '../../entities/Categoria';
import { ParticipacionPermitida } from '../../entities/ParticipacionPermitida';
import { Ubicacion } from '../../entities/Ubicacion';

export class CrearProyecto {
	constructor(private proyectoRepo: ProyectoRepository) {}

	async execute(data: ProyectoCreate): Promise<Proyecto> {
		if (!data.institucion_id) {
			throw new Error('El ID de la institución es requerido.');
		}
		const proyectosExistentes = await this.proyectoRepo.findByInstitucionId(data.institucion_id);
		const enCurso = proyectosExistentes.filter((p) => p.estado === 'en_curso');

		if (enCurso.length >= 5) {
			throw new Error('No podés tener más de 5 proyectos activos al mismo tiempo.');
		}

		const proyecto = new Proyecto({
			titulo: data.titulo,
			descripcion: data.descripcion,
			url_portada: data.url_portada,
			fecha_fin_tentativa: data.fecha_fin_tentativa,
			beneficiarios: data.beneficiarios,
			institucion_id: data.institucion_id,
			categorias: data.categoria_ids.map(
				(id) => new Categoria({ id_categoria: id, descripcion: '' })
			),
			participacion_permitida: data.participaciones.map(
				(p) =>
					new ParticipacionPermitida({
						tipo_participacion: { descripcion: p.tipo_participacion } as any,
						objetivo: p.objetivo,
						unidad_medida: p.unidad_medida,
						especie: p.especie
					})
			),
			ubicaciones: data.ubicaciones.map((u) => ({
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
