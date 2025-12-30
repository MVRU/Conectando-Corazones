<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { Usuario } from '$lib/types/Usuario';
	import { mockProyectos as proyectosPorDefecto } from '$lib/mocks/mock-proyectos';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { writable } from 'svelte/store';
	import {
		obtenerProvinciasDisponibles,
		obtenerLocalidadesDisponibles,
		filtrarPorLocalidad
	} from '$lib/utils/util-ubicaciones';
	import {
		filtrarProyectos,
		filtrarProyectosPorUsuario,
		filtrarPorTipoUbicacion,
		filtrarPorRangoFechas
	} from '$lib/utils/util-proyectos';
	import {
		TIPO_PARTICIPACION_LABELS,
		type TipoParticipacionDescripcion
	} from '$lib/types/TipoParticipacion';
	import type { EstadoDescripcion } from '$lib/types/Estado';
	import ProyectosFilter from './ProyectosFilter.svelte';
	import ProyectosList from './ProyectosList.svelte';

	export let proyectos: Proyecto[] = proyectosPorDefecto;
	export let usuario: Usuario | null = null;

	// Estados independientes para cada sección
	let searchQueryActivos = writable('');
	let searchQueryHistorial = writable('');

	const tiposParticipacion: ('Todos' | TipoParticipacionDescripcion)[] = [
		'Todos',
		...(Object.keys(TIPO_PARTICIPACION_LABELS) as TipoParticipacionDescripcion[])
	];

	// Sección Proyectos Activos
	let mostrarFiltrosActivos = false;
	let filtroParticipacionActivos: 'Todos' | TipoParticipacionDescripcion = 'Todos';
	let tipoUbicacionActivos: 'Todas' | 'Presencial' | 'Virtual' = 'Todas';
	let provinciaSeleccionadaActivos = 'Todas';
	let localidadSeleccionadaActivos = 'Todas';
	let fechaDesdeActivos = '';
	let fechaHastaActivos = '';

	// Sección Historial
	let mostrarFiltrosHistorial = false;
	let filtroParticipacionHistorial: 'Todos' | TipoParticipacionDescripcion = 'Todos';
	let tipoUbicacionHistorial: 'Todas' | 'Presencial' | 'Virtual' = 'Todas';
	let provinciaSeleccionadaHistorial = 'Todas';
	let localidadSeleccionadaHistorial = 'Todas';
	let fechaDesdeHistorial = '';
	let fechaHastaHistorial = '';

	// Estados para filtrar proyectos
	const estadosActivos: EstadoDescripcion[] = [
		'en_curso',
		'pendiente_solicitud_cierre',
		'en_revision',
		'en_auditoria'
	];
	const estadoCompletado: EstadoDescripcion = 'completado';

	// Filtrar proyectos según el rol del usuario
	$: proyectosDelUsuario = filtrarProyectosPorUsuario(proyectos, usuario);

	// Filtrar proyectos por estado
	$: proyectosActivos = proyectosDelUsuario.filter(
		(p) => p.estado && estadosActivos.includes(p.estado)
	);
	$: proyectosHistorial = proyectosDelUsuario.filter((p) => p.estado === estadoCompletado);

	// Provincias disponibles para cada sección
	$: provinciasActivosDisponibles = obtenerProvinciasDisponibles(proyectosActivos);
	$: provinciasHistorialDisponibles = obtenerProvinciasDisponibles(proyectosHistorial);

	// Localidades filtradas por provincia seleccionada
	$: localidadesActivosDisponibles = obtenerLocalidadesDisponibles(
		proyectosActivos,
		provinciaSeleccionadaActivos
	);

	$: localidadesHistorialDisponibles = obtenerLocalidadesDisponibles(
		proyectosHistorial,
		provinciaSeleccionadaHistorial
	);

	// Proyectos visibles con filtros aplicados
	$: proyectosActivosVisibles = aplicarFiltrosAdicionales(
		filtrarProyectos(
			proyectosActivos,
			[filtroParticipacionActivos],
			$searchQueryActivos,
			'Todos',
			provinciaSeleccionadaActivos
		),
		tipoUbicacionActivos,
		localidadSeleccionadaActivos,
		fechaDesdeActivos,
		fechaHastaActivos
	);

	$: proyectosHistorialVisibles = aplicarFiltrosAdicionales(
		filtrarProyectos(
			proyectosHistorial,
			[filtroParticipacionHistorial],
			$searchQueryHistorial,
			'Todos',
			provinciaSeleccionadaHistorial
		),
		tipoUbicacionHistorial,
		localidadSeleccionadaHistorial,
		fechaDesdeHistorial,
		fechaHastaHistorial
	);

	function aplicarFiltrosAdicionales(
		proyectosList: Proyecto[],
		tipoUbicacion: 'Todas' | 'Presencial' | 'Virtual',
		localidad: string,
		fechaDesde: string,
		fechaHasta: string
	): Proyecto[] {
		let resultado = proyectosList;

		// Filtrar por tipo de ubicación
		resultado = filtrarPorTipoUbicacion(resultado, tipoUbicacion);

		// Filtrar por localidad
		resultado = filtrarPorLocalidad(resultado, localidad, tipoUbicacion);

		// Filtrar por rango de fechas
		resultado = filtrarPorRangoFechas(resultado, fechaDesde, fechaHasta);

		return resultado;
	}

	function resetFiltrosActivos() {
		filtroParticipacionActivos = 'Todos';
		tipoUbicacionActivos = 'Todas';
		provinciaSeleccionadaActivos = 'Todas';
		localidadSeleccionadaActivos = 'Todas';
		fechaDesdeActivos = '';
		fechaHastaActivos = '';
		searchQueryActivos.set('');
	}

	function resetFiltrosHistorial() {
		filtroParticipacionHistorial = 'Todos';
		tipoUbicacionHistorial = 'Todas';
		provinciaSeleccionadaHistorial = 'Todas';
		localidadSeleccionadaHistorial = 'Todas';
		fechaDesdeHistorial = '';
		fechaHastaHistorial = '';
		searchQueryHistorial.set('');
	}

	// Reset localidad cuando cambia provincia
	$: if (provinciaSeleccionadaActivos) {
		localidadSeleccionadaActivos = 'Todas';
	}

	$: if (provinciaSeleccionadaHistorial) {
		localidadSeleccionadaHistorial = 'Todas';
	}
