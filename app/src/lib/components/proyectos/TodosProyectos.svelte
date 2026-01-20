<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import { mockProyectos as defaultProyectos } from '$lib/mocks/mock-proyectos';
	import ProyectoCard from '$lib/components/ui/cards/ProyectoCard.svelte';
	import ProyectosBase from './ProyectosBase.svelte';
	import { usuario } from '$lib/stores/auth';
	import { createProyectosFiltros } from '$lib/composables/useProyectosFiltros';
	import { useProyectosFiltrosUrl } from '$lib/composables/useProyectosFiltrosUrl';

	export let proyectos: Proyecto[] = defaultProyectos;

	// Inicializar composable de filtros
	const filtros = createProyectosFiltros();

	const {
		proyectos: proyectosStore,
		proyectosOrdenados,
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
		categoriasDisponibles,
		provinciasDisponibles,
		estadosDisponibles,
		tiposParticipacionDisponibles,
		calcularLocalidadesDisponibles,
		restablecerFiltros
	} = filtros;

	$: proyectosStore.set(proyectos);

	// Sincronizar filtros con URL
	useProyectosFiltrosUrl(filtros);
</script>

<section class="w-full bg-gradient-to-b from-gray-50 to-white px-4 pt-2 pb-6 sm:px-10 lg:px-20">
	<ProyectosBase
		proyectos={$proyectosOrdenados}
		titulo="Proyectos solidarios"
		placeholderBusqueda="Buscar por título o institución..."
		textoVacio="No hay proyectos disponibles"
		descripcionVacia="Probá con otro tipo de participación o reiniciá los filtros."
		mostrarEstado={true}
		prefijoIdFiltros="todos-proyectos"
		{mostrarFiltros}
		{filtroParticipacion}
		{categoriaSeleccionada}
		{tipoUbicacion}
		{provinciaSeleccionada}
		{localidadSeleccionada}
		{fechaDesde}
		{fechaHasta}
		{estadoSeleccionado}
		{criterioOrden}
		{consultaBusqueda}
		{categoriasDisponibles}
		provinciasDisponibles={$provinciasDisponibles}
		estadosDisponibles={$estadosDisponibles}
		tiposParticipacionDisponibles={$tiposParticipacionDisponibles}
		{calcularLocalidadesDisponibles}
		{restablecerFiltros}
	>
		<svelte:fragment slot="card" let:proyecto>
			<ProyectoCard {proyecto} usuario={$usuario} mostrarBotones={true} />
		</svelte:fragment>
	</ProyectosBase>
</section>
