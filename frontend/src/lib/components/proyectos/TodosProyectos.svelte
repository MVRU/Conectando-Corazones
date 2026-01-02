<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import { mockProyectos as defaultProyectos } from '$lib/mocks/mock-proyectos';
	import ProyectoCard from '$lib/components/ui/cards/ProyectoCard.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import ProyectosBase from './ProyectosBase.svelte';
	import ProyectosFiltro from './ProyectosFiltro.svelte';
	import { usuario } from '$lib/stores/auth';
	import { writable } from 'svelte/store';
	import type { TipoParticipacionDescripcion } from '$lib/types/TipoParticipacion';
	import { createProyectosFiltros, FILTROS_INICIALES } from '$lib/composables/useProyectosFiltros';

	export let proyectos: Proyecto[] = defaultProyectos;

	// Usar utilidades compartidas
	const filtrosUtils = createProyectosFiltros();

	// Estado de búsqueda
	let consultaBusqueda = writable('');

	// Estado de filtros (usando valores iniciales compartidos)
	let mostrarFiltros = false;
	let filtroParticipacion = FILTROS_INICIALES.filtroParticipacion;
	let categoriaSeleccionada = FILTROS_INICIALES.categoriaSeleccionada;
	let tipoUbicacion = FILTROS_INICIALES.tipoUbicacion;
	let provinciaSeleccionada = FILTROS_INICIALES.provinciaSeleccionada;
	let localidadSeleccionada = FILTROS_INICIALES.localidadSeleccionada;
	let fechaDesde = FILTROS_INICIALES.fechaDesde;
	let fechaHasta = FILTROS_INICIALES.fechaHasta;
	let estadoSeleccionado = FILTROS_INICIALES.estadoSeleccionado;
	let criterioOrden = FILTROS_INICIALES.criterioOrden;

	// Calcular localidades disponibles usando utilidad compartida
	$: localidadesDisponibles = filtrosUtils.calcularLocalidadesDisponibles(
		proyectos,
		provinciaSeleccionada
	);

	// Función para restablecer filtros
	function restablecerFiltros() {
		filtroParticipacion = FILTROS_INICIALES.filtroParticipacion;
		categoriaSeleccionada = FILTROS_INICIALES.categoriaSeleccionada;
		tipoUbicacion = FILTROS_INICIALES.tipoUbicacion;
		provinciaSeleccionada = FILTROS_INICIALES.provinciaSeleccionada;
		localidadSeleccionada = FILTROS_INICIALES.localidadSeleccionada;
		fechaDesde = FILTROS_INICIALES.fechaDesde;
		fechaHasta = FILTROS_INICIALES.fechaHasta;
		estadoSeleccionado = FILTROS_INICIALES.estadoSeleccionado;
		consultaBusqueda.set('');
	}
</script>

<section class="w-full bg-gradient-to-b from-gray-50 to-white px-4 pb-6 pt-2 sm:px-10 lg:px-20">
	<ProyectosBase
		{proyectos}
		titulo="Proyectos solidarios"
		placeholderBusqueda="Buscar por título o institución..."
		textoVacio="No hay proyectos disponibles"
		descripcionVacia="Probá con otro tipo de participación o reiniciá los filtros."
		bind:categoriaSeleccionada
		bind:tipoUbicacion
		bind:localidadSeleccionada
		bind:fechaDesde
		bind:fechaHasta
		bind:criterioOrden
		filtroParticipacionSeleccionado={filtroParticipacion}
		bind:estadoSeleccionado
		bind:provinciaSeleccionada
	>
		<svelte:fragment
			slot="filtros-personalizados"
			let:resetFiltros
			let:provinciasDisponibles
			let:estadosDisponibles
			let:tiposParticipacion
		>
			<ProyectosFiltro
				prefijoId="todos-proyectos"
				bind:mostrar={mostrarFiltros}
				bind:participacion={filtroParticipacion}
				bind:categoria={categoriaSeleccionada}
				categoriasDisponibles={filtrosUtils.categoriasDisponibles}
				bind:tipoUbicacion
				bind:provincia={provinciaSeleccionada}
				bind:localidad={localidadSeleccionada}
				bind:fechaDesde
				bind:fechaHasta
				{provinciasDisponibles}
				{localidadesDisponibles}
				{tiposParticipacion}
				mostrarEstado={true}
				bind:estado={estadoSeleccionado}
				{estadosDisponibles}
				bind:criterioOrden
				on:reset={restablecerFiltros}
				on:ubicacionChange={() => {
					provinciaSeleccionada = 'Todas';
					localidadSeleccionada = 'Todas';
				}}
				on:toggle={() => (mostrarFiltros = !mostrarFiltros)}
			/>
		</svelte:fragment>

		<svelte:fragment slot="card" let:proyecto>
			<ProyectoCard {proyecto} usuario={$usuario} mostrarBotones={true} />
		</svelte:fragment>
		<svelte:fragment slot="empty-action">
			<Button label="Limpiar filtros" on:click={restablecerFiltros} />
		</svelte:fragment>
	</ProyectosBase>
</section>
