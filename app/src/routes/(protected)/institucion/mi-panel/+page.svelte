<script lang="ts">
	import { onMount } from 'svelte';
	import DashboardInstitucion from '$lib/components/dashboard/DashboardInstitucion.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { usuario, dashboardData } = data;

	let animate = false;

	onMount(() => {
		animate = true;
	});
</script>

<svelte:head>
	<title>Panel de institución - Conectando Corazones</title>
</svelte:head>

{#if dashboardData}
	<div
		class="w-full transition-opacity duration-700 ease-out"
		class:opacity-0={!animate}
		class:opacity-100={animate}
	>
		<DashboardInstitucion data={dashboardData} />
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center bg-[#0F1029]">
		<div class="text-center">
			<p class="text-lg text-slate-400">Cargando datos del dashboard...</p>
		</div>
	</div>
{/if}