</script>

<section class="w-full bg-gradient-to-b from-gray-50 to-white px-6 pb-6 pt-8 sm:px-10 lg:px-20">
	<!-- SECCIÓN: PROYECTOS ACTIVOS -->
	<ProyectosList
		proyectos={proyectosActivosVisibles}
		bind:searchQuery={$searchQueryActivos}
		titulo="Proyectos Activos"
		esHistorial={false}
		mostrarFiltros={mostrarFiltrosActivos}
		{usuario}
	>
		<ProyectosFilter
			slot="filtros-content"
			idPrefix="activos"
			bind:mostrar={mostrarFiltrosActivos}
			bind:participacion={filtroParticipacionActivos}
			bind:tipoUbicacion={tipoUbicacionActivos}
			bind:provincia={provinciaSeleccionadaActivos}
			bind:localidad={localidadSeleccionadaActivos}
			bind:fechaDesde={fechaDesdeActivos}
			bind:fechaHasta={fechaHastaActivos}
			provinciasDisponibles={provinciasActivosDisponibles}
			localidadesDisponibles={localidadesActivosDisponibles}
			{tiposParticipacion}
			on:reset={resetFiltrosActivos}
			on:ubicacionChange={() => {
				provinciaSeleccionadaActivos = 'Todas';
				localidadSeleccionadaActivos = 'Todas';
			}}
			on:toggle={() => (mostrarFiltrosActivos = !mostrarFiltrosActivos)}
		/>

		<Button slot="empty-action" label="Limpiar filtros" on:click={resetFiltrosActivos} />
	</ProyectosList>

	<!-- SECCIÓN: HISTORIAL -->
	<div class="border-t border-gray-200 pt-16">
		<ProyectosList
			proyectos={proyectosHistorialVisibles}
			bind:searchQuery={$searchQueryHistorial}
			titulo="Historial"
			esHistorial={true}
			mostrarFiltros={mostrarFiltrosHistorial}
			{usuario}
		>
			<ProyectosFilter
				slot="filtros-content"
				idPrefix="historial"
				bind:mostrar={mostrarFiltrosHistorial}
				bind:participacion={filtroParticipacionHistorial}
				bind:tipoUbicacion={tipoUbicacionHistorial}
				bind:provincia={provinciaSeleccionadaHistorial}
				bind:localidad={localidadSeleccionadaHistorial}
				bind:fechaDesde={fechaDesdeHistorial}
				bind:fechaHasta={fechaHastaHistorial}
				provinciasDisponibles={provinciasHistorialDisponibles}
				localidadesDisponibles={localidadesHistorialDisponibles}
				{tiposParticipacion}
				on:reset={resetFiltrosHistorial}
				on:ubicacionChange={() => {
					provinciaSeleccionadaHistorial = 'Todas';
					localidadSeleccionadaHistorial = 'Todas';
				}}
				on:toggle={() => (mostrarFiltrosHistorial = !mostrarFiltrosHistorial)}
			/>

			<Button slot="empty-action" label="Limpiar filtros" on:click={resetFiltrosHistorial} />
		</ProyectosList>
	</div>
</section>
