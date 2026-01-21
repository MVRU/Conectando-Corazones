import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { onDestroy, onMount } from 'svelte';
import { FILTROS_INICIALES, type createProyectosFiltros } from '../stores/proyectosFiltros';

type ProyectosFiltros = ReturnType<typeof createProyectosFiltros>;

export function useProyectosFiltrosUrl(filtros: ProyectosFiltros) {
	const {
		consultaBusqueda,
		filtroParticipacion,
		categoriaSeleccionada,
		tipoUbicacion,
		provinciaSeleccionada,
		localidadSeleccionada,
		fechaDesde,
		fechaHasta,
		estadoSeleccionado,
		criterioOrden,
		mostrarFiltros,
		tiposParticipacionDisponibles
	} = filtros;

	// Inicializar filtros desde la URL
	onMount(() => {
		const params = get(page).url.searchParams;

		if (params.has('q')) consultaBusqueda.set(params.get('q') || '');
		if (params.has('participacion')) filtroParticipacion.set(params.getAll('participacion'));
		if (params.has('categorias')) categoriaSeleccionada.set(params.getAll('categorias'));
		if (params.has('ubicacion'))
			tipoUbicacion.set(
				(params.get('ubicacion') as typeof FILTROS_INICIALES.tipoUbicacion) ||
					FILTROS_INICIALES.tipoUbicacion
			);
		if (params.has('provincia')) provinciaSeleccionada.set(params.get('provincia') || 'Todas');
		if (params.has('localidad')) localidadSeleccionada.set(params.get('localidad') || 'Todas');
		if (params.has('desde')) fechaDesde.set(params.get('desde') || '');
		if (params.has('hasta')) fechaHasta.set(params.get('hasta') || '');
		if (params.has('estados')) estadoSeleccionado.set(params.getAll('estados'));
		if (params.has('orden'))
			criterioOrden.set(
				(params.get('orden') as typeof FILTROS_INICIALES.criterioOrden) ||
					FILTROS_INICIALES.criterioOrden
			);
		if (params.get('filtros') === 'true') mostrarFiltros.set(true);
	});

	// Actualizar URL cuando cambian los filtros
	let timeout: ReturnType<typeof setTimeout>;

	const updateUrl = () => {
		if (!browser) return;

		clearTimeout(timeout);
		timeout = setTimeout(() => {
			const url = new URL(window.location.href);
			const params = url.searchParams;

			// Helper para array params
			const setArrayParam = (key: string, values: string[]) => {
				params.delete(key);
				values.forEach((v) => params.append(key, v));
			};

			const $consultaBusqueda = get(consultaBusqueda);
			const $filtroParticipacion = get(filtroParticipacion);
			const $tiposParticipacionDisponibles = get(tiposParticipacionDisponibles);
			const $categoriaSeleccionada = get(categoriaSeleccionada);
			const $tipoUbicacion = get(tipoUbicacion);
			const $provinciaSeleccionada = get(provinciaSeleccionada);
			const $localidadSeleccionada = get(localidadSeleccionada);
			const $fechaDesde = get(fechaDesde);
			const $fechaHasta = get(fechaHasta);
			const $estadoSeleccionado = get(estadoSeleccionado);
			const $criterioOrden = get(criterioOrden);
			const $mostrarFiltros = get(mostrarFiltros);

			// Actualizar params
			if ($consultaBusqueda) params.set('q', $consultaBusqueda);
			else params.delete('q');

			if (
				$filtroParticipacion.length > 0 &&
				$filtroParticipacion.length !== $tiposParticipacionDisponibles.length - 1
			) {
				setArrayParam('participacion', $filtroParticipacion);
			} else {
				params.delete('participacion');
			}

			if ($categoriaSeleccionada.length > 0) setArrayParam('categorias', $categoriaSeleccionada);
			else params.delete('categorias');

			if ($tipoUbicacion !== FILTROS_INICIALES.tipoUbicacion)
				params.set('ubicacion', $tipoUbicacion);
			else params.delete('ubicacion');

			if ($provinciaSeleccionada !== FILTROS_INICIALES.provinciaSeleccionada)
				params.set('provincia', $provinciaSeleccionada);
			else params.delete('provincia');

			if ($localidadSeleccionada !== FILTROS_INICIALES.localidadSeleccionada)
				params.set('localidad', $localidadSeleccionada);
			else params.delete('localidad');

			if ($fechaDesde) params.set('desde', $fechaDesde);
			else params.delete('desde');
			if ($fechaHasta) params.set('hasta', $fechaHasta);
			else params.delete('hasta');

			if ($estadoSeleccionado.length > 0) setArrayParam('estados', $estadoSeleccionado);
			else params.delete('estados');

			if ($criterioOrden !== FILTROS_INICIALES.criterioOrden) params.set('orden', $criterioOrden);
			else params.delete('orden');

			if ($mostrarFiltros) params.set('filtros', 'true');
			else params.delete('filtros');

			goto(url, { replaceState: true, noScroll: true, keepFocus: true });
		}, 300);
	};

	const unsubs = [
		consultaBusqueda.subscribe(() => browser && updateUrl()),
		filtroParticipacion.subscribe(() => browser && updateUrl()),
		categoriaSeleccionada.subscribe(() => browser && updateUrl()),
		tipoUbicacion.subscribe(() => browser && updateUrl()),
		provinciaSeleccionada.subscribe(() => browser && updateUrl()),
		localidadSeleccionada.subscribe(() => browser && updateUrl()),
		fechaDesde.subscribe(() => browser && updateUrl()),
		fechaHasta.subscribe(() => browser && updateUrl()),
		estadoSeleccionado.subscribe(() => browser && updateUrl()),
		criterioOrden.subscribe(() => browser && updateUrl()),
		mostrarFiltros.subscribe(() => browser && updateUrl())
	];

	onDestroy(() => {
		unsubs.forEach((unsub) => unsub());
		clearTimeout(timeout);
	});
}
