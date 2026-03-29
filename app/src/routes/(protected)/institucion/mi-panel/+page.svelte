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
{:else if data.error}
	<div class="flex min-h-screen items-center justify-center bg-[#0F1029]">
		<div
			class="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center backdrop-blur-md"
		>
			<p class="mb-4 text-lg font-medium text-red-400">{data.error}</p>
			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-full bg-slate-800 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
			>
				Volver al inicio
			</a>
		</div>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center bg-[#0F1029]">
		<div class="text-center">
			<div
				class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500"
			></div>
			<p class="text-lg text-slate-400">Cargando datos del dashboard...</p>
		</div>
	</div>
{/if}
