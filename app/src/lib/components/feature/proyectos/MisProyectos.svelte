<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import type { Usuario } from '$lib/domain/types/Usuario';
	import { Plus, Search } from 'lucide-svelte';
	import { filtrarProyectosPorUsuario } from '$lib/utils/util-proyectos';
	import { createProyectosFiltros } from '$lib/stores/proyectosFiltros';
	import { useProyectosFiltrosUrl } from '$lib/utils/proyectosFiltrosUrl';
	import ProyectosBase from './ProyectosBase.svelte';
	import ProyectoCard from '$lib/components/ui/cards/ProyectoCard.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { mockVerificaciones } from '$lib/infrastructure/mocks/mock-verificaciones';

	export let usuario: Usuario | null = null;
	export let proyectos: Proyecto[] = [];

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

	// Sincronizar filtros con URL
	useProyectosFiltrosUrl(filtros);

	let pestanaActiva: 'todos' | 'activos' | 'completados' =
		($page.url.searchParams.get('estado') as 'todos' | 'activos' | 'completados') || 'activos';

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
	$: proyectosFiltradosPestana = filtroCustom(proyectosUsuario);
	$: proyectosStore.set(proyectosFiltradosPestana);

	// Textos dinámicos
	$: tituloSeccion =
		pestanaActiva === 'todos'
			? 'Todos mis proyectos'
			: pestanaActiva === 'activos'
				? 'Mis proyectos activos'
				: 'Mis proyectos completados';

	// Verificar estado de la institución
	$: verificacion = usuario && mockVerificaciones.find((v) => v.usuario_id === usuario.id_usuario);
	$: verificationAprobada = verificacion?.estado === 'aprobada';
	$: esInstitucion = usuario?.rol === 'institucion';

	$: tituloVacio =
		pestanaActiva === 'activos'
			? 'No tenés proyectos activos'
			: pestanaActiva === 'completados'
				? 'No tenés proyectos completados'
				: 'No hay proyectos';

	$: descripcionVacia =
		esInstitucion && !verificationAprobada
			? 'No podés crear proyectos hasta que verifiques exitosamente la identidad de tu institución.'
			: pestanaActiva === 'activos'
				? 'Los proyectos en curso o pendientes aparecerán acá.'
				: pestanaActiva === 'completados'
					? 'Los proyectos que finalicen o se cancelen aparecerán acá.'
					: 'No tenés ningún proyecto asociado a tu cuenta.';

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

<section class="w-full bg-gradient-to-b from-gray-50 to-white px-6 pt-8 pb-6 sm:px-10 lg:px-20">
	<ProyectosBase
		proyectos={$proyectosOrdenados}
		titulo={tituloSeccion}
		textoVacio={tituloVacio}
		{descripcionVacia}
		mostrarEstado={pestanaActiva === 'todos'}
		prefijoIdFiltros="mis-proyectos"
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
		<svelte:fragment slot="header-actions">
			<div class="mb-4 flex flex-wrap justify-center gap-3">
				<button
					class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-gray-900/10 focus:outline-none {pestanaActiva ===
					'todos'
						? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500'
						: 'bg-white text-gray-600 ring-1 ring-gray-200 ring-inset hover:bg-gray-50 hover:text-gray-900'}"
					on:click={() => cambiarPestana('todos')}
				>
					Todos
				</button>
				<button
					class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-gray-900/10 focus:outline-none {pestanaActiva ===
					'activos'
						? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500'
						: 'bg-white text-gray-600 ring-1 ring-gray-200 ring-inset hover:bg-gray-50 hover:text-gray-900'}"
					on:click={() => cambiarPestana('activos')}
				>
					Activos
				</button>
				<button
					class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-gray-900/10 focus:outline-none {pestanaActiva ===
					'completados'
						? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500'
						: 'bg-white text-gray-600 ring-1 ring-gray-200 ring-inset hover:bg-gray-50 hover:text-gray-900'}"
					on:click={() => cambiarPestana('completados')}
				>
					Completados
				</button>
			</div>
		</svelte:fragment>

		<svelte:fragment slot="card" let:proyecto>
			<ProyectoCard
				{proyecto}
				{usuario}
				variante="mis-proyectos"
				esInstitucion={usuario?.rol === 'institucion'}
			/>
		</svelte:fragment>
	</ProyectosBase>

	{#if usuario?.rol === 'institucion'}
		{#if verificationAprobada}
			<a
				href="/proyectos/crear"
				class="fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-full bg-[#007fff] px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-[#55aaff] hover:shadow-xl sm:right-8 sm:bottom-8"
				aria-label="Crear nuevo proyecto"
			>
				<Plus size={24} />
				<span class="font-medium">Crear proyecto</span>
			</a>
		{:else}
			<button
				disabled
				class="fixed right-6 bottom-6 z-50 flex cursor-not-allowed items-center gap-2 rounded-full bg-gray-400 px-6 py-3 text-white shadow-lg sm:right-8 sm:bottom-8"
				title="Tenés que validar tu identidad para crear proyectos"
				aria-label="Crear nuevo proyecto (Deshabilitado)"
			>
				<Plus size={24} />
				<span class="font-medium">Crear proyecto</span>
			</button>
		{/if}
	{:else if usuario?.rol === 'colaborador'}
		<a
			href="/proyectos"
			class="fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-full bg-[#007fff] px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-[#55aaff] hover:shadow-xl sm:right-8 sm:bottom-8"
			aria-label="Descubrir proyectos"
		>
			<Search size={24} />
			<span class="font-medium">Descubrir proyectos</span>
		</a>
	{/if}
</section>
