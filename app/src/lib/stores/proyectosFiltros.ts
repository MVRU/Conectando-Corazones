import type { Proyecto } from '$lib/domain/types/Proyecto';

import {
	filtrarProyectos,
	filtrarPorTipoUbicacion,
	filtrarPorRangoFechas,
	obtenerLocalidadesDisponibles,
	filtrarPorLocalidad
} from '$lib/utils/util-proyectos';
import { writable, derived, type Writable } from 'svelte/store';
import { ESTADO_LABELS } from '$lib/domain/types/Estado';
import { calcularProgresoTotal } from '$lib/utils/util-progreso';

/**
 * Valores iniciales para los filtros de proyectos.
 */
export const FILTROS_INICIALES = {
	mostrarFiltros: false,
	filtroParticipacion: [] as string[],
	categoriaSeleccionada: [] as string[],
	tipoUbicacion: 'Todas' as 'Todas' | 'Presencial' | 'Virtual',
	provinciaSeleccionada: 'Todas',
	localidadSeleccionada: 'Todas',
	fechaDesde: '',
	fechaHasta: '',
	estadoSeleccionado: [] as string[],
	criterioOrden: 'recientes' as 'recientes' | 'antiguos' | 'mayor_progreso' | 'menor_progreso'
};

/**
 * Composable para gestionar el estado de filtros de proyectos.
 */
export function createProyectosFiltros(initialProyectos: Proyecto[] = []) {
	const proyectos = writable<Proyecto[]>(initialProyectos);

	// Stores de estado de filtros
	const mostrarFiltros = writable(FILTROS_INICIALES.mostrarFiltros);
	const filtroParticipacion = writable(FILTROS_INICIALES.filtroParticipacion);
	const categoriaSeleccionada = writable(FILTROS_INICIALES.categoriaSeleccionada);
	const tipoUbicacion = writable(FILTROS_INICIALES.tipoUbicacion);
	const provinciaSeleccionada = writable(FILTROS_INICIALES.provinciaSeleccionada);
	const localidadSeleccionada = writable(FILTROS_INICIALES.localidadSeleccionada);
	const fechaDesde = writable(FILTROS_INICIALES.fechaDesde);
	const fechaHasta = writable(FILTROS_INICIALES.fechaHasta);
	const estadoSeleccionado = writable(FILTROS_INICIALES.estadoSeleccionado);
	const criterioOrden = writable(FILTROS_INICIALES.criterioOrden);
	const consultaBusqueda = writable('');

	const proyectosFiltrados = derived(
		[
			proyectos,
			searchQueryStore(consultaBusqueda),
			filtroParticipacion,
			estadoSeleccionado,
			provinciaSeleccionada,
			categoriaSeleccionada,
			tipoUbicacion,
			fechaDesde,
			fechaHasta,
			localidadSeleccionada
		],
		([
			$proyectos,
			$search,
			$participacion,
			$estado,
			$provincia,
			$categoria,
			$tipoUbicacion,
			$fechaDesde,
			$fechaHasta,
			$localidad
		]) => {
			let resultado = filtrarProyectos(
				$proyectos,
				$participacion,
				$search,
				$estado,
				$provincia,
				$categoria
			);

			resultado = filtrarPorTipoUbicacion(resultado, $tipoUbicacion);

			resultado = filtrarPorRangoFechas(resultado, $fechaDesde, $fechaHasta);

			resultado = filtrarPorLocalidad(resultado, $localidad, $tipoUbicacion);

			return resultado;
		}
	);

	const proyectosOrdenados = derived(
		[proyectosFiltrados, criterioOrden],
		([$proyectos, $criterio]) => {
			return [...$proyectos].sort((a, b) => {
				if ($criterio === 'recientes' || $criterio === 'antiguos') {
					const fechaA = new Date(a.created_at || '').getTime();
					const fechaB = new Date(b.created_at || '').getTime();
					return $criterio === 'recientes' ? fechaB - fechaA : fechaA - fechaB;
				} else {
					const progA = calcularProgresoTotal(a);
					const progB = calcularProgresoTotal(b);
					return $criterio === 'mayor_progreso' ? progB - progA : progA - progB;
				}
			});
		}
	);

	const categoriasDisponibles = writable<string[]>(['Todas']);
	const provinciasDisponibles = writable<string[]>(['Todas']);
	const estadosDisponibles = writable<string[]>(['Todos']);
	const tiposParticipacionDisponibles = writable<string[]>(['Todos']);

	/**
	 * Calcula las localidades disponibles basadas en los proyectos y provincia seleccionada
	 */
	function calcularLocalidadesDisponibles(proyectos: Proyecto[], provincia: string): string[] {
		return obtenerLocalidadesDisponibles(proyectos, provincia);
	}

	/**
	 * Restablece todos los filtros a sus valores iniciales
	 */
	function restablecerFiltros() {
		mostrarFiltros.set(FILTROS_INICIALES.mostrarFiltros);
		filtroParticipacion.set(FILTROS_INICIALES.filtroParticipacion);
		categoriaSeleccionada.set(FILTROS_INICIALES.categoriaSeleccionada);
		tipoUbicacion.set(FILTROS_INICIALES.tipoUbicacion);
		provinciaSeleccionada.set(FILTROS_INICIALES.provinciaSeleccionada);
		localidadSeleccionada.set(FILTROS_INICIALES.localidadSeleccionada);
		fechaDesde.set(FILTROS_INICIALES.fechaDesde);
		fechaHasta.set(FILTROS_INICIALES.fechaHasta);
		estadoSeleccionado.set(FILTROS_INICIALES.estadoSeleccionado);
		consultaBusqueda.set('');
	}

	return {
		// Stores de estado (writable)
		proyectos,
		mostrarFiltros,
		filtroParticipacion,
		categoriaSeleccionada,
		tipoUbicacion,
		provinciaSeleccionada,
		localidadSeleccionada,
		fechaDesde,
		fechaHasta,
		estadoSeleccionado,
		criterioOrden,
		consultaBusqueda,

		// Stores derivados (readonly)
		proyectosOrdenados,
		provinciasDisponibles,
		estadosDisponibles,
		tiposParticipacionDisponibles,

		// Datos estáticos
		categoriasDisponibles,

		// Funciones
		calcularLocalidadesDisponibles,
		restablecerFiltros
	};
}

function searchQueryStore(store: Writable<string>) {
	return store;
}
