<script lang="ts">
	import { onMount } from 'svelte';
	import { Filter, ChevronRight, ChevronDown, MapPin, Sparkles, School } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import QuickActions from './institucion/QuickActions.svelte';
	import DashboardMetrics from './institucion/DashboardMetrics.svelte';
	import SeguimientoObjetivos from './institucion/SeguimientoObjetivos.svelte';
	import EstadisticasAyuda from './institucion/EstadisticasAyuda.svelte';
	import TopColaboradores from './institucion/TopColaboradores.svelte';
	import ActividadReciente from './institucion/ActividadReciente.svelte';
	import UltimasResenas from './institucion/UltimasResenas.svelte';
	import AspectosMejorar from './institucion/AspectosMejorar.svelte';
	import Novedades from './institucion/Novedades.svelte';
	import type { InstitucionDashboardData } from './institucion/types';

	export let data: InstitucionDashboardData;

	// Filters state
	let filters = {
		periodo: 'mes_actual',
		categoria: 'todas',
		estado: 'en_curso',
		tipoParticipacion: 'todos',
		ubicacion: 'todas'
	};

	// Animation & Scroll
	let mounted = false;
	let filterScrollContainer: HTMLDivElement;
	let showFilterIndicator = false;
	let showFilters = false;
	let showLeftGradient = false;
	let showRightGradient = false;

	function checkFilterScroll() {
		if (!filterScrollContainer) return;
		const { scrollLeft, scrollWidth, clientWidth } = filterScrollContainer;
		showLeftGradient = scrollLeft > 10;
		showRightGradient = scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 10;
		showFilterIndicator = showRightGradient; // Keep for compatibility if needed, or remove later
	}

	onMount(() => {
		mounted = true;
		// Check scroll after a tick to allow rendering
		setTimeout(checkFilterScroll, 100);
		window.addEventListener('resize', checkFilterScroll);
		return () => window.removeEventListener('resize', checkFilterScroll);
	});
</script>

<div
	class="min-h-screen overflow-x-hidden bg-[#0F1029] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200"
