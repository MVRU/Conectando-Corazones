import { error } from '@sveltejs/kit';
import type { IconSource } from '@steeze-ui/svelte-icon';
import type { Proyecto } from '$lib/domain/types/Proyecto';
import type { Usuario } from '$lib/domain/types/Usuario';
import type { Localidad } from '$lib/domain/entities/Localidad';
import type { Provincia } from '$lib/domain/entities/Provincia';
import type { Ubicacion, UbicacionPresencial, UbicacionVirtual } from '$lib/domain/types/Ubicacion';
import { PRIORIDAD_TIPO, type ProyectoUbicacion } from '$lib/domain/types/ProyectoUbicacion';
import { ESTADO_LABELS } from '$lib/domain/types/Estado';
import type { ParticipacionPermitida } from '$lib/domain/types/ParticipacionPermitida';
import {
	ESTADO_PRIORIDAD,
	ICONOS_UNIDAD,
	DEFAULT_PARTICIPACION_ICON,
	COLORES_UI,
	type ParticipacionVisualColor
} from './constants';

export function getProyectoById(idParam: string, lista: Proyecto[]): Proyecto {
	const idNumerico = Number(idParam);

	if (!Number.isInteger(idNumerico)) {
		throw error(404, 'ID de proyecto inválido');
	}

	const proyecto = lista.find((p) => p.id_proyecto === idNumerico);

	if (!proyecto) {
		throw error(404, 'Proyecto no encontrado');
	}

	return proyecto;
}

/**
 * Filtra proyectos según el rol del usuario
 * - Instituciones: solo sus proyectos creados
 * - Colaboradores: solo proyectos donde tienen colaboración aprobada
 */
export function filtrarProyectosPorUsuario(
	proyectos: Proyecto[],
	usuario: Usuario | null
): Proyecto[] {
	if (!usuario) return [];

	if (usuario.rol === 'institucion') {
		return proyectos.filter((p) => p.institucion_id === usuario.id_usuario);
	}

	if (usuario.rol === 'colaborador') {
		return proyectos.filter((p) =>
			p.colaboraciones?.some(
				(c) => c.colaborador_id === usuario.id_usuario && c.estado === 'aprobada'
			)
		);
	}

	return [];
}

export function filtrarProyectos(
	proyectos: Proyecto[],
	filtros: string[],
	searchQuery: string,
	estado: string[],
	provincia: string,
	categoria: string[] = []
): Proyecto[] {
	let resultado = [...proyectos];

	if (filtros.length > 0 && !filtros.includes('Todos')) {
		const tiposEsperados = filtros.filter((f) => f !== 'Todos');
		resultado = resultado.filter((p) =>
			p.participacion_permitida?.some(
				(pp) =>
					pp.tipo_participacion?.descripcion &&
					tiposEsperados.includes(pp.tipo_participacion.descripcion)
			)
		);
	}

	// Filtro por Categoría (multi-select)
	// Si el array está vacío, o incluye "Todas", no filtramos
	const categoriasActivas = categoria.filter((c) => c !== 'Todas');
	if (categoriasActivas.length > 0) {
		resultado = resultado.filter((p) =>
			p.categorias?.some((c) => categoriasActivas.includes(c.descripcion))
		);
	}

	if (estado.length > 0 && !estado.includes('Todos')) {
		resultado = resultado.filter((p) => estado.includes(ESTADO_LABELS[p.estado ?? 'en_curso']));
	}

	if (provincia !== 'Todas') {
		resultado = resultado.filter((p) =>
			p.ubicaciones?.[0]?.ubicacion && 'localidad' in p.ubicaciones[0].ubicacion
				? p.ubicaciones[0].ubicacion.localidad?.provincia?.nombre === provincia
				: false
		);
	}

	if (searchQuery.trim() !== '') {
		const query = searchQuery.trim().toLowerCase();
		resultado = resultado.filter(
			(p) =>
				p.titulo.toLowerCase().includes(query) ||
				p.institucion?.nombre_legal?.toLowerCase().includes(query)
		);
	}

	resultado.sort((a, b) => {
		const prioridadEstadoA = ESTADO_PRIORIDAD[a.estado ?? 'en_curso'] ?? 3;
		const prioridadEstadoB = ESTADO_PRIORIDAD[b.estado ?? 'en_curso'] ?? 3;

		if (prioridadEstadoA !== prioridadEstadoB) {
			return prioridadEstadoA - prioridadEstadoB;
		}

		const fechaA = new Date(a.created_at || '').getTime();
		const fechaB = new Date(b.created_at || '').getTime();
		return fechaA - fechaB;
	});

	return resultado;
}

//**
// * Utilidades para Proyecto-Ubicación
//  */

export function seleccionarUbicacion(
	ubicaciones: ProyectoUbicacion[],
	tipoPreferido: string = 'principal'
): ProyectoUbicacion | undefined {
	const especifica = ubicaciones.find((u) => u.ubicacion?.tipo_ubicacion === tipoPreferido);
	if (especifica) return especifica;

	for (const tipo of PRIORIDAD_TIPO) {
		const encontrada = ubicaciones.find((u) => u.ubicacion?.tipo_ubicacion === tipo);
		if (encontrada) return encontrada;
	}
	return undefined;
}

