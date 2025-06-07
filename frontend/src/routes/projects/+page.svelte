<script lang="ts">
	import { onMount } from 'svelte';
	import Projects from '$lib/components/sections/Projects.svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';

	onMount(() => {
		setBreadcrumbs([BREADCRUMB_ROUTES.home, BREADCRUMB_ROUTES.projects]);
	});
</script>

<svelte:head>
	<title>Proyectos - Conectando Corazones</title>
	<meta
		name="description"
		content="Descubre todos los proyectos activos que necesitan tu colaboración"
	/>
</svelte:head>

<main class="min-h-screen bg-[#ffffff]">
	<section class="bg-[#f8f9fd] py-16 text-black">
		<div class="mx-auto max-w-7xl px-8 text-center">
			<h1 class="mb-4 text-4xl font-bold">Proyectos Activos</h1>
			<p class="mx-auto max-w-3xl text-lg font-bold text-[#6a7282]">
				Sumate a las iniciativas que están transformando vidas.
			</p>
		</div>
	</section>
	<Projects />
</main>
