<!--
* Página: Dashboard Principal
	-*- Descripción: selector de diferentes tipos de dashboards con KPIs importantes
	-*- Funcionalidad: permite alternar entre 3 vistas diferentes de dashboard
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { goto } from '$app/navigation';

	// import { fly, fade } from 'svelte/transition';
	// import DashboardGeneral from './DashboardGeneral.svelte';
	// import DashboardAnalitico from './DashboardAnalitico.svelte';
	// import DashboardColaborador from './DashboardColaborador.svelte';
	// import DashboardInstitucion from './DashboardInstitucion.svelte';

	// let selectedDashboard: 'general' | 'analitico' | 'colaborador' | 'institucion' = 'general';
	let animate = false;

	onMount(() => {
		animate = true;
	});

	// const dashboardOptions = [
	// 	{
	// 		key: 'general' as const,
	// 		title: 'Dashboard General',
	// 		description: 'Vista completa con métricas principales en formato de tarjetas',
	// 		icon: '📊'
	// 	},
	// 	{
	// 		key: 'analitico' as const,
	// 		title: 'Dashboard Analítico',
	// 		description: 'Enfoque temporal con evolución de impacto y progreso detallado',
	// 		icon: '📈'
	// 	},
	// 	{
	// 		key: 'colaborador' as const,
	// 		title: 'Dashboard Colaborador',
	// 		description: 'Vista personalizada para seguimiento de participación individual',
	// 		icon: '🤝'
	// 	},
	// 	{
	// 		key: 'institucion' as const,
	// 		title: 'Dashboard Institución',
	// 		description: 'Panel de gestión para organizaciones que administran proyectos',
	// 		icon: '🏢'
	// 	}
	// ];
</script>

<svelte:head>
	<title>Dashboard - Conectando Corazones</title>
	<meta
		name="description"
		content="Panel de control con métricas y estadísticas de tu participación en proyectos solidarios"
	/>
</svelte:head>

<!-- Fondo decorativo -->
<div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

<main class="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Header del Dashboard -->
	<div
		class="mb-8 text-center"
		class:opacity-0={!animate}
		class:translate-y-4={!animate}
		style="transition: all 0.6s ease-out"
	>
		<div class="mb-4 flex justify-center">
			<Badge text="Panel de control" />
		</div>
		<h1 class="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
			<span
				class="bg-gradient-to-r from-[rgb(var(--color-primary))] via-blue-400 to-[rgb(var(--color-primary))] bg-clip-text text-transparent"
			>
				Tu Impacto
			</span>
		</h1>
		<p class="mx-auto max-w-2xl text-lg text-gray-600">
			Explorá diferentes perspectivas de tu participación en proyectos solidarios
		</p>
	</div>

	<!-- Acciones rápidas -->
	<div
		class="mx-auto mb-10 max-w-3xl rounded-2xl border border-blue-100 bg-white/60 p-4 shadow-sm backdrop-blur"
	>
		<p class="mb-3 text-center text-sm text-gray-600">
			Creé estos accesos directos para ir probando
		</p>
		<div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
			<Button
				label="Crear proyecto"
				variant="primary"
				size="md"
				type="button"
				on:click={() => goto('/proyectos/crear')}
			/>

			<Button
				label="Solicitudes de colaboración"
				variant="secondary"
				size="md"
				type="button"
				on:click={() => goto('/institucion/solicitudes-colaboracion')}
			/>
		</div>
	</div>
</main>

<!-- Selector de Dashboard -->
<!-- <div
		class="mb-8"
		class:opacity-0={!animate}
		class:translate-y-4={!animate}
		style="transition: all 0.8s ease-out; transition-delay: 200ms"
	>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each dashboardOptions as option, i (i)}
				<button
					class="group relative overflow-hidden rounded-2xl border transition-all duration-300 {selectedDashboard ===
					option.key
						? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-lg ring-2 ring-blue-200'
						: 'border-gray-200 bg-white/80 hover:border-blue-200 hover:bg-blue-50/50'}"
					on:click={() => (selectedDashboard = option.key)}
				>
					<div class="p-6 text-center">
						<div class="mb-3 text-3xl">{option.icon}</div>
						<h3
							class="mb-2 text-lg font-semibold transition-colors {selectedDashboard === option.key
								? 'text-blue-700'
								: 'text-gray-800 group-hover:text-blue-600'}"
						>
							{option.title}
						</h3>
						<p class="text-sm text-gray-600">
							{option.description}
						</p>
					</div>
					{#if selectedDashboard === option.key}
						<div
							class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400"
							transition:fade={{ duration: 300 }}
						></div>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	Dashboard Content 
	<div
		class="transition-all duration-500"
		class:opacity-0={!animate}
		class:translate-y-8={!animate}
		style="transition-delay: 400ms"
	>
		{#if selectedDashboard === 'general'}
			<div in:fly={{ x: -20, duration: 400 }} out:fade={{ duration: 200 }}>
				<DashboardGeneral />
			</div>
		{:else if selectedDashboard === 'analitico'}
			<div in:fly={{ x: -20, duration: 400 }} out:fade={{ duration: 200 }}>
				<DashboardAnalitico />
			</div>
		{:else if selectedDashboard === 'colaborador'}
			<div in:fly={{ x: -20, duration: 400 }} out:fade={{ duration: 200 }}>
				<DashboardColaborador />
			</div>
		{:else if selectedDashboard === 'institucion'}
			<div in:fly={{ x: -20, duration: 400 }} out:fade={{ duration: 200 }}>
				<DashboardInstitucion />
			</div>
		{/if}
	</div>
	 -->
