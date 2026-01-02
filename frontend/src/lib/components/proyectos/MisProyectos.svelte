<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { Usuario } from '$lib/types/Usuario';
	import { mockProyectos as proyectosPorDefecto } from '$lib/mocks/mock-proyectos';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { writable } from 'svelte/store';
	import { Plus, Search } from 'lucide-svelte';
	import { filtrarProyectosPorUsuario } from '$lib/utils/util-proyectos';
	import { type TipoParticipacionDescripcion } from '$lib/types/TipoParticipacion';
	import { createProyectosFiltros, FILTROS_INICIALES } from '$lib/composables/useProyectosFiltros';
	import ProyectosFiltro from './ProyectosFiltro.svelte';
	import ProyectosBase from './ProyectosBase.svelte';
	import ProyectoCard from '$lib/components/ui/cards/ProyectoCard.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let usuario: Usuario | null = null;
	export let proyectos: Proyecto[] = proyectosPorDefecto;

	const filtrosUtils = createProyectosFiltros();

	let pestanaActiva: 'todos' | 'activos' | 'completados' =
		($page.url.searchParams.get('estado') as 'todos' | 'activos' | 'completados') || 'activos';

	let consultaBusqueda = writable('');

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

	$: {
		const estadoUrl = $page.url.searchParams.get('estado') as 'todos' | 'activos' | 'completados';
		if (
			estadoUrl &&
			['todos', 'activos', 'completados'].includes(estadoUrl) &&
			estadoUrl !== pestanaActiva
		) {
			pestanaActiva = estadoUrl;
		}
	}

	function cambiarPestana(nuevaPestana: 'todos' | 'activos' | 'completados') {
		pestanaActiva = nuevaPestana;
		const url = new URL($page.url);
		url.searchParams.set('estado', nuevaPestana);
		goto(url, { replaceState: true, keepFocus: true, noScroll: true });
	}

	$: proyectosUsuario = filtrarProyectosPorUsuario(proyectos, usuario);

	// Calcular localidades disponibles usando utilidad compartida
	$: localidadesDisponibles = filtrosUtils.calcularLocalidadesDisponibles(
		proyectosUsuario,
		provinciaSeleccionada
	);

	// Textos dinámicos
	$: tituloSeccion =
		pestanaActiva === 'todos'
			? 'Todos mis proyectos'
			: pestanaActiva === 'activos'
				? 'Mis proyectos activos'
				: 'Mis proyectos completados';

	$: tituloVacio =
		pestanaActiva === 'activos'
			? 'No tenés proyectos activos'
			: pestanaActiva === 'completados'
				? 'No tenés proyectos completados'
				: 'No hay proyectos';

	$: descripcionVacia =
		pestanaActiva === 'activos'
			? 'Los proyectos en curso o pendientes aparecerán acá.'
			: pestanaActiva === 'completados'
				? 'Los proyectos que finalicen o se cancelen aparecerán acá.'
				: 'No tenés ningún proyecto asociado a tu cuenta.';

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
	}

	$: filtroCustom = (proyectosInput: Proyecto[]) => {
		if (pestanaActiva === 'todos') return proyectosInput;
		if (pestanaActiva === 'activos') {
			return proyectosInput.filter((p) => p.estado !== 'completado' && p.estado !== 'cancelado');
		}
		if (pestanaActiva === 'completados') {
			return proyectosInput.filter((p) => p.estado === 'completado' || p.estado === 'cancelado');
		}
		return proyectosInput;
	};
</script>

<section class="w-full bg-gradient-to-b from-gray-50 to-white px-6 pb-6 pt-8 sm:px-10 lg:px-20">
	<ProyectosBase
		proyectos={proyectosUsuario}
		titulo={tituloSeccion}
		textoVacio={tituloVacio}
		{descripcionVacia}
		bind:categoriaSeleccionada
		bind:tipoUbicacion
		bind:localidadSeleccionada
		bind:fechaDesde
		bind:fechaHasta
		bind:criterioOrden
		filtroParticipacionSeleccionado={filtroParticipacion}
		bind:estadoSeleccionado
		bind:provinciaSeleccionada
		customFilter={filtroCustom}
	>
		<svelte:fragment slot="header-actions">
			<div class="mb-4 flex flex-wrap justify-center gap-3">
				<button
					class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 {pestanaActiva ===
					'todos'
						? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500'
						: 'bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 hover:text-gray-900'}"
					on:click={() => cambiarPestana('todos')}
				>
					Todos
				</button>
				<button
					class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 {pestanaActiva ===
					'activos'
						? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500'
						: 'bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 hover:text-gray-900'}"
					on:click={() => cambiarPestana('activos')}
				>
					Activos
				</button>
				<button
					class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 {pestanaActiva ===
					'completados'
						? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500'
						: 'bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 hover:text-gray-900'}"
					on:click={() => cambiarPestana('completados')}
				>
					Completados
				</button>
			</div>
		</svelte:fragment>

		<svelte:fragment
			slot="filtros-personalizados"
			let:resetFiltros
			let:provinciasDisponibles
			let:estadosDisponibles
			let:tiposParticipacion
		>
			<ProyectosFiltro
				prefijoId="mis-proyectos"
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
				mostrarEstado={pestanaActiva === 'todos'}
				bind:estado={estadoSeleccionado}
				{estadosDisponibles}
				bind:criterioOrden
				on:reset={() => {
					restablecerFiltros();
					resetFiltros();
				}}
				on:ubicacionChange={() => {
					provinciaSeleccionada = 'Todas';
					localidadSeleccionada = 'Todas';
				}}
				on:toggle={() => (mostrarFiltros = !mostrarFiltros)}
			/>
		</svelte:fragment>

		<svelte:fragment slot="card" let:proyecto>
			<ProyectoCard
				{proyecto}
				{usuario}
				variant="mis-proyectos"
				esInstitucion={usuario?.rol === 'institucion'}
			/>
		</svelte:fragment>

		<svelte:fragment slot="empty-action" let:resetFiltros>
			<Button
				label="Limpiar filtros"
				on:click={() => {
					restablecerFiltros();
					resetFiltros();
				}}
			/>
		</svelte:fragment>
	</ProyectosBase>

	{#if usuario?.rol === 'institucion'}
		<a
			href="/proyectos/crear"
			class="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#007fff] px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-[#55aaff] hover:shadow-xl sm:bottom-8 sm:right-8"
			aria-label="Crear nuevo proyecto"
		>
			<Plus size={24} />
			<span class="font-medium">Crear proyecto</span>
		</a>
	{:else if usuario?.rol === 'colaborador'}
		<a
			href="/proyectos"
			class="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#007fff] px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-[#55aaff] hover:shadow-xl sm:bottom-8 sm:right-8"
			aria-label="Descubrir proyectos"
		>
			<Search size={24} />
			<span class="font-medium">Descubrir proyectos</span>
		</a>
	{/if}
</section>
