import { Proyecto } from '../../entities/Proyecto';
import type { ProyectoRepository } from '../../repositories/ProyectoRepository';

import { Categoria } from '../../entities/Categoria';
import { ParticipacionPermitida } from '../../entities/ParticipacionPermitida';
import { Ubicacion } from '../../entities/Ubicacion';

export class EditarProyecto {
	constructor(private proyectoRepo: ProyectoRepository) {}

	async execute(id_proyecto: number, data: any, usuarioId: number): Promise<Proyecto> {
		const proyectoExistente = await this.proyectoRepo.findById(id_proyecto);

		if (!proyectoExistente) {
			throw new Error('El proyecto no existe.');
		}

		// 1. Validar que el usuario sea el dueño del proyecto
		if (proyectoExistente.institucion_id !== usuarioId) {
			throw new Error('No tenés permisos para editar este proyecto.');
		}

		// 2. Validar que el proyecto sea editable según reglas de negocio
		if (!proyectoExistente.esEditable()) {
			throw new Error(
				'El proyecto no puede ser editado: debe estar "en curso" y no tener colaboradores aprobados.'
			);
		}

		// 3. Mapear datos del DTO a la estructura de la entidad
		const updateProps: any = { ...data };

		// Mapeo de Categorías (si vienen IDs)
		if (data.categoria_ids) {
			updateProps.categorias = data.categoria_ids.map(
				(id: number) => new Categoria({ id_categoria: id, descripcion: '' })
			);
		}

		// Mapeo de Participaciones (si viene el formato del formulario)
		if (data.participaciones) {
			updateProps.participacion_permitida = data.participaciones.map(
				(p: any) =>
					new ParticipacionPermitida({
						id_participacion_permitida: p.id_participacion_permitida,
						tipo_participacion: { descripcion: p.tipo_participacion } as any,
						objetivo: p.objetivo,
						unidad_medida: p.unidad_medida,
						especie: p.especie,
						actual: p.actual
					})
			);
		}

		// Mapeo de Ubicaciones (si viene el formato del formulario)
		if (data.ubicaciones) {
			updateProps.ubicaciones = data.ubicaciones.map((u: any) => ({
				id_proyecto_ubicacion: u.id_proyecto_ubicacion,
				ubicacion: new Ubicacion({
					id_ubicacion: u.id_ubicacion,
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
			}));
		}

		// 4. Crear la nueva instancia de entidad con los datos actualizados para validación de dominio
		const proyectoActualizado = new Proyecto({
			...proyectoExistente,
			...updateProps,
			id_proyecto: id_proyecto // Asegurar que el ID no cambie
		});

		// 5. Persistir los cambios
		return await this.proyectoRepo.update(proyectoActualizado);
	}
}