>
	<!-- Noise Texture Overlay -->
	<div
		class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
		style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E');"
	></div>

	<div class="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
		<!-- Decorative Background Elements -->
		<div
			class="fixed top-0 left-1/4 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[130px]"
		></div>
		<div
			class="fixed top-20 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[120px]"
		></div>
		<div
			class="fixed bottom-0 left-1/3 -z-10 h-[300px] w-[300px] translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]"
		></div>

		<!-- Header Info -->
		<div
			class="animate-fade-in-up flex w-full flex-col justify-between gap-6 md:flex-row md:items-end"
		>
			<div class="w-full">
				<div class="mb-4 flex items-center gap-2 md:mb-6">
					<span
						class="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400"
					>
						<span class="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
						Panel Institucional
					</span>
				</div>
				<h1
					class="font-display mb-6 text-3xl font-bold tracking-tight text-white drop-shadow-sm md:mb-8 md:text-5xl lg:text-6xl"
				>
					Hola, <span
						class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
						>{data.info.nombre}</span
					>
				</h1>
				<div
					class="flex w-full flex-col justify-between gap-4 text-sm font-medium text-slate-400 md:flex-row md:items-center md:text-base"
				>
					<!-- Institution Meta -->
					<div class="flex flex-row flex-wrap items-center gap-3 md:gap-4">
						<span
							class="flex w-fit items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-blue-400 shadow-sm"
						>
							<School size={15} />
							{data.info.tipo}
						</span>
						<span class="inline-block h-1 w-1 rounded-full bg-slate-600"></span>
						<span class="flex items-center gap-1">
							<MapPin size={14} class="text-slate-500" />
							{data.info.ubicacion}
						</span>
					</div>

					<!-- Toggle Filters (Desktop: Right aligned) -->
					<button
						on:click={() => (showFilters = !showFilters)}
						class="group flex w-fit items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 transition-all hover:bg-white/10 active:scale-95"
					>
						<Filter size={14} class="text-slate-400 transition-colors group-hover:text-blue-400" />
						<span
							class="text-xs font-medium text-slate-400 transition-colors group-hover:text-slate-200"
						>
							{showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
						</span>
						<ChevronDown
							size={14}
							class="text-slate-500 transition-transform duration-300 {showFilters
								? 'rotate-180'
								: ''}"
						/>
					</button>
				</div>
			</div>
		</div>

		<!-- Quick Actions (Delay 1) -->
		<div class="animate-fade-in-up delay-100">
			<QuickActions />
		</div>

		<!-- Filters Toggle -->

		{#if showFilters}
			<div
				transition:slide={{ duration: 300, axis: 'y' }}
				class="relative flex w-full flex-col items-start justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md lg:flex-row lg:items-center"
			>
				<div class="mb-2 flex items-center gap-2 text-slate-300 lg:mb-0">
					<div class="rounded-lg bg-blue-500/10 p-2 text-blue-400">
						<Filter size={18} />
					</div>
					<span class="text-sm font-medium">Filtrar vista por:</span>
				</div>

				<div
					bind:this={filterScrollContainer}
					on:scroll={checkFilterScroll}
					class="grid w-full grid-cols-1 gap-3 pb-2 md:grid md:w-full md:grid-cols-3 md:pb-0 lg:w-auto xl:grid-cols-5"
				>
					<div class="relative w-full min-w-[140px] shrink-0 snap-start">
						<select
							bind:value={filters.periodo}
							class="w-full appearance-none rounded-lg border-white/10 bg-[#151730] py-2 pr-10 pl-3 text-xs font-medium text-slate-300 transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
						>
							<option value="mes_actual">Este mes</option>
							<option value="trimestre">Este trimestre</option>
							<option value="anio">Este año</option>
						</select>
						<ChevronDown
							size={14}
							class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
						/>
					</div>

					<div class="relative w-full min-w-[160px] shrink-0 snap-start">
						<select
							bind:value={filters.categoria}
							class="w-full appearance-none rounded-lg border-white/10 bg-[#151730] py-2 pr-10 pl-3 text-xs font-medium text-slate-300 transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
						>
							<option value="todas">Todas las categorías</option>
							<option value="educacion">Educación</option>
							<option value="salud">Salud</option>
							<option value="ambiente">Ambiente</option>
						</select>
						<ChevronDown
							size={14}
							class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
						/>
					</div>

					<div class="relative w-full min-w-[140px] shrink-0 snap-start">
						<select
							bind:value={filters.estado}
							class="w-full appearance-none rounded-lg border-white/10 bg-[#151730] py-2 pr-10 pl-3 text-xs font-medium text-slate-300 transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
						>
							<option value="todos">Todos los estados</option>
							<option value="en_curso">En curso</option>
							<option value="finalizado">Finalizado</option>
						</select>
						<ChevronDown
							size={14}
							class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
						/>
					</div>

					<div class="relative w-full min-w-[150px] shrink-0 snap-start">
						<select
							bind:value={filters.tipoParticipacion}
							class="w-full appearance-none rounded-lg border-white/10 bg-[#151730] py-2 pr-10 pl-3 text-xs font-medium text-slate-300 transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
						>
							<option value="todos">Cualquier ayuda</option>
							<option value="voluntariado">Voluntariado</option>
							<option value="monetaria">Monetaria</option>
							<option value="especie">En especie</option>
						</select>
						<ChevronDown
							size={14}
							class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
						/>
					</div>

					<div class="relative w-full min-w-[150px] shrink-0 snap-start">
						<select
							bind:value={filters.ubicacion}
							class="focus:border-primary focus:ring-primary w-full appearance-none rounded-lg border-white/10 bg-[#151730] py-2 pr-10 pl-3 text-xs font-medium text-slate-300 focus:ring-1"
						>
							<option value="todas">Todas las ubicaciones</option>
							<option value="local">Local</option>
							<option value="provincial">Provincial</option>
						</select>
						<ChevronDown
							size={14}
							class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
						/>
					</div>
				</div>

				<!-- Scroll Indicators -->
				{#if showLeftGradient}
					<div
						class="from-bg-[#0F1029] via-bg-[#0F1029]/80 pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-gradient-to-r to-transparent md:hidden"
					></div>
				{/if}
				{#if showRightGradient}
					<div
						class="to-bg-[#0F1029] via-bg-[#0F1029]/80 pointer-events-none absolute top-0 right-0 bottom-0 z-10 flex w-12 items-center justify-end bg-gradient-to-r from-transparent p-2 md:hidden"
					>
						<ChevronRight size={16} class="text-primary animate-pulse" />
					</div>
				{/if}
			</div>
		{/if}

		<!-- Metrics Cards -->
		<div class="animate-fade-in-up delay-200">
			<DashboardMetrics
				metrics={{
					proyectosActivos: data.metrics.proyectosTotales,
					colaboradores: data.metrics.colaboradoresActivos,
					nuevosColaboradores: 2,
					proximoCierre: data.metrics.diasProximoCierre
				}}
			/>
		</div>

		<!-- Main Grid Layout -->
		<div class="animate-fade-in-up grid grid-cols-1 gap-6 delay-300 lg:grid-cols-12">
			<!-- Left Column: Main Activity (7/12 width) -->
			<div class="flex flex-col gap-6 lg:col-span-7">
				<!-- Seguimiento de Objetivos -->
				<div class="min-h-[400px]">
					<SeguimientoObjetivos objetivos={data.seguimientoObjetivos} />
				</div>
				<!-- Actividad Reciente -->
				<div class="flex-1">
					<ActividadReciente actividad={data.actividadReciente} />
				</div>
			</div>

			<!-- Right Column: Sidebar Stats (5/12 width) -->
			<div class="flex flex-col gap-6 lg:col-span-5">
				<!-- Estadísticas Ayuda -->
				<div class="min-h-[300px]">
					<EstadisticasAyuda estadisticas={data.estadisticasAyuda} />
				</div>

				<!-- Top Colaboradores -->
				<!-- Top Colaboradores -->
				<div class="min-h-[300px]">
					<TopColaboradores colaboradores={data.topColaboradores} />
				</div>

				<!-- Últimas Reseñas -->
				<div class="min-h-[300px]">
					<UltimasResenas resenas={data.ultimasResenas} />
				</div>
			</div>
		</div>

		<!-- Bottom Row: Aspectos & Novedades (Delay 300 inherited or new?) Let's keep it part of flow or add delay-400 if I defined it. I didn't define 400. So I'll just wrap it in delay-300 as well or leave it. -->
		<!-- Actually, let's wrap the bottom row too for consistency -->
		<div class="animate-fade-in-up grid grid-cols-1 gap-6 delay-300 md:grid-cols-2">
			<!-- Aspectos a mejorar -->
			<div class="min-h-[200px]">
				<AspectosMejorar aspectos={data.aspectosMejorar} />
			</div>

			<!-- Novedades -->
			<div class="min-h-[200px]">
				<Novedades
					novedades={[
						{
							id: '1',
							titulo: 'Nueva función habilitada',
							fecha: new Date().toISOString(),
							contenido: 'Ahora podés exportar tus reportes en PDF.',
							imagen:
								'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
						},
						{
							id: '2',
							titulo: 'Lanzamiento a la comunidad',
							fecha: '2026-02-13',
							contenido:
								'¡Ya tenemos fecha! El 13 de febrero será el primer lanzamiento oficial de Conectando Corazones.',
							imagen:
								'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
						}
					]}
				/>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom Fade In Animation */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		opacity: 0;
	}
	.delay-100 {
		animation-delay: 100ms;
	}
	.delay-200 {
		animation-delay: 200ms;
	}
	.delay-300 {
		animation-delay: 300ms;
	}
</style>
