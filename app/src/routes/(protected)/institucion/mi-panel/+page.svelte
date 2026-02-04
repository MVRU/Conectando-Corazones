<script lang="ts">
	import { onMount } from 'svelte';
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { goto } from '$app/navigation';
	import DashboardInstitucion from '$lib/components/dashboard/DashboardInstitucion.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { usuario } = data;
	let animate = false;

	onMount(() => {
		animate = true;
	});
</script>

<svelte:head>
	<title>Panel de Institución - Conectando Corazones</title>
</svelte:head>

<!-- Fondo decorativo -->
<div class="absolute inset-0 -z-10 bg-gradient-to-br from-purple-50 via-white to-blue-50"></div>

<main class="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Header -->
	<div
		class="mb-8 text-center"
		class:opacity-0={!animate}
		class:translate-y-4={!animate}
		style="transition: all 0.6s ease-out"
	>
		<div class="mb-4 flex justify-center">
			<Badge text="Panel Institucional" />
		</div>
		<h1 class="mb-4 text-4xl font-bold text-gray-900">
			Gestión de <span class="text-purple-600">Proyectos</span>
		</h1>
	</div>

	<!-- Dashboard Principal -->
	<div
		class="transition-all duration-500"
		class:opacity-0={!animate}
		class:translate-y-8={!animate}
		style="transition-delay: 200ms"
	>
		<DashboardInstitucion
			institucionInfo={{
				nombre: (usuario as any).nombre_legal || 'Institución',
				tipoInstitucion: (usuario as any).tipo_institucion || 'Institución',
				totalRecaudado: data.stats.totalRecaudado,
				proyectosPublicados: data.stats.proyectosPublicados,
				proyectosActivos: data.stats.proyectosActivos
			}}
			proyectosActivos={data.proyectos}
			solicitudesPendientes={data.solicitudesPendientes}
		/>
	</div>
</main>
