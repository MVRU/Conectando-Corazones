import { error } from '@sveltejs/kit';
import { mockProyectos } from '$lib/infrastructure/mocks/mock-proyectos';
import type { PageServerLoad } from './$types';
import type { TipoParticipacionDescripcion } from '$lib/domain/types/TipoParticipacion';
import type { ParticipacionForm, UbicacionFormulario } from '$lib/domain/types/forms/CrearProyectoForm';
import type { UbicacionPresencial } from '$lib/domain/types/Ubicacion';
import type { Proyecto } from '$lib/domain/types/Proyecto';

function formatearFechaParaInput(fechaIso: Date | string | null | undefined): string {
	if (!fechaIso) return '';
	const f = new Date(fechaIso);
	return !isNaN(f.getTime()) ? f.toISOString().split('T')[0] : '';
}

function mapearUbicaciones(proyectoOriginal: Proyecto): UbicacionFormulario[] {
	const ubicaciones = (proyectoOriginal.ubicaciones || [])
		.filter((u) => !!u.ubicacion)
		.map((u) => {
			const real = u.ubicacion!;
			const esPresencial = real.modalidad === 'presencial';
			const presencialData = esPresencial ? (real as UbicacionPresencial) : undefined;

			const ubForm: UbicacionFormulario = {
				id_proyecto_ubicacion: u.id_proyecto_ubicacion,
				tipo_ubicacion: real.tipo_ubicacion,
				modalidad: real.modalidad,
				url_virtual: real.modalidad === 'virtual' ? real.url_virtual || '' : '',
				direccion_presencial: presencialData
					? {
							calle: presencialData.calle,
							numero: presencialData.numero,
							referencia: presencialData.referencia || '',
							localidad_id: presencialData.localidad_id,
							provincia: presencialData.localidad?.provincia?.nombre || '',
							localidad_nombre: presencialData.localidad?.nombre || '',
							piso: presencialData.piso || '',
							departamento: presencialData.departamento || ''
						}
					: undefined
			};
			return ubForm;
		});

	if (ubicaciones.length === 0) {
		ubicaciones.push({
			tipo_ubicacion: 'principal',
			modalidad: '',
			direccion_presencial: {
				calle: '',
				numero: '',
				referencia: '',
				localidad_id: undefined,
				provincia: '',
				localidad_nombre: ''
			},
			url_virtual: ''
		});
	}

	return ubicaciones;
}

function mapearParticipaciones(proyectoOriginal: Proyecto): {
	seleccionados: TipoParticipacionDescripcion[];
	permitidas: ParticipacionForm[];
} {
	const seleccionados = (proyectoOriginal.participacion_permitida || [])
		.map((p) => p.tipo_participacion?.descripcion as TipoParticipacionDescripcion)
		.filter((t): t is TipoParticipacionDescripcion => !!t);

	const permitidas = (proyectoOriginal.participacion_permitida || []).map((p) => ({
		id_participacion_permitida: p.id_participacion_permitida,
		tipo_participacion: p.tipo_participacion,
		objetivo: p.objetivo,
		actual: p.actual || 0,
		unidad_medida: p.unidad_medida || 'unidades',
		especie: p.especie,
		unidad_medida_otra: undefined
	}));

	return { seleccionados, permitidas };
}

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.usuario) {
		throw error(401, { message: 'No autorizado' });
	}

	const idProyecto = Number(params.id);
	if (isNaN(idProyecto)) {
		throw error(400, 'ID de proyecto inválido');
	}

	const proyectoOriginal = mockProyectos.find((p) => p.id_proyecto === idProyecto);

	if (!proyectoOriginal) {
		throw error(404, 'Proyecto no encontrado');
	}

	const esAdmin = locals.usuario.rol === 'administrador';

	if (!esAdmin) {
		if (locals.usuario.rol !== 'institucion') {
			throw error(403, { message: 'Acceso denegado - Solo instituciones o administradores' });
		}

		if (proyectoOriginal.institucion_id !== locals.usuario.id_usuario) {
			throw error(403, { message: 'Acceso denegado - No es su proyecto' });
		}
	}

	const fechaFinTentativa = formatearFechaParaInput(proyectoOriginal.fecha_fin_tentativa);
	const ubicaciones = mapearUbicaciones(proyectoOriginal);
	const { seleccionados: tiposParticipacionSeleccionados, permitidas: participacionesPermitidas } =
		mapearParticipaciones(proyectoOriginal);
	const beneficiarios = proyectoOriginal.beneficiarios
		? Number(proyectoOriginal.beneficiarios)
		: undefined;

	return {
		form: {
			titulo: proyectoOriginal.titulo || '',
			descripcion: proyectoOriginal.descripcion || '',
			urlPortada: proyectoOriginal.url_portada || '',
			fechaFinTentativa,
			beneficiarios,
			categoriasSeleccionadas:
				proyectoOriginal.categoria_ids ||
				proyectoOriginal.categorias?.map((c) => c.id_categoria!).filter(Boolean) ||
				[],
			categoriaOtraDescripcion: '',
			ubicaciones,
			tiposParticipacionSeleccionados,
			participacionesPermitidas
		},
		originales: {
			fechaFin: fechaFinTentativa,
			beneficiarios,
			participacionesOriginales: proyectoOriginal.participacion_permitida || []
		}
	};
};
