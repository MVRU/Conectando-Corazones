<script lang="ts">
	import Projects from '$lib/components/sections/Projects.svelte';
	import { onMount } from 'svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';

	onMount(() => {
		setBreadcrumbs([BREADCRUMB_ROUTES.home, { label: 'Proyectos' }]);
	});
</script>

<svelte:head>
	<title>Proyectos - Conectando Corazones</title>
	<meta
		name="description"
		content="Descubre todos los proyectos activos que necesitan tu colaboración"
	/>
</svelte:head>

<main class="relative min-h-screen w-full bg-gray-50">
	<Projects />
</main>
