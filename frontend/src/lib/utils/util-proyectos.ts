import { error } from '@sveltejs/kit';
import type { ComponentType } from 'svelte';
import type { Proyecto } from '$lib/types/Proyecto';
import { PRIORIDAD_TIPO, type ProyectoUbicacion } from '$lib/types/ProyectoUbicacion';
import { getProvinciaFromLocalidad } from '$lib/utils/util-ubicaciones';
import { ESTADO_LABELS, type EstadoDescripcion } from '$lib/types/Estado';
import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';
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

export function filtrarProyectos(
	proyectos: Proyecto[],
	filtros: string[],
	searchQuery: string,
	estado: string,
	provincia: string
): Proyecto[] {
	let resultado = [...proyectos];

	if (!filtros.includes('Todos')) {
		const tiposEsperados = filtros.filter((f) => f !== 'Todos');
		resultado = resultado.filter((p) =>
			p.participacion_permitida?.some(
				(pp) =>
					pp.tipo_participacion?.descripcion &&
					tiposEsperados.includes(pp.tipo_participacion.descripcion)
			)
		);
	}

	if (estado !== 'Todos') {
		resultado = resultado.filter((p) => ESTADO_LABELS[p.estado ?? 'en_curso'] === estado);
	}

	if (provincia !== 'Todas') {
		resultado = resultado.filter(
			(p) =>
				p.ubicaciones?.[0]?.ubicacion && 'localidad' in p.ubicaciones[0].ubicacion
					? getProvinciaFromLocalidad(p.ubicaciones[0].ubicacion.localidad)?.nombre === provincia
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
	proyecto.ubicaciones?.find((u) => u.ubicacion?.tipo_ubicacion === 'principal') ?? proyecto.ubicaciones?.[0];

export function getUbicacionTexto(proyecto: Proyecto, virtualLabel = 'Virtual'): string {
	const ubicacion = getUbicacionPrincipal(proyecto);
	if (!ubicacion) return virtualLabel;

	const localidadObj =
		ubicacion.ubicacion && 'localidad' in ubicacion.ubicacion ? ubicacion.ubicacion.localidad : undefined;
	const ciudad = localidadObj?.nombre;
	const provincia = getProvinciaFromLocalidad(localidadObj)?.nombre;

	if (ciudad && provincia) return `${ciudad}, ${provincia}`;
	return ciudad ?? provincia ?? virtualLabel;
}

export function getUbicacionCorta(proyecto: Proyecto, virtualLabel = 'Virtual'): string {
	const ubicacion = getUbicacionPrincipal(proyecto);
	if (!ubicacion) return virtualLabel;

	const localidadObj =
		ubicacion.ubicacion && 'localidad' in ubicacion.ubicacion ? ubicacion.ubicacion.localidad : undefined;
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
	icono: ComponentType;
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