export const getUbicacionPrincipal = (proyecto: Proyecto): ProyectoUbicacion | undefined =>
	proyecto.ubicaciones?.find((u) => u.ubicacion?.tipo_ubicacion === 'principal') ??
	proyecto.ubicaciones?.[0];

export function getUbicacionTexto(proyecto: Proyecto, virtualLabel = 'Virtual'): string {
	const ubicacion = getUbicacionPrincipal(proyecto);
	if (!ubicacion) return virtualLabel;

	const localidadObj =
		ubicacion.ubicacion && 'localidad' in ubicacion.ubicacion
			? ubicacion.ubicacion.localidad
			: undefined;
	const ciudad = localidadObj?.nombre;
	const provincia = localidadObj?.provincia?.nombre;

	if (ciudad && provincia) return `${ciudad}, ${provincia}`;
	return ciudad ?? provincia ?? virtualLabel;
}

export function getUbicacionCorta(proyecto: Proyecto, virtualLabel = 'Virtual'): string {
	const ubicacion = getUbicacionPrincipal(proyecto);
	if (!ubicacion) return virtualLabel;

	const localidadObj =
		ubicacion.ubicacion && 'localidad' in ubicacion.ubicacion
			? ubicacion.ubicacion.localidad
			: undefined;
	const ciudad = localidadObj?.nombre;

	return ciudad ?? virtualLabel;
}

//**
// * Utilidades para Participación Permitida
//  */

type ParticipacionVisual = {
	actualLabel: string;
	objetivoLabel: string;
	color: ParticipacionVisualColor;
	icono: IconSource;
	iconColor: string;
};

export function getParticipacionVisual(p: ParticipacionPermitida): ParticipacionVisual {
	const unidad = p.unidad_medida?.toLowerCase();
	const tipo = p.tipo_participacion?.descripcion;
	const actual = p.actual ?? 0;
	const objetivo = p.objetivo ?? 0;

	if (tipo === 'Monetaria') {
		const formatter = new Intl.NumberFormat('es-AR');
		return {
			actualLabel: `$${formatter.format(actual)}`,
			objetivoLabel: `$${formatter.format(objetivo)}`,
			color: 'green',
			icono: ICONOS_UNIDAD[unidad || 'pesos'] ?? DEFAULT_PARTICIPACION_ICON,
			iconColor: COLORES_UI.green.iconColor
		};
	}

	if (tipo === 'Voluntariado') {
		const labelUnidad = unidad === 'personas' ? 'voluntarios' : unidad || 'voluntarios';
		return {
			actualLabel: `${actual} ${labelUnidad}`,
			objetivoLabel: `${objetivo} ${labelUnidad}`,
			color: 'purple',
			icono: ICONOS_UNIDAD[unidad || 'personas'] ?? DEFAULT_PARTICIPACION_ICON,
			iconColor: COLORES_UI.purple.iconColor
		};
	}

	const labelUnidad = unidad || 'unidades';
	return {
		actualLabel: `${actual} ${labelUnidad}`,
		objetivoLabel: `${objetivo} ${labelUnidad}`,
		color: 'blue',
		icono: ICONOS_UNIDAD[unidad || 'unidades'] ?? DEFAULT_PARTICIPACION_ICON,
		iconColor: COLORES_UI.sky.iconColor
	};
}

//**
// * Utilidades para Urgencia
//  */

const URGENCIA_COLOR_MAP: Record<string, string> = {
	Alta: 'text-red-600 bg-red-100',
	Media: 'text-yellow-600 bg-yellow-100',
	Baja: 'text-green-600 bg-green-100'
};

export function getColorUrgencia(urgencia?: string): string | undefined {
	if (!urgencia) return undefined; // -*- Evita clases cuando no hay urgencia definida
	return URGENCIA_COLOR_MAP[urgencia];
}

/**
 * Filtra proyectos por tipo de ubicación (Presencial/Virtual)
 */
export function filtrarPorTipoUbicacion(
	proyectos: Proyecto[],
	tipo: 'Todas' | 'Presencial' | 'Virtual'
): Proyecto[] {
	if (tipo === 'Todas') return proyectos;

	return proyectos.filter((p) => {
		const primeraUbicacion = p.ubicaciones?.[0]?.ubicacion;
		if (tipo === 'Presencial') {
			return primeraUbicacion?.modalidad === 'presencial';
		} else if (tipo === 'Virtual') {
			return primeraUbicacion?.modalidad === 'virtual';
		}
		return false;
	});
}

/**
 * Filtra proyectos por rango de fechas
 * - fechaDesde: filtra proyectos que iniciaron después de esta fecha
 * - fechaHasta: filtra proyectos que terminan antes de esta fecha
 */
