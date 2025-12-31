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
	import { type EstadoDescripcion, ESTADO_LABELS } from '$lib/types/Estado';
	import ProyectosFiltro from './ProyectosFiltro.svelte';
	import ProyectosLista from './ProyectosLista.svelte';

	export let proyectos: Proyecto[] = proyectosPorDefecto;
	export let usuario: Usuario | null = null;

	// Estados generales
	let pestanaActiva: 'todos' | 'activos' | 'completados' = 'todos';
	let consultaBusqueda = writable('');

	const tiposParticipacion: ('Todos' | TipoParticipacionDescripcion)[] = [
		'Todos',
		...(Object.keys(TIPO_PARTICIPACION_LABELS) as TipoParticipacionDescripcion[])
	];

	// Estados unificados para filtros
	let mostrarFiltros = false;
	let filtroParticipacion: 'Todos' | TipoParticipacionDescripcion = 'Todos';
	let tipoUbicacion: 'Todas' | 'Presencial' | 'Virtual' = 'Todas';
	let provinciaSeleccionada = 'Todas';
	let localidadSeleccionada = 'Todas';
	let estadoSeleccionado = 'Todos';
	let fechaDesde = '';
	let fechaHasta = '';

	// Estados para filtrar proyectos por estado
	const estadosActivos: EstadoDescripcion[] = [
		'en_curso',
		'pendiente_solicitud_cierre',
		'en_revision',
		'en_auditoria'
	];
	const estadoCompletado: EstadoDescripcion = 'completado';

	$: proyectosDelUsuario = filtrarProyectosPorUsuario(proyectos, usuario);

	// Estados disponibles para el dropdown
	const estadosDisponibles = ['Todos', ...Object.values(ESTADO_LABELS)];

	// Filtrar proyectos según el tab activo
	$: proyectosPorTab = proyectosDelUsuario.filter((p) => {
		if (pestanaActiva === 'todos') return true;
		if (pestanaActiva === 'activos') return p.estado && estadosActivos.includes(p.estado);
		if (pestanaActiva === 'completados') return p.estado === estadoCompletado;
		return true;
	});

	$: provinciasDisponibles = obtenerProvinciasDisponibles(proyectosPorTab);

	$: localidadesDisponibles = obtenerLocalidadesDisponibles(proyectosPorTab, provinciaSeleccionada);

	// Proyectos visibles con todos los filtros aplicados
	$: proyectosVisibles = aplicarFiltrosAdicionales(
		filtrarProyectos(
			proyectosPorTab,
			[filtroParticipacion],
			$consultaBusqueda,
			pestanaActiva === 'todos' ? estadoSeleccionado : 'Todos',
			provinciaSeleccionada
		),
		tipoUbicacion,
		localidadSeleccionada,
		fechaDesde,
		fechaHasta
	);

	function aplicarFiltrosAdicionales(
		ProyectosLista: Proyecto[],
		tipoUbicacion: 'Todas' | 'Presencial' | 'Virtual',
		localidad: string,
		fechaDesde: string,
		fechaHasta: string
	): Proyecto[] {
		let resultado = ProyectosLista;

		// Filtrar por tipo de ubicación
		resultado = filtrarPorTipoUbicacion(resultado, tipoUbicacion);

		// Filtrar por localidad
		resultado = filtrarPorLocalidad(resultado, localidad, tipoUbicacion);

		// Filtrar por rango de fechas
		resultado = filtrarPorRangoFechas(resultado, fechaDesde, fechaHasta);

		return resultado;
	}

	function restablecerFiltros() {
		filtroParticipacion = 'Todos';
		tipoUbicacion = 'Todas';
		provinciaSeleccionada = 'Todas';
		localidadSeleccionada = 'Todas';
		estadoSeleccionado = 'Todos';
		fechaDesde = '';
		fechaHasta = '';
		consultaBusqueda.set('');
	}

	// Reset localidad cuando cambia provincia
	$: if (provinciaSeleccionada) {
		localidadSeleccionada = 'Todas';
	}

	$: tituloSeccion =
		pestanaActiva === 'todos'
			? 'Todos mis proyectos'
			: pestanaActiva === 'activos'
				? 'Mis proyectos activos'
				: 'Mis proyectos completados';

	$: etiquetaEstado =
		pestanaActiva === 'todos' ? undefined : pestanaActiva === 'activos' ? 'activo' : 'completado';

	$: tituloVacio =
		pestanaActiva === 'todos'
			? 'No tenés proyectos'
			: pestanaActiva === 'activos'
				? 'No tenés proyectos activos'
				: 'No tenés proyectos completados';

	$: descripcionVacia =
		pestanaActiva === 'todos'
			? 'No tenés proyectos en este momento.'
			: pestanaActiva === 'activos'
				? 'No tenés proyectos activos en este momento.'
				: 'Aún no tenés proyectos completados.';
</script>

<section class="w-full bg-gradient-to-b from-gray-50 to-white px-6 pb-6 pt-8 sm:px-10 lg:px-20">
	<!-- TABS -->
	<div class="mb-8 flex justify-center">
		<div class="inline-flex rounded-lg bg-gray-100 p-1">
			<button
				class="rounded-md px-4 py-2 text-sm font-medium transition-colors {pestanaActiva === 'todos'
					? 'bg-white text-gray-900 shadow'
					: 'text-gray-500 hover:text-gray-900'}"
				on:click={() => (pestanaActiva = 'todos')}
			>
				Todos
			</button>
			<button
				class="rounded-md px-4 py-2 text-sm font-medium transition-colors {pestanaActiva ===
				'activos'
					? 'bg-white text-gray-900 shadow'
					: 'text-gray-500 hover:text-gray-900'}"
				on:click={() => (pestanaActiva = 'activos')}
			>
				Activos
			</button>
			<button
				class="rounded-md px-4 py-2 text-sm font-medium transition-colors {pestanaActiva ===
				'completados'
					? 'bg-white text-gray-900 shadow'
					: 'text-gray-500 hover:text-gray-900'}"
				on:click={() => (pestanaActiva = 'completados')}
			>
				Completados
			</button>
		</div>
	</div>

	<ProyectosLista
		proyectos={proyectosVisibles}
		bind:consultaBusqueda={$consultaBusqueda}
		titulo={tituloSeccion}
		esHistorial={pestanaActiva === 'completados'}
		{usuario}
		{etiquetaEstado}
		{tituloVacio}
		{descripcionVacia}
	>
		<ProyectosFiltro
			slot="filtros-content"
			prefijoId="mis-proyectos"
			bind:mostrar={mostrarFiltros}
			bind:participacion={filtroParticipacion}
			bind:tipoUbicacion
			bind:provincia={provinciaSeleccionada}
			bind:localidad={localidadSeleccionada}
			bind:fechaDesde
			bind:fechaHasta
			{provinciasDisponibles}
			{localidadesDisponibles}
			{tiposParticipacion}
			mostrarEstado={pestanaActiva === 'todos'}
			bind:estado={estadoSeleccionado}
			{estadosDisponibles}
			on:reset={restablecerFiltros}
			on:ubicacionChange={() => {
				provinciaSeleccionada = 'Todas';
				localidadSeleccionada = 'Todas';
			}}
			on:toggle={() => (mostrarFiltros = !mostrarFiltros)}
		/>

		<Button slot="empty-action" label="Limpiar filtros" on:click={restablecerFiltros} />
	</ProyectosLista>
</section>
