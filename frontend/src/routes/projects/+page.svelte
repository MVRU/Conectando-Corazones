<script lang="ts">
	import { onMount } from 'svelte';
	import Projects from '$lib/components/sections/Projects.svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';

	// Establecer breadcrumbs al montar la página
	onMount(() => {
		setBreadcrumbs([
			BREADCRUMB_ROUTES.home,
			{ label: 'Proyectos' } // Sin href porque es la página actual
		]);
	});
</script>

<svelte:head>
	<title>Proyectos - Conectando Corazones</title>
	<meta name="description" content="Descubre todos los proyectos activos que necesitan tu colaboración" />
</svelte:head>

<main class="relative min-h-screen w-full bg-gray-50">
	<Projects />
</main>