export function filtrarPorRangoFechas(
	proyectos: Proyecto[],
	fechaDesde?: string,
	fechaHasta?: string
): Proyecto[] {
	if (!fechaDesde && !fechaHasta) return proyectos;

	return proyectos.filter((p) => {
		const fechaInicio = p.created_at ? new Date(p.created_at) : null;
		const fechaFin = p.fecha_fin_tentativa ? new Date(p.fecha_fin_tentativa) : null;

		if (!fechaInicio || !fechaFin) return false;

		// Si fechaDesde es antes del inicio del proyecto → NO aparece
		if (fechaDesde) {
			const desde = new Date(fechaDesde);
			if (fechaInicio < desde) return false;
		}

		// Si fechaHasta es después del fin del proyecto → NO aparece
		if (fechaHasta) {
			const hasta = new Date(fechaHasta);
			if (fechaFin > hasta) return false;
		}

		return true;
	});
}

/**
 * Formatea una fecha o string de fecha a un formato "5 Feb 2025"
 * Capitaliza la primera letra del mes.
 */
export function formatearFechaBadge(date: Date | string | null | undefined): string {
	if (!date) return '-';
	const d = new Date(date);
	const partes = new Intl.DateTimeFormat('es-AR', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).formatToParts(d);

	const dia = partes.find((p) => p.type === 'day')?.value;
	const mes = partes.find((p) => p.type === 'month')?.value;
	const anio = partes.find((p) => p.type === 'year')?.value;

	if (dia && mes && anio) {
		const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
		return `${dia} ${mesCapitalizado} ${anio}`;
	}

	return formatearFecha(date);
}

/**
 * Formatea una fecha o string de fecha a un formato "DD MMM YYYY" (03 Feb 2025)
 */
export function formatearFecha(date: Date | string | null | undefined): string {
	if (!date) return '-';
	const d = new Date(date);
	return new Intl.DateTimeFormat('es-AR', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	}).format(d);
}

//**
// * Utilidades para Filtrado de Ubicaciones
//  */

/**
 * Obtiene todas las localidades únicas disponibles para una provincia específica
 * a partir de una lista de proyectos.
 * (Cumple con la lógica de negocio de mostrar solo lo que tiene resultados)
 */
export function obtenerLocalidadesDisponibles(proyectos: Proyecto[], provincia: string): string[] {
	if (provincia === 'Todas') return ['Todas'];

	const localidadesSet = new Set<string>();
	proyectos.forEach((p) => {
		// Buscamos en todas las ubicaciones del proyecto
		p.ubicaciones?.forEach((pu) => {
			const u = pu.ubicacion;
			if (u && u.modalidad === 'presencial' && u.localidad) {
				// Comprobamos si la provincia coincide (por nombre para simplificar en UI)
				if (u.localidad.provincia?.nombre === provincia) {
					localidadesSet.add(u.localidad.nombre);
				}
			}
		});
	});

	return ['Todas', ...Array.from(localidadesSet).sort()];
}

/**
 * Obtiene la provincia de una localidad de forma segura.
 */
export function getProvinciaFromLocalidad(localidad: Localidad | undefined): Provincia | undefined {
	return localidad?.provincia;
}

/**
 * Filtra los proyectos por localidad y tipo de ubicación.
 * respeta la modalidad presencial/virtual.
 */
export function filtrarPorLocalidad(
	proyectos: Proyecto[],
	localidad: string,
	tipoUbicacion: string
): Proyecto[] {
	if (localidad === 'Todas' || tipoUbicacion === 'Virtual') return proyectos;

	return proyectos.filter((p) => {
		return p.ubicaciones?.some((pu) => {
			const u = pu.ubicacion;
			return u && u.modalidad === 'presencial' && u.localidad?.nombre === localidad;
		});
	});
}

/**
 * Type guard verifica si una ubicación es presencial
 */
export function esUbicacionPresencial(u: Ubicacion | undefined): u is UbicacionPresencial {
	return u?.modalidad === 'presencial';
}

/**
 * Type guard verifica si una ubicación es virtual
 */
export function esUbicacionVirtual(u: Ubicacion | undefined): u is UbicacionVirtual {
	return u?.modalidad === 'virtual';
}

/**
 * Construye una dirección legible para mostrar
 */
export function construirDireccionCompleta(u: UbicacionPresencial): string {
	const parts = [
		u.calle ? `${u.calle} ${u.numero}` : '',
		u.piso ? `Piso ${u.piso}` : '',
		u.departamento ? `Dpto ${u.departamento}` : '',
		u.localidad?.nombre,
		u.localidad?.provincia?.nombre
	];
	return parts.filter(Boolean).join(', ');
}

/**
 * Genera una URL de búsqueda en Google Maps si no existe una específica
 */
export function generarUrlGoogleMaps(u: UbicacionPresencial): string {
	if (u.url_google_maps) return u.url_google_maps;

	const query = [
		u.calle,
		u.numero,
		u.localidad?.nombre,
		u.localidad?.provincia?.nombre,
		'Argentina'
	]
		.filter(Boolean)
		.join(' ');

	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
