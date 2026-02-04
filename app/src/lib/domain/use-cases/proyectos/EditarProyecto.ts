import { Proyecto } from '../../entities/Proyecto';
import type { ProyectoRepository } from '../../repositories/ProyectoRepository';

import { Categoria } from '../../entities/Categoria';
import { ParticipacionPermitida } from '../../entities/ParticipacionPermitida';
import { Ubicacion } from '../../entities/Ubicacion';

import type { HistorialDeCambiosRepository } from '../../repositories/HistorialDeCambiosRepository';

export class EditarProyecto {
	constructor(
		private proyectoRepo: ProyectoRepository,
		private historialDeCambiosRepo: HistorialDeCambiosRepository
	) {}

	async execute(
		id_proyecto: number,
		data: any,
		usuarioId: number,
		usuarioRol?: string
	): Promise<Proyecto> {
		const proyectoExistente = await this.proyectoRepo.findById(id_proyecto);

		if (!proyectoExistente) {
			throw new Error('El proyecto no existe.');
		}

		// 1. Bloqueo por auditoría
		if (proyectoExistente.estaEnAuditoria() && usuarioRol !== 'administrador') {
			throw new Error('El proyecto está en auditoría y no permite modificaciones.');
		}

		// 2. Inmutabilidad de finalización
		if (proyectoExistente.estaFinalizado()) {
			throw new Error('No se pueden editar proyectos completados o cancelados.');
		}

		// 3. Validar que el usuario sea el dueño del proyecto o administrador
		if (proyectoExistente.institucion_id !== usuarioId && usuarioRol !== 'administrador') {
			throw new Error('No tenés permisos para editar este proyecto.');
		}

		// 4. Restricción de campos prohibidos una vez publicado
		if (proyectoExistente.estaPublicado() && usuarioRol !== 'administrador') {
			if (data.titulo && data.titulo !== proyectoExistente.titulo) {
				throw new Error('No podés cambiar el título de un proyecto ya publicado.');
			}

			// Validar categorías
			if (data.categoria_ids) {
				const idsOriginales = (proyectoExistente.categorias || [])
					.map((c) => c.id_categoria)
					.sort();
				const idsNuevos = [...data.categoria_ids].sort();

				if (JSON.stringify(idsOriginales) !== JSON.stringify(idsNuevos)) {
					throw new Error('No podés cambiar las categorías de un proyecto ya publicado.');
				}
			}
		}

		// 5. Validaciones de Solo Aumento
		if (proyectoExistente.estaPublicado()) {
			// 6.a Fecha de finalización: nunca adelantar
			if (data.fecha_fin_tentativa && proyectoExistente.fecha_fin_tentativa) {
				const nuevaFecha = new Date(data.fecha_fin_tentativa);
				const originalFecha = new Date(proyectoExistente.fecha_fin_tentativa);
				if (nuevaFecha < originalFecha) {
					throw new Error('La fecha de fin tentativa solo puede ser postergada, nunca adelantada.');
				}
			}

			// 6.b Beneficiarios: solo aumentar
			if (data.beneficiarios !== undefined && proyectoExistente.beneficiarios !== null) {
				const nuevo = Number(data.beneficiarios);
				const original = Number(proyectoExistente.beneficiarios);
				if (nuevo < original) {
					throw new Error('La cantidad de beneficiarios solo puede aumentar.');
				}
			}
		}

		// 6. Validar cambios en participaciones permitidas
		if (data.participaciones) {
			const nuevasParticipaciones = data.participaciones;
			const originales = proyectoExistente.participacion_permitida || [];

			// Bloqueo de eliminación si está publicado o tiene interacciones
			const IDsNuevos = nuevasParticipaciones
				.map((p: any) => p.id_participacion_permitida)
				.filter(Boolean);

			const huboEliminacion = originales.some(
				(orig) => !IDsNuevos.includes(orig.id_participacion_permitida)
			);

			if (
				huboEliminacion &&
				(proyectoExistente.estaPublicado() || proyectoExistente.tieneInteracciones()) &&
				usuarioRol !== 'administrador'
			) {
				throw new Error(
					'No se pueden eliminar tipos de participación si el proyecto ya está publicado o tiene colaboraciones.'
				);
			}

			// Prohibición de cambiar la naturaleza (tipo) una vez publicado
			if (proyectoExistente.estaPublicado() && usuarioRol !== 'administrador') {
				for (const pNueva of nuevasParticipaciones) {
					if (pNueva.id_participacion_permitida) {
						const original = originales.find(
							(o) => o.id_participacion_permitida === pNueva.id_participacion_permitida
						);
						if (
							original &&
							original.tipo_participacion?.descripcion !== pNueva.tipo_participacion
						) {
							throw new Error(
								`No podés cambiar el tipo de ayuda de una participación existente una vez publicado el proyecto (${original.tipo_participacion?.descripcion} -> ${pNueva.tipo_participacion}).`
							);
						}
					}
				}
			}
		}

		// 7. Mapear datos del DTO a la estructura de la entidad
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

		// 8. Mapeo de Ubicaciones y validación de No Eliminación
		if (data.ubicaciones) {
			const existentes = proyectoExistente.ubicaciones || [];
			const idsNuevos = data.ubicaciones
				.map((u: any) => Number(u.id_proyecto_ubicacion))
				.filter((id: number) => !isNaN(id) && id > 0);

			// Verificar si alguna ubicación original no está en el nuevo payload
			const ubicacionEliminada = existentes.some(
				(orig) => !idsNuevos.includes(Number(orig.id_proyecto_ubicacion))
			);

			if (
				ubicacionEliminada &&
				proyectoExistente.estaPublicado() &&
				usuarioRol !== 'administrador'
			) {
				throw new Error('No se pueden eliminar ubicaciones existentes de un proyecto publicado.');
			}

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

		// 9. Crear la nueva instancia de entidad con los datos actualizados para validación de dominio
		const proyectoActualizado = new Proyecto({
			...proyectoExistente,
			...updateProps,
			id_proyecto: id_proyecto // Asegurar que el ID no cambie
		});

		// 10. Persistir los cambios
		const result = await this.proyectoRepo.update(proyectoActualizado);

		// 11. Trazabilidad
		await this.historialDeCambiosRepo.create({
			tipo_objeto: 'proyecto',
			id_objeto: id_proyecto,
			accion: 'edicion',
			atributo_afectado: 'varios',
			valor_anterior: 'datos_previos',
			valor_nuevo: 'datos_actualizados',
			justificacion: 'Edición de proyecto por la institución',
			usuario_id: usuarioId
		});

		return result;
	}
}
