<script lang="ts">
	import { onMount } from 'svelte';
	import DashboardColaborador from '$lib/components/dashboard/DashboardColaborador.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let animate = false;

	onMount(() => {
		animate = true;
	});
</script>

<svelte:head>
	<title>Panel de colaborador - Conectando Corazones</title>
</svelte:head>

{#if data.dashboardData}
	<div
		class="w-full transition-opacity duration-700 ease-out"
		class:opacity-0={!animate}
		class:opacity-100={animate}
	>
		<DashboardColaborador data={data.dashboardData} />
	</div>
{:else if data.error}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<h2 class="text-2xl font-bold text-red-600">Error al cargar el dashboard</h2>
			<p class="mt-2 text-gray-600">{data.error}</p>
		</div>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div
				class="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
			></div>
			<p class="mt-4 text-gray-600">Cargando dashboard...</p>
		</div>
	</div>
{/if}
