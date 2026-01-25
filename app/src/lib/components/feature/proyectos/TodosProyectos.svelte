<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import ProyectoCard from '$lib/components/ui/cards/ProyectoCard.svelte';
	import ProyectosBase from './ProyectosBase.svelte';
	import { usuario } from '$lib/stores/auth';
	import { createProyectosFiltros } from '$lib/stores/proyectosFiltros';
	import { useProyectosFiltrosUrl } from '$lib/utils/proyectosFiltrosUrl';

	export let proyectos: Proyecto[] = defaultProyectos;
	export let provinciasDisponibles: string[] = [];

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
		provinciasDisponibles: provinciasDisponiblesStore,
		estadosDisponibles,
		tiposParticipacionDisponibles,
		calcularLocalidadesDisponibles,
		restablecerFiltros
	} = filtros;

	useProyectosFiltrosUrl(filtros);

	$: proyectosStore.set(proyectos);
	$: if (provinciasDisponibles.length > 0) {
		provinciasDisponiblesStore.set(provinciasDisponibles);
	}

	export function cambiarTab(tab: string) {
		// Implementar lógica de cambio de tab si es necesario
	}
</script>

<section class="w-full bg-gradient-to-b from-gray-50 to-white px-6 pt-8 pb-6 sm:px-10 lg:px-20">
	<ProyectosBase
		proyectos={$proyectosOrdenados}
		titulo="Todos los proyectos"
		textoVacio="No hay proyectos disponibles"
		descripcionVacia="Actualmente no hay proyectos publicados."
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
		provinciasDisponibles={provinciasDisponibles.length > 0
			? provinciasDisponibles
			: $provinciasDisponiblesStore}
		estadosDisponibles={$estadosDisponibles}
		tiposParticipacionDisponibles={$tiposParticipacionDisponibles}
		{calcularLocalidadesDisponibles}
		{restablecerFiltros}
	>
		<svelte:fragment slot="card" let:proyecto>
			<ProyectoCard {proyecto} usuario={$usuario} />
		</svelte:fragment>
	</ProyectosBase>
</section>
