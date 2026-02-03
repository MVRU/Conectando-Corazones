<script lang="ts">
	import { onMount } from 'svelte';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import DashboardColaborador from '$lib/components/dashboard/DashboardColaborador.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { usuario } = data;
	let animate = false;

	onMount(() => {
		animate = true;
	});
</script>

<svelte:head>
	<title>Panel de Colaborador - Conectando Corazones</title>
</svelte:head>

<!-- Fondo decorativo -->
<div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

<main class="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Header -->
	<div
		class="mb-8 text-center"
		class:opacity-0={!animate}
		class:translate-y-4={!animate}
		style="transition: all 0.6s ease-out"
	>
		<div class="mb-4 flex justify-center">
			<Badge text="Panel de Colaborador" />
		</div>
		<h1 class="mb-4 text-4xl font-bold text-gray-900">
			Mis <span class="text-blue-600">Colaboraciones</span>
		</h1>
	</div>

	<!-- Dashboard Principal -->
	<div
		class="transition-all duration-500"
		class:opacity-0={!animate}
		class:translate-y-8={!animate}
		style="transition-delay: 200ms"
	>
		<DashboardColaborador
			colaboradorInfo={{
				nombre: usuario.nombre || '',
				apellido: usuario.apellido || '',
				tipoColaborador: (usuario as any).tipo_colaborador || 'unipersonal',
				proyectosColaborando: data.stats.proyectosColaborando,
				aportesRealizados: data.stats.aportesRealizados,
				evaluacionesPendientes: data.stats.evaluacionesPendientes
			}}
			proyectosActivos={data.proyectos}
			evaluacionesPendientes={data.stats.evaluacionesPendientes}
		/>
	</div>
</main>
