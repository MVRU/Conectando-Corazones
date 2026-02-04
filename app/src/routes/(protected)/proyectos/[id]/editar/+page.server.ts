import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { TipoParticipacionDescripcion } from '$lib/domain/types/TipoParticipacion';
import type {
	ParticipacionForm,
	UbicacionFormulario
} from '$lib/domain/types/forms/CrearProyectoForm';
import type { UbicacionPresencial } from '$lib/domain/types/Ubicacion';
import type { Proyecto } from '$lib/domain/entities/Proyecto';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresCategoriaRepository } from '$lib/infrastructure/supabase/postgres/categoria.repo';
import { PostgresTipoParticipacionRepository } from '$lib/infrastructure/supabase/postgres/tipo-participacion.repo';
import { GetAllCategorias } from '$lib/domain/use-cases/maestros/GetAllCategorias';
import { GetAllTiposParticipacion } from '$lib/domain/use-cases/maestros/GetAllTiposParticipacion';
import { UNIDADES_POR_TIPO } from '$lib/utils/constants';

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
			const presencialData = esPresencial ? (real as unknown as UbicacionPresencial) : undefined;

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

	const permitidas = (proyectoOriginal.participacion_permitida || []).map((p) => {
		const tipoDesc = p.tipo_participacion?.descripcion as TipoParticipacionDescripcion;
		const standardUnits = (UNIDADES_POR_TIPO[tipoDesc] as unknown as string[]) || [];
		const isStandard = standardUnits.includes(p.unidad_medida as any);

		return {
			id_participacion_permitida: p.id_participacion_permitida,
			tipo_participacion: p.tipo_participacion,
			objetivo: p.objetivo,
			actual: p.actual || 0,
			unidad_medida: isStandard
				? p.unidad_medida
				: p.unidad_medida
					? 'Otra'
					: standardUnits[0] || 'unidades',
			especie: p.especie,
			unidad_medida_otra: isStandard ? undefined : p.unidad_medida
		};
	});

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

	// Instanciar repos
	const proyectoRepo = new PostgresProyectoRepository();
	const categoriaRepo = new PostgresCategoriaRepository();
	const tipoRepo = new PostgresTipoParticipacionRepository();

	const proyectoOriginal = await proyectoRepo.findById(idProyecto);

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

	// Cargar listas maestras para el formulario
	const getAllCategorias = new GetAllCategorias(categoriaRepo);
	const getAllTipos = new GetAllTiposParticipacion(tipoRepo);

	const [categorias, tiposParticipacion] = await Promise.all([
		getAllCategorias.execute(),
		getAllTipos.execute()
	]);

	const fechaFinTentativa = formatearFechaParaInput(proyectoOriginal.fecha_fin_tentativa);
	const ubicaciones = mapearUbicaciones(proyectoOriginal);
	const { seleccionados: tiposParticipacionSeleccionados, permitidas: participacionesPermitidas } =
		mapearParticipaciones(proyectoOriginal);
	const beneficiarios = proyectoOriginal.beneficiarios
		? Number(proyectoOriginal.beneficiarios)
		: undefined;

	// TODO: Las categorías en proyectoOriginal vienen como objetos (proyectoOriginal.categorias),
	// pero el formulario espera IDs en categoriasSeleccionadas.
	// Asumimos que proyectoOriginal.categorias está poblado por el repo/mapper.
	const categoriasSeleccionadas =
		proyectoOriginal.categorias?.map((c) => c.id_categoria!).filter(Boolean) || [];

	const esEdicionRestringida = proyectoOriginal.esEdicionRestringida();

	if (proyectoOriginal.estaEnAuditoria()) {
		throw error(400, 'El proyecto está en auditoría y no permite modificaciones.');
	}

	if (proyectoOriginal.estaFinalizado()) {
		throw error(400, 'No se pueden editar proyectos completados o cancelados.');
	}

	// El proyecto es editable si es borrador O si está activo pero con restricciones
	const esEditable = proyectoOriginal.esBorrador() || proyectoOriginal.estaActivo();
	if (!esEditable) {
		throw error(400, 'El proyecto no puede ser editado en su estado actual.');
	}

	return JSON.parse(
		JSON.stringify({
			form: {
				titulo: proyectoOriginal.titulo || '',
				descripcion: proyectoOriginal.descripcion || '',
				urlPortada: proyectoOriginal.url_portada || '',
				fechaFinTentativa,
				beneficiarios,
				categoriasSeleccionadas,
				categoriaOtraDescripcion: '',
				ubicaciones,
				tiposParticipacionSeleccionados,
				participacionesPermitidas
			},
			esEdicionRestringida,
			esAdmin,
			originales: {
				fechaFin: fechaFinTentativa,
				beneficiarios,
				participacionesOriginales: proyectoOriginal.participacion_permitida
					? proyectoOriginal.participacion_permitida.map((p) => ({ ...p, proyecto: undefined }))
					: []
			},
			categorias,
			tiposParticipacion,
			proyectoId: idProyecto
		})
	);
};